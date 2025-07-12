from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
import os
from dotenv import load_dotenv

load_dotenv()

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Mock user database (in production, use a real database)
MOCK_USERS = {
    "admin": {
        "username": "admin",
        "email": "admin@dragify.com",
        "full_name": "Admin User",
        "hashed_password": pwd_context.hash("admin123"),
        "role": "admin",
        "is_active": True
    },
    "user": {
        "username": "user",
        "email": "user@dragify.com",
        "full_name": "Regular User",
        "hashed_password": pwd_context.hash("user123"),
        "role": "user",
        "is_active": True
    }
}

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def authenticate_user(username: str, password: str) -> Optional[dict]:
    """Authenticate a user with username and password"""
    user = MOCK_USERS.get(username)
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user

def authenticate_user_by_email(email: str, password: str) -> Optional[dict]:
    """Authenticate a user with email and password"""
    # Find user by email
    for user in MOCK_USERS.values():
        if user["email"] == email:
            if verify_password(password, user["hashed_password"]):
                return user
    return None

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: Optional[str] = payload.get("sub")
        if username is None:
            return None
        return MOCK_USERS.get(username)
    except JWTError:
        return None

def get_current_user(token: str) -> dict:
    """Get current user from token"""
    user = verify_token(token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def require_auth(token: str) -> bool:
    """Check if token is valid for authentication"""
    return verify_token(token) is not None 