from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models.lead import WebhookMessage, LeadResponse, WebhookLog
from services.agent import extract_lead_info
from services.user_manager import user_manager
from services.auth import get_current_user
from database.mock_crm import save_to_crm, get_crm_stats
import json
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Optional

router = APIRouter()
security = HTTPBearer()

# Store webhook logs in memory (in production, use a proper database)
webhook_logs = []

# Egypt timezone (UTC+2)
EGYPT_TIMEZONE = timezone(timedelta(hours=2))

@router.post("/")
async def webhook_endpoint(payload: WebhookMessage):
    """Webhook endpoint for lead extraction - no authentication required"""
    # Use a default user_id if not provided
    user_id = payload.user_id or "default_user"
    session_id = payload.session_id
    
    # Create session if not provided
    if not session_id:
        session_id = user_manager.create_session(user_id)
    
    # Update session activity
    user_manager.update_session_activity(session_id)
    
    # Process the message
    message = payload.message
    lead_data = await extract_lead_info(message)
    
    # Check if any contact information was extracted
    has_contact_info = any([
        lead_data.get("name", "").strip(),
        lead_data.get("email", "").strip(),
        lead_data.get("company", "").strip()
    ])
    
    if has_contact_info:
        save_status = save_to_crm(lead_data)
    else:
        save_status = "no_contact_info"
    
    # Create log entry with user/session info
    log_entry = WebhookLog(
        id=str(len(webhook_logs) + 1),
        timestamp=datetime.now(EGYPT_TIMEZONE),
        user_id=user_id,
        session_id=session_id,
        message=message,
        extracted=lead_data,
        save_status=save_status,
        retry_info={
            "has_retries": save_status == "success" or "retry" in str(save_status),
            "final_status": save_status
        }
    )
    
    # Store in both global logs and user-specific logs
    webhook_logs.append(log_entry.model_dump())
    user_manager.add_user_log(user_id, log_entry)
    
    # Prepare response message
    if save_status == "no_contact_info":
        response_message = "No contact information found in the message. Please include a name, email, or company."
    elif save_status == "success":
        response_message = "Lead information extracted and saved successfully!"
    else:
        response_message = "Failed to save lead information."
    
    return {
        "extracted": lead_data,
        "save_status": save_status,
        "message": response_message,
        "retry_attempts": "Multiple attempts made" if save_status == "success" else "Failed after retries",
        "user_id": user_id,
        "session_id": session_id
    }

@router.get("/logs")
async def get_logs(
    user_id: Optional[str] = None, 
    limit: int = 50,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get webhook logs - requires authentication"""
    current_user = get_current_user(credentials.credentials)
    
    # Admin can see all logs, regular users only see their own
    if current_user["role"] == "admin":
        if user_id:
            # If specific user requested, get their logs
            return user_manager.get_user_logs(user_id, limit)
        else:
            # Admin sees ALL logs from global webhook_logs (including Postman requests)
            return webhook_logs[-limit:]
    else:
        # Regular users can only see their own logs
        # Use email as user_id since that's what frontend sends
        user_identifier = current_user["email"]
        return user_manager.get_user_logs(user_identifier, limit)

@router.get("/crm-stats")
async def get_crm_statistics(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get CRM statistics - requires authentication"""
    current_user = get_current_user(credentials.credentials)
    return get_crm_stats()

@router.post("/session")
async def create_session(
    user_id: Optional[str] = None,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Create a new session for a user - requires authentication"""
    current_user = get_current_user(credentials.credentials)
    session_id = user_manager.create_session(user_id or current_user["username"])
    session = user_manager.get_session(session_id)
    if session:
        return {
            "session_id": session_id,
            "user_id": session.user_id,
            "created_at": session.created_at.isoformat()
        }
    else:
        raise HTTPException(status_code=500, detail="Failed to create session")

@router.get("/users/{user_id}/stats")
async def get_user_statistics(
    user_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get statistics for a specific user - requires authentication"""
    current_user = get_current_user(credentials.credentials)
    
    # Admin can see any user's stats, regular users only their own
    if current_user["role"] != "admin" and current_user["username"] != user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return user_manager.get_user_stats(user_id)

@router.get("/users/stats")
async def get_all_users_statistics(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get statistics for all users (admin only) - requires authentication"""
    current_user = get_current_user(credentials.credentials)
    
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return user_manager.get_all_users_stats()

@router.get("/sessions/cleanup")
async def cleanup_sessions(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Clean up expired sessions (admin only) - requires authentication"""
    current_user = get_current_user(credentials.credentials)
    
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    removed_count = user_manager.cleanup_expired_sessions()
    return {
        "removed_sessions": removed_count,
        "active_sessions": len(user_manager.sessions)
    }
