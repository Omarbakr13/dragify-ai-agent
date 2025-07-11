from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class WebhookMessage(BaseModel):
    message: str
    user_id: Optional[str] = Field(default=None, description="User ID for multi-user support")
    session_id: Optional[str] = Field(default=None, description="Session ID for tracking")

class LeadResponse(BaseModel):
    name: str
    email: str
    company: str

class UserSession(BaseModel):
    user_id: str
    session_id: str
    created_at: datetime
    last_activity: datetime
    total_requests: int = 0

class WebhookLog(BaseModel):
    id: str
    timestamp: datetime
    user_id: Optional[str]
    session_id: Optional[str]
    message: str
    extracted: dict
    save_status: str
    retry_info: Optional[dict] = None
