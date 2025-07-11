from fastapi import APIRouter, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.lead import WebhookMessage, LeadResponse, WebhookLog
from services.agent import extract_lead_info
from services.user_manager import user_manager
from database.mock_crm import save_to_crm, get_crm_stats
import json
from datetime import datetime
from pathlib import Path
from typing import Optional

router = APIRouter()

# Store webhook logs in memory (in production, use a proper database)
webhook_logs = []

@router.post("/")
async def webhook_endpoint(payload: WebhookMessage):
    # Handle user/session management
    user_id = payload.user_id or f"user_{len(webhook_logs) + 1}"
    session_id = payload.session_id
    
    # Create session if not provided
    if not session_id:
        session_id = user_manager.create_session(user_id)
    
    # Update session activity
    user_manager.update_session_activity(session_id)
    
    # Process the message
    message = payload.message
    lead_data = await extract_lead_info(message)
    
    save_status = save_to_crm(lead_data)
    
    # Create log entry with user/session info
    log_entry = WebhookLog(
        id=str(len(webhook_logs) + 1),
        timestamp=datetime.now(),
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
    webhook_logs.append(log_entry.dict())
    user_manager.add_user_log(user_id, log_entry)
    
    return {
        "extracted": lead_data,
        "save_status": save_status,
        "retry_attempts": "Multiple attempts made" if save_status == "success" else "Failed after retries",
        "user_id": user_id,
        "session_id": session_id
    }

@router.get("/logs")
async def get_logs(user_id: Optional[str] = None, limit: int = 50):
    """Get webhook logs, optionally filtered by user"""
    if user_id:
        return user_manager.get_user_logs(user_id, limit)
    return webhook_logs[-limit:]

@router.get("/crm-stats")
async def get_crm_statistics():
    """Get CRM statistics including total leads and file info"""
    return get_crm_stats()

@router.post("/session")
async def create_session(user_id: Optional[str] = None):
    """Create a new session for a user"""
    session_id = user_manager.create_session(user_id)
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
async def get_user_statistics(user_id: str):
    """Get statistics for a specific user"""
    return user_manager.get_user_stats(user_id)

@router.get("/users/stats")
async def get_all_users_statistics():
    """Get statistics for all users"""
    return user_manager.get_all_users_stats()

@router.get("/sessions/cleanup")
async def cleanup_sessions():
    """Clean up expired sessions"""
    removed_count = user_manager.cleanup_expired_sessions()
    return {
        "removed_sessions": removed_count,
        "active_sessions": len(user_manager.sessions)
    }
