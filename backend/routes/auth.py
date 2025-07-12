from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from services.auth import authenticate_user_by_email, create_access_token, get_current_user, get_password_hash, MOCK_USERS
from models.auth import UserLogin, Token, User, UserCreate
from datetime import timedelta

router = APIRouter()
security = HTTPBearer()

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Login endpoint to get JWT token"""
    user = authenticate_user_by_email(user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user["username"],
        "role": user["role"]
    }

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if email already exists
    for existing_user in MOCK_USERS.values():
        if existing_user["email"] == user_data.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Check if username already exists
    if user_data.username in MOCK_USERS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Create new user
    new_user = {
        "username": user_data.username,
        "email": user_data.email,
        "full_name": user_data.full_name or user_data.username,  # Use username as fallback
        "hashed_password": get_password_hash(user_data.password),
        "role": user_data.role,
        "is_active": True  # New users are active by default
    }
    
    # Add to mock database (in production, save to real database)
    MOCK_USERS[user_data.username] = new_user
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": new_user["username"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": new_user["username"],
        "role": new_user["role"]
    }

@router.get("/me", response_model=User)
async def get_current_user_info(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user information"""
    user = get_current_user(credentials.credentials)
    return {
        "username": user["username"],
        "email": user["email"],
        "role": user["role"],
        "full_name": user.get("full_name", user["username"])
    }

@router.post("/verify")
async def verify_token_endpoint(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify if token is valid"""
    try:
        user = get_current_user(credentials.credentials)
        return {
            "valid": True,
            "username": user["username"],
            "role": user["role"]
        }
    except HTTPException:
        return {"valid": False}

@router.put("/users/{user_id}/toggle")
async def toggle_user_status(
    user_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Toggle user active status (admin only)"""
    current_user = get_current_user(credentials.credentials)
    
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Find user by username (since user_id is the username in our mock system)
    if user_id not in MOCK_USERS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Toggle the is_active status
    # For now, we'll add an is_active field to the user data
    if "is_active" not in MOCK_USERS[user_id]:
        MOCK_USERS[user_id]["is_active"] = True
    
    MOCK_USERS[user_id]["is_active"] = not MOCK_USERS[user_id]["is_active"]
    
    return {
        "user_id": user_id,
        "is_active": MOCK_USERS[user_id]["is_active"],
        "message": f"User {user_id} {'activated' if MOCK_USERS[user_id]['is_active'] else 'deactivated'}"
    }

@router.get("/users")
async def get_users(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get list of users (admin only)"""
    user = get_current_user(credentials.credentials)
    if user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return [
        {
            "id": user_data["username"],  # Use username as ID
            "username": user_data["username"],
            "email": user_data["email"],
            "full_name": user_data.get("full_name", user_data["username"]),
            "role": user_data["role"],
            "is_active": user_data.get("is_active", True)  # Default to active
        }
        for user_data in MOCK_USERS.values()
    ] 