import uuid
from datetime import datetime, timedelta
from typing import Dict, Optional, List
from models.lead import UserSession, WebhookLog
import logging

logger = logging.getLogger(__name__)

class UserManager:
    """Manages user sessions and multi-user support"""
    
    def __init__(self):
        self.sessions: Dict[str, UserSession] = {}
        self.user_logs: Dict[str, List[WebhookLog]] = {}
        self.session_timeout = timedelta(hours=24)  # 24 hour session timeout
    
    def create_session(self, user_id: Optional[str] = None) -> str:
        """
        Create a new session for a user
        
        Args:
            user_id: Optional user ID, generates one if not provided
            
        Returns:
            Session ID
        """
        if not user_id:
            user_id = f"user_{uuid.uuid4().hex[:8]}"
        
        session_id = f"session_{uuid.uuid4().hex[:8]}"
        now = datetime.now()
        
        session = UserSession(
            user_id=user_id,
            session_id=session_id,
            created_at=now,
            last_activity=now,
            total_requests=0
        )
        
        self.sessions[session_id] = session
        self.user_logs[user_id] = []
        
        logger.info(f"Created session {session_id} for user {user_id}")
        return session_id
    
    def get_session(self, session_id: str) -> Optional[UserSession]:
        """Get session by session ID"""
        return self.sessions.get(session_id)
    
    def update_session_activity(self, session_id: str) -> bool:
        """
        Update session activity timestamp
        
        Args:
            session_id: Session ID to update
            
        Returns:
            True if session exists and was updated, False otherwise
        """
        if session_id in self.sessions:
            self.sessions[session_id].last_activity = datetime.now()
            self.sessions[session_id].total_requests += 1
            return True
        return False
    
    def cleanup_expired_sessions(self) -> int:
        """
        Remove expired sessions
        
        Returns:
            Number of sessions removed
        """
        now = datetime.now()
        expired_sessions = []
        
        for session_id, session in self.sessions.items():
            if now - session.last_activity > self.session_timeout:
                expired_sessions.append(session_id)
        
        for session_id in expired_sessions:
            del self.sessions[session_id]
            logger.info(f"Removed expired session {session_id}")
        
        return len(expired_sessions)
    
    def add_user_log(self, user_id: str, log_entry: WebhookLog) -> None:
        """Add a log entry for a specific user"""
        if user_id not in self.user_logs:
            self.user_logs[user_id] = []
        
        self.user_logs[user_id].append(log_entry)
        
        # Keep only last 100 logs per user
        if len(self.user_logs[user_id]) > 100:
            self.user_logs[user_id] = self.user_logs[user_id][-100:]
    
    def get_user_logs(self, user_id: str, limit: int = 50) -> List[WebhookLog]:
        """Get logs for a specific user"""
        if user_id not in self.user_logs:
            return []
        
        return self.user_logs[user_id][-limit:]
    
    def get_user_stats(self, user_id: str) -> Dict:
        """Get statistics for a specific user"""
        if user_id not in self.user_logs:
            return {
                "total_requests": 0,
                "success_rate": 0,
                "last_activity": None,
                "active_sessions": 0
            }
        
        logs = self.user_logs[user_id]
        total_requests = len(logs)
        successful_requests = len([log for log in logs if log.save_status == "success"])
        success_rate = (successful_requests / total_requests * 100) if total_requests > 0 else 0
        
        # Count active sessions for this user
        active_sessions = len([
            session for session in self.sessions.values() 
            if session.user_id == user_id and 
            datetime.now() - session.last_activity <= self.session_timeout
        ])
        
        last_activity = max([log.timestamp for log in logs]) if logs else None
        
        return {
            "total_requests": total_requests,
            "success_rate": round(success_rate, 2),
            "last_activity": last_activity.isoformat() if last_activity else None,
            "active_sessions": active_sessions
        }
    
    def get_all_users_stats(self) -> Dict:
        """Get statistics for all users"""
        user_ids = set(self.user_logs.keys())
        stats = {}
        
        for user_id in user_ids:
            stats[user_id] = self.get_user_stats(user_id)
        
        return stats

# Global user manager instance
user_manager = UserManager() 