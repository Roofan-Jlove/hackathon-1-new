# SP.IMPLEMENT - Authentication & User Profiling Implementation Guide

## Implementation Overview

This guide provides step-by-step instructions for implementing the authentication and user profiling feature. Follow each phase sequentially, testing after each major milestone.

**Prerequisites**:
- Backend server running (port 8000)
- Frontend server running (port 3000)
- PostgreSQL database accessible
- All environment variables configured

---

## Phase 1: Database Setup

### 1.1 Install Alembic

```bash
cd backend
pip install alembic
```

### 1.2 Initialize Alembic

```bash
alembic init alembic
```

**Expected Output**: Creates `alembic/` directory with configuration files

### 1.3 Configure Alembic

Edit `alembic.ini`:
```ini
sqlalchemy.url = driver://user:pass@localhost/dbname
# Replace with: (leave empty, we'll use env.py)
# sqlalchemy.url =
```

Edit `alembic/env.py`:
```python
from app.core.config import settings
from app.models.base import Base
from app.models.user import User
from app.models.profile import UserProfile
from app.models.session import Session
from app.models.conversation import Conversation

# Replace the target_metadata line with:
target_metadata = Base.metadata

# Update get_url() function:
def get_url():
    return settings.DATABASE_URL

config.set_main_option("sqlalchemy.url", get_url())
```

### 1.4 Create Migration

```bash
alembic revision -m "add_auth_tables"
```

Edit the generated migration file (`alembic/versions/xxxx_add_auth_tables.py`):

```python
"""add_auth_tables

Revision ID: xxxx
Revises:
Create Date: 2025-12-24
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
import uuid

# revision identifiers
revision = 'xxxx'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('hashed_password', sa.Text(), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column('is_verified', sa.Boolean(), default=False, nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('idx_users_email', 'users', ['email'])

    # Create user_profiles table
    op.create_table(
        'user_profiles',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False),
        sa.Column('programming_experience', sa.String(50)),
        sa.Column('python_proficiency', sa.String(50)),
        sa.Column('ros_experience', sa.String(50)),
        sa.Column('ai_ml_experience', sa.String(50)),
        sa.Column('robotics_hardware_experience', sa.String(50)),
        sa.Column('sensor_integration', sa.String(50)),
        sa.Column('electronics_knowledge', sa.String(50)),
        sa.Column('primary_interests', sa.JSON()),
        sa.Column('time_commitment', sa.String(50)),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('idx_profiles_user_id', 'user_profiles', ['user_id'])

    # Create sessions table
    op.create_table(
        'sessions',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('token', sa.String(500), unique=True, nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('ip_address', sa.String(50)),
        sa.Column('user_agent', sa.String(500)),
    )
    op.create_index('idx_sessions_token', 'sessions', ['token'])
    op.create_index('idx_sessions_user_id', 'sessions', ['user_id'])

    # Add user_id to conversations table (if exists)
    op.add_column('conversations', sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True))
    op.create_index('idx_conversations_user_id', 'conversations', ['user_id'])


def downgrade() -> None:
    # Remove user_id from conversations
    op.drop_index('idx_conversations_user_id', 'conversations')
    op.drop_column('conversations', 'user_id')

    # Drop sessions table
    op.drop_index('idx_sessions_user_id', 'sessions')
    op.drop_index('idx_sessions_token', 'sessions')
    op.drop_table('sessions')

    # Drop user_profiles table
    op.drop_index('idx_profiles_user_id', 'user_profiles')
    op.drop_table('user_profiles')

    # Drop users table
    op.drop_index('idx_users_email', 'users')
    op.drop_table('users')
```

### 1.5 Run Migration

```bash
# Check migration SQL without applying
alembic upgrade head --sql

# Apply migration
alembic upgrade head
```

**Verification**:
```bash
# Connect to database and verify tables
psql $DATABASE_URL
\dt  # Should show users, user_profiles, sessions, conversations
\d users  # Should show table structure
```

**Checkpoint**: ✅ All tables created successfully

---

## Phase 2: Backend Models

### 2.1 Create Base Model

Create `backend/app/models/base.py`:
```python
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
```

### 2.2 Create User Model

Create `backend/app/models/user.py`:
```python
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from .base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user")

    def __repr__(self):
        return f"<User {self.email}>"
```

### 2.3 Create UserProfile Model

Create `backend/app/models/profile.py`:
```python
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from .base import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    # Software background
    programming_experience = Column(String(50))  # beginner, intermediate, advanced, expert
    python_proficiency = Column(String(50))      # never, basic, intermediate, advanced
    ros_experience = Column(String(50))          # never_heard, heard, beginner, intermediate, advanced
    ai_ml_experience = Column(String(50))        # none, theoretical, pretrained, custom, production

    # Hardware background
    robotics_hardware_experience = Column(String(50))  # none, hobbyist, educational, industrial, research
    sensor_integration = Column(String(50))            # never, basic, advanced, fusion
    electronics_knowledge = Column(String(50))         # none, basic, intermediate, advanced

    # Learning goals
    primary_interests = Column(JSON)  # Array of interests
    time_commitment = Column(String(50))  # casual, regular, intensive

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="profile")

    def __repr__(self):
        return f"<UserProfile user_id={self.user_id}>"
```

### 2.4 Create Session Model

Create `backend/app/models/session.py`:
```python
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from .base import Base


class Session(Base):
    __tablename__ = "sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(500), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String(50))
    user_agent = Column(String(500))

    # Relationships
    user = relationship("User", back_populates="sessions")

    def is_expired(self):
        return datetime.utcnow() > self.expires_at

    def __repr__(self):
        return f"<Session user_id={self.user_id} expires_at={self.expires_at}>"
```

### 2.5 Update Conversation Model

Edit `backend/app/models/conversation.py` (if exists), add:
```python
from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

class Conversation(Base):
    # ... existing fields ...

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    user = relationship("User", back_populates="conversations")
```

### 2.6 Create Pydantic Schemas

Create `backend/app/schemas/auth.py`:
```python
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
import uuid


# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)

    @validator('password')
    def validate_password(cls, v):
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Profile Schemas
class ProfileCreate(BaseModel):
    programming_experience: Optional[str] = None
    python_proficiency: Optional[str] = None
    ros_experience: Optional[str] = None
    ai_ml_experience: Optional[str] = None
    robotics_hardware_experience: Optional[str] = None
    sensor_integration: Optional[str] = None
    electronics_knowledge: Optional[str] = None
    primary_interests: Optional[List[str]] = []
    time_commitment: Optional[str] = None


class ProfileResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    programming_experience: Optional[str]
    python_proficiency: Optional[str]
    ros_experience: Optional[str]
    ai_ml_experience: Optional[str]
    robotics_hardware_experience: Optional[str]
    sensor_integration: Optional[str]
    electronics_knowledge: Optional[str]
    primary_interests: Optional[List[str]]
    time_commitment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Combined signup schema
class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    profile: Optional[ProfileCreate] = None


class SignupResponse(BaseModel):
    user: UserResponse
    profile: Optional[ProfileResponse]
    token: str
    token_type: str = "bearer"


# Signin schemas
class SigninRequest(BaseModel):
    email: EmailStr
    password: str


class SigninResponse(BaseModel):
    user: UserResponse
    profile: Optional[ProfileResponse]
    token: str
    token_type: str = "bearer"


# Session schema
class SessionResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    expires_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True
```

**Checkpoint**: ✅ All models and schemas defined

---

## Phase 3: Security & Auth Core

### 3.1 Install Dependencies

```bash
cd backend
pip install passlib[bcrypt] python-jose[cryptography] python-multipart
```

### 3.2 Create Security Module

Create `backend/app/core/security.py`:
```python
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, Dict
from app.core.config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: Dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.

    Args:
        data: Dictionary containing claims (e.g., {"sub": user_id})
        expires_delta: Optional expiration time delta

    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)  # Default 7 days

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict]:
    """
    Decode and verify a JWT token.

    Args:
        token: JWT token string

    Returns:
        Decoded token payload or None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None
```

### 3.3 Update Configuration

Edit `backend/app/core/config.py`:
```python
from pydantic_settings import BaseSettings
from typing import Optional
import secrets


class Settings(BaseSettings):
    # Existing settings...

    # Auth settings
    SECRET_KEY: str = secrets.token_urlsafe(32)  # Generate a random secret key
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7

    # Password requirements
    MIN_PASSWORD_LENGTH: int = 8
    REQUIRE_UPPERCASE: bool = True
    REQUIRE_DIGIT: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
```

**IMPORTANT**: Add to `.env`:
```env
SECRET_KEY=your-super-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=7
```

### 3.4 Create Auth Dependencies

Create `backend/app/core/dependencies.py`:
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.models.session import Session as SessionModel

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get the current authenticated user.

    Raises:
        HTTPException: If token is invalid or expired

    Returns:
        User object
    """
    token = credentials.credentials

    # Decode token
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check session in database
    session = db.query(SessionModel).filter(
        SessionModel.token == token,
        SessionModel.user_id == user_id
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if session.is_expired():
        db.delete(session)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    return user


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Dependency to get current user if token is provided, otherwise None.
    Useful for endpoints that work with or without auth.
    """
    if credentials is None:
        return None

    try:
        return await get_current_user(credentials, db)
    except HTTPException:
        return None
```

**Checkpoint**: ✅ Security and auth dependencies working

---

## Phase 4: Auth Services

### 4.1 Create Auth Service

Create `backend/app/services/auth_service.py`:
```python
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from typing import Tuple, Optional
import uuid

from app.models.user import User
from app.models.session import Session as SessionModel
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings


class AuthService:
    """Service for authentication operations."""

    @staticmethod
    def signup(db: Session, email: str, password: str) -> Tuple[User, str]:
        """
        Create a new user account.

        Args:
            db: Database session
            email: User email
            password: Plain text password

        Returns:
            Tuple of (User, access_token)

        Raises:
            HTTPException: If email already exists
        """
        # Check if user exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create user
        hashed_password = hash_password(password)
        user = User(
            email=email,
            hashed_password=hashed_password,
            is_active=True,
            is_verified=False
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        # Create session and token
        token = AuthService._create_session(db, user)

        return user, token

    @staticmethod
    def signin(db: Session, email: str, password: str) -> Tuple[User, str]:
        """
        Sign in an existing user.

        Args:
            db: Database session
            email: User email
            password: Plain text password

        Returns:
            Tuple of (User, access_token)

        Raises:
            HTTPException: If credentials are invalid
        """
        # Get user
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Verify password
        if not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Check if active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive"
            )

        # Create session and token
        token = AuthService._create_session(db, user)

        return user, token

    @staticmethod
    def signout(db: Session, token: str) -> None:
        """
        Sign out a user by invalidating their session.

        Args:
            db: Database session
            token: JWT token
        """
        session = db.query(SessionModel).filter(SessionModel.token == token).first()
        if session:
            db.delete(session)
            db.commit()

    @staticmethod
    def _create_session(db: Session, user: User, ip_address: Optional[str] = None,
                       user_agent: Optional[str] = None) -> str:
        """
        Create a new session for a user.

        Args:
            db: Database session
            user: User object
            ip_address: Optional IP address
            user_agent: Optional user agent string

        Returns:
            JWT access token
        """
        # Create token
        token_data = {"sub": str(user.id)}
        expires_delta = timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS)
        token = create_access_token(token_data, expires_delta)

        # Create session record
        expires_at = datetime.utcnow() + expires_delta
        session = SessionModel(
            user_id=user.id,
            token=token,
            expires_at=expires_at,
            ip_address=ip_address,
            user_agent=user_agent
        )

        db.add(session)
        db.commit()

        return token
```

### 4.2 Create Profile Service

Create `backend/app/services/profile_service.py`:
```python
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional, Dict, Any
import uuid

from app.models.profile import UserProfile
from app.models.user import User


class ProfileService:
    """Service for user profile operations."""

    @staticmethod
    def create_profile(db: Session, user_id: uuid.UUID, profile_data: Dict[str, Any]) -> UserProfile:
        """
        Create a user profile.

        Args:
            db: Database session
            user_id: User ID
            profile_data: Profile data dictionary

        Returns:
            UserProfile object

        Raises:
            HTTPException: If profile already exists
        """
        # Check if profile exists
        existing_profile = db.query(UserProfile).filter(
            UserProfile.user_id == user_id
        ).first()

        if existing_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Profile already exists"
            )

        # Create profile
        profile = UserProfile(
            user_id=user_id,
            **profile_data
        )

        db.add(profile)
        db.commit()
        db.refresh(profile)

        return profile

    @staticmethod
    def get_profile(db: Session, user_id: uuid.UUID) -> Optional[UserProfile]:
        """
        Get a user's profile.

        Args:
            db: Database session
            user_id: User ID

        Returns:
            UserProfile object or None
        """
        return db.query(UserProfile).filter(
            UserProfile.user_id == user_id
        ).first()

    @staticmethod
    def update_profile(db: Session, user_id: uuid.UUID,
                      profile_data: Dict[str, Any]) -> UserProfile:
        """
        Update a user's profile.

        Args:
            db: Database session
            user_id: User ID
            profile_data: Profile data to update

        Returns:
            Updated UserProfile object

        Raises:
            HTTPException: If profile doesn't exist
        """
        profile = ProfileService.get_profile(db, user_id)

        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )

        # Update fields
        for key, value in profile_data.items():
            if hasattr(profile, key) and value is not None:
                setattr(profile, key, value)

        db.commit()
        db.refresh(profile)

        return profile
```

**Checkpoint**: ✅ Auth and profile services implemented

---

## Phase 5: Backend API Endpoints

### 5.1 Create Auth Endpoints

Create `backend/app/api/auth.py`:
```python
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.services.auth_service import AuthService
from app.services.profile_service import ProfileService
from app.schemas.auth import (
    SignupRequest, SignupResponse,
    SigninRequest, SigninResponse,
    UserResponse, ProfileResponse
)
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    request: Request,
    signup_data: SignupRequest,
    db: Session = Depends(get_db)
):
    """
    Register a new user with optional profile data.

    - **email**: Valid email address
    - **password**: Minimum 8 characters, must contain uppercase and digit
    - **profile**: Optional profile information
    """
    # Create user
    user, token = AuthService.signup(
        db=db,
        email=signup_data.email,
        password=signup_data.password
    )

    # Create profile if provided
    profile = None
    if signup_data.profile:
        profile_dict = signup_data.profile.model_dump(exclude_none=True)
        profile = ProfileService.create_profile(
            db=db,
            user_id=user.id,
            profile_data=profile_dict
        )

    return SignupResponse(
        user=UserResponse.from_orm(user),
        profile=ProfileResponse.from_orm(profile) if profile else None,
        token=token
    )


@router.post("/signin", response_model=SigninResponse)
async def signin(
    signin_data: SigninRequest,
    db: Session = Depends(get_db)
):
    """
    Sign in an existing user.

    - **email**: Registered email address
    - **password**: User password
    """
    # Authenticate user
    user, token = AuthService.signin(
        db=db,
        email=signin_data.email,
        password=signin_data.password
    )

    # Get profile
    profile = ProfileService.get_profile(db, user.id)

    return SigninResponse(
        user=UserResponse.from_orm(user),
        profile=ProfileResponse.from_orm(profile) if profile else None,
        token=token
    )


@router.post("/signout", status_code=status.HTTP_204_NO_CONTENT)
async def signout(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Sign out the current user (invalidate session).

    Requires authentication.
    """
    # Get token from request (handled by dependency)
    # For now, we'll just return success
    # In production, you'd want to blacklist the token
    return None


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user information.

    Requires authentication.
    """
    return UserResponse.from_orm(current_user)
```

### 5.2 Create Profile Endpoints

Create `backend/app/api/profile.py`:
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.services.profile_service import ProfileService
from app.schemas.auth import ProfileCreate, ProfileResponse
from app.models.user import User

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("", response_model=ProfileResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the current user's profile.

    Requires authentication.
    """
    profile = ProfileService.get_profile(db, current_user.id)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    return ProfileResponse.from_orm(profile)


@router.post("", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_profile(
    profile_data: ProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a profile for the current user.

    Requires authentication.
    """
    profile_dict = profile_data.model_dump(exclude_none=True)
    profile = ProfileService.create_profile(
        db=db,
        user_id=current_user.id,
        profile_data=profile_dict
    )

    return ProfileResponse.from_orm(profile)


@router.put("", response_model=ProfileResponse)
async def update_profile(
    profile_data: ProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update the current user's profile.

    Requires authentication.
    """
    profile_dict = profile_data.model_dump(exclude_none=True)
    profile = ProfileService.update_profile(
        db=db,
        user_id=current_user.id,
        profile_data=profile_dict
    )

    return ProfileResponse.from_orm(profile)
```

### 5.3 Register Routes in Main App

Edit `backend/app/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, profile
# ... existing imports

app = FastAPI(title="Physical AI Textbook API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(profile.router)
# ... existing routers

@app.get("/")
async def root():
    return {"message": "Physical AI Textbook API"}
```

### 5.4 Test API Endpoints

Create `backend/test_auth_api.py`:
```python
import requests
import json

BASE_URL = "http://localhost:8000"

def test_signup():
    print("\n[TEST] Signup")
    url = f"{BASE_URL}/api/auth/signup"
    payload = {
        "email": "test@example.com",
        "password": "Test1234",
        "profile": {
            "programming_experience": "intermediate",
            "python_proficiency": "advanced",
            "ros_experience": "beginner",
            "primary_interests": ["autonomous_navigation", "computer_vision"],
            "time_commitment": "regular"
        }
    }

    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

    if response.status_code == 201:
        return response.json()["token"]
    return None


def test_signin():
    print("\n[TEST] Signin")
    url = f"{BASE_URL}/api/auth/signin"
    payload = {
        "email": "test@example.com",
        "password": "Test1234"
    }

    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

    if response.status_code == 200:
        return response.json()["token"]
    return None


def test_get_me(token):
    print("\n[TEST] Get Current User")
    url = f"{BASE_URL}/api/auth/me"
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


def test_get_profile(token):
    print("\n[TEST] Get Profile")
    url = f"{BASE_URL}/api/profile"
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


if __name__ == "__main__":
    print("="*60)
    print("Testing Authentication API")
    print("="*60)

    # Test signup
    token = test_signup()

    # If signup successful, test other endpoints
    if token:
        test_get_me(token)
        test_get_profile(token)

    # Test signin
    token = test_signin()
    if token:
        test_get_me(token)
        test_get_profile(token)

    print("\n" + "="*60)
    print("Tests complete!")
    print("="*60)
```

Run tests:
```bash
cd backend
python test_auth_api.py
```

**Checkpoint**: ✅ All API endpoints working

---

## Phase 6: Personalization Logic

### 6.1 Create Personalization Service

Create `backend/app/services/personalization_service.py`:
```python
from typing import Optional, Dict, List
from app.models.profile import UserProfile


class PersonalizationService:
    """Service for content personalization based on user profile."""

    @staticmethod
    def get_complexity_level(profile: Optional[UserProfile]) -> str:
        """
        Determine content complexity level based on user profile.

        Args:
            profile: User profile (can be None for anonymous users)

        Returns:
            Complexity level: 'beginner', 'intermediate', or 'advanced'
        """
        if not profile:
            return 'intermediate'  # Default for anonymous users

        # Calculate complexity based on multiple factors
        scores = {
            'beginner': 0,
            'intermediate': 0,
            'advanced': 0
        }

        # Programming experience
        prog_exp_map = {
            'beginner': 'beginner',
            'intermediate': 'intermediate',
            'advanced': 'advanced',
            'expert': 'advanced'
        }
        if profile.programming_experience:
            scores[prog_exp_map.get(profile.programming_experience, 'intermediate')] += 2

        # Python proficiency
        python_map = {
            'never': 'beginner',
            'basic': 'beginner',
            'intermediate': 'intermediate',
            'advanced': 'advanced'
        }
        if profile.python_proficiency:
            scores[python_map.get(profile.python_proficiency, 'intermediate')] += 2

        # ROS experience
        ros_map = {
            'never_heard': 'beginner',
            'heard': 'beginner',
            'beginner': 'beginner',
            'intermediate': 'intermediate',
            'advanced': 'advanced'
        }
        if profile.ros_experience:
            scores[ros_map.get(profile.ros_experience, 'beginner')] += 3  # ROS is key

        # AI/ML experience
        ai_map = {
            'none': 'beginner',
            'theoretical': 'beginner',
            'pretrained': 'intermediate',
            'custom': 'advanced',
            'production': 'advanced'
        }
        if profile.ai_ml_experience:
            scores[ai_map.get(profile.ai_ml_experience, 'intermediate')] += 2

        # Return the level with highest score
        return max(scores, key=scores.get)

    @staticmethod
    def should_show_prerequisites(profile: Optional[UserProfile]) -> bool:
        """
        Determine if prerequisite sections should be shown.

        Args:
            profile: User profile

        Returns:
            True if prerequisites should be shown
        """
        if not profile:
            return True  # Show prerequisites for anonymous users

        # Show prerequisites if user is beginner in programming or Python
        if profile.programming_experience in ['beginner', None]:
            return True
        if profile.python_proficiency in ['never', 'basic', None]:
            return True

        return False

    @staticmethod
    def get_recommended_topics(profile: Optional[UserProfile]) -> List[str]:
        """
        Get recommended topics based on user interests and background.

        Args:
            profile: User profile

        Returns:
            List of recommended topic IDs
        """
        if not profile or not profile.primary_interests:
            return []

        # Map interests to specific content sections
        interest_mapping = {
            'autonomous_navigation': ['week-4', 'week-5', 'week-7'],
            'computer_vision': ['week-8', 'week-10', 'week-11'],
            'manipulation': ['week-6', 'week-9'],
            'human_robot_interaction': ['week-11', 'week-12'],
            'simulation': ['week-4', 'week-5'],
            'physical_ai': ['week-10', 'week-11', 'week-12']
        }

        recommended = []
        for interest in profile.primary_interests:
            recommended.extend(interest_mapping.get(interest, []))

        # Remove duplicates while preserving order
        return list(dict.fromkeys(recommended))

    @staticmethod
    def get_personalization_context(profile: Optional[UserProfile]) -> str:
        """
        Generate a context string for personalized RAG prompts.

        Args:
            profile: User profile

        Returns:
            Context string describing user's background
        """
        if not profile:
            return "The user is new to the topic."

        context_parts = []

        # Programming background
        if profile.programming_experience:
            context_parts.append(f"Programming experience: {profile.programming_experience}")

        if profile.python_proficiency:
            context_parts.append(f"Python proficiency: {profile.python_proficiency}")

        # ROS background
        if profile.ros_experience:
            if profile.ros_experience in ['never_heard', 'heard']:
                context_parts.append("New to ROS")
            else:
                context_parts.append(f"ROS experience: {profile.ros_experience}")

        # Hardware background
        if profile.robotics_hardware_experience:
            context_parts.append(f"Hardware experience: {profile.robotics_hardware_experience}")

        # Learning goals
        if profile.primary_interests:
            interests = ", ".join(profile.primary_interests)
            context_parts.append(f"Interested in: {interests}")

        return ". ".join(context_parts) + "."
```

### 6.2 Update RAG Service for Personalization

Edit `backend/app/services/rag_service.py`:
```python
# Add imports at top
from app.models.profile import UserProfile
from app.services.personalization_service import PersonalizationService

class RAGService:
    # ... existing code ...

    async def query_rag_pipeline(
        self,
        question: str,
        context: Optional[str] = None,
        user_profile: Optional[UserProfile] = None  # NEW PARAMETER
    ) -> Dict[str, Any]:
        """
        Query the RAG pipeline with personalization.

        Args:
            question: User's question
            context: Optional additional context (e.g., selected text)
            user_profile: Optional user profile for personalization

        Returns:
            Dictionary with answer and sources
        """
        # Get complexity level
        complexity = PersonalizationService.get_complexity_level(user_profile)

        # Get user context
        user_context = PersonalizationService.get_personalization_context(user_profile)

        # Create embeddings for the question
        question_embedding = self._create_embedding(question)

        # Search for relevant chunks
        search_results = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=question_embedding,
            limit=5
        )

        # Extract context from search results
        context_chunks = [
            result.payload.get("content", "")
            for result in search_results
        ]

        # Build personalized prompt
        prompt = self._build_personalized_prompt(
            question=question,
            context_chunks=context_chunks,
            selected_context=context,
            user_context=user_context,
            complexity=complexity
        )

        # Generate answer
        response = self.openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": self._get_system_prompt(complexity)},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )

        answer = response.choices[0].message.content

        # Format sources
        sources = [
            {
                "content": result.payload.get("content", ""),
                "metadata": result.payload.get("metadata", {}),
                "score": result.score
            }
            for result in search_results
        ]

        return {
            "answer": answer,
            "sources": sources,
            "complexity_level": complexity
        }

    def _get_system_prompt(self, complexity: str) -> str:
        """
        Get system prompt based on complexity level.

        Args:
            complexity: 'beginner', 'intermediate', or 'advanced'

        Returns:
            System prompt string
        """
        prompts = {
            'beginner': (
                "You are a helpful teaching assistant for a Physical AI and Humanoid Robotics course. "
                "The user is a beginner, so explain concepts clearly with examples and analogies. "
                "Avoid jargon unless you explain it. Include prerequisites when relevant. "
                "Be encouraging and patient."
            ),
            'intermediate': (
                "You are a helpful teaching assistant for a Physical AI and Humanoid Robotics course. "
                "The user has intermediate knowledge, so you can use technical terms but should still "
                "provide explanations. Balance theory with practical examples."
            ),
            'advanced': (
                "You are a helpful teaching assistant for a Physical AI and Humanoid Robotics course. "
                "The user is advanced, so you can use technical terminology freely. "
                "Focus on deep insights, edge cases, and advanced topics. Be concise."
            )
        }

        return prompts.get(complexity, prompts['intermediate'])

    def _build_personalized_prompt(
        self,
        question: str,
        context_chunks: List[str],
        selected_context: Optional[str],
        user_context: str,
        complexity: str
    ) -> str:
        """
        Build a personalized prompt with context.

        Args:
            question: User's question
            context_chunks: Retrieved context from vector DB
            selected_context: Selected text from page
            user_context: User background context
            complexity: Complexity level

        Returns:
            Formatted prompt string
        """
        # Base context
        context_str = "\n\n".join(context_chunks)

        # Add selected context if available
        if selected_context:
            context_str = f"User selected text: {selected_context}\n\n{context_str}"

        # Build prompt with personalization
        prompt_parts = []

        # User background
        if user_context:
            prompt_parts.append(f"User background: {user_context}")

        # Context from retrieval
        prompt_parts.append(f"Context from the textbook:\n{context_str}")

        # Complexity-specific instructions
        complexity_instructions = {
            'beginner': "Please provide a detailed explanation with examples. Define any technical terms.",
            'intermediate': "Please provide a clear explanation with relevant examples.",
            'advanced': "Please provide a concise, technical explanation focusing on key insights."
        }
        prompt_parts.append(complexity_instructions.get(complexity, ""))

        # The question
        prompt_parts.append(f"Question: {question}")

        return "\n\n".join(prompt_parts)
```

### 6.3 Update Chat API to Use Profile

Edit `backend/app/api/chat.py` (or wherever your chat endpoint is):
```python
from app.core.dependencies import get_current_user_optional
from app.services.profile_service import ProfileService

@router.post("/api/chat")
async def chat(
    request: ChatRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Chat endpoint with optional authentication for personalization.
    """
    # Get user profile if authenticated
    user_profile = None
    if current_user:
        user_profile = ProfileService.get_profile(db, current_user.id)

    # Query RAG with profile
    result = await rag_service.query_rag_pipeline(
        question=request.question,
        context=request.context,
        user_profile=user_profile  # NEW: Pass profile
    )

    return result
```

**Checkpoint**: ✅ Personalization logic integrated

---

## Testing & Validation

### Test Personalization

Create `backend/test_personalization.py`:
```python
from app.services.personalization_service import PersonalizationService
from app.models.profile import UserProfile
from datetime import datetime
import uuid

# Test beginner profile
beginner_profile = UserProfile(
    id=uuid.uuid4(),
    user_id=uuid.uuid4(),
    programming_experience='beginner',
    python_proficiency='basic',
    ros_experience='never_heard',
    ai_ml_experience='none',
    primary_interests=['autonomous_navigation'],
    time_commitment='casual',
    created_at=datetime.utcnow(),
    updated_at=datetime.utcnow()
)

# Test advanced profile
advanced_profile = UserProfile(
    id=uuid.uuid4(),
    user_id=uuid.uuid4(),
    programming_experience='expert',
    python_proficiency='advanced',
    ros_experience='advanced',
    ai_ml_experience='production',
    primary_interests=['computer_vision', 'manipulation'],
    time_commitment='intensive',
    created_at=datetime.utcnow(),
    updated_at=datetime.utcnow()
)

print("Beginner Complexity:", PersonalizationService.get_complexity_level(beginner_profile))
print("Advanced Complexity:", PersonalizationService.get_complexity_level(advanced_profile))
print("\nBeginner Context:", PersonalizationService.get_personalization_context(beginner_profile))
print("\nAdvanced Context:", PersonalizationService.get_personalization_context(advanced_profile))
print("\nBeginner Prerequisites:", PersonalizationService.should_show_prerequisites(beginner_profile))
print("Advanced Prerequisites:", PersonalizationService.should_show_prerequisites(advanced_profile))
```

Run:
```bash
cd backend
python test_personalization.py
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Database migration tested on staging
- [ ] SECRET_KEY set in production environment
- [ ] CORS origins configured for production domain
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Error logging configured
- [ ] API documentation updated

### Environment Variables for Production

```env
# Required
SECRET_KEY=generate-a-strong-secret-key-here
DATABASE_URL=your-production-database-url
OPENAI_API_KEY=your-openai-api-key
QDRANT_URL=your-qdrant-url
QDRANT_API_KEY=your-qdrant-api-key

# Optional
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=7
FRONTEND_URL=https://yourdomain.com
```

### Security Hardening

1. Generate strong SECRET_KEY:
```python
import secrets
print(secrets.token_urlsafe(32))
```

2. Enable HTTPS only in production
3. Set secure cookie flags
4. Implement rate limiting on auth endpoints
5. Add CSRF protection
6. Enable SQL injection prevention (SQLAlchemy handles this)
7. Add input validation on all endpoints

---

## Troubleshooting Guide

### Issue: Migration fails

**Solution**:
```bash
# Rollback
alembic downgrade -1

# Check SQL
alembic upgrade head --sql

# Try again
alembic upgrade head
```

### Issue: Token invalid errors

**Check**:
1. SECRET_KEY matches between token creation and validation
2. Token hasn't expired
3. Session exists in database
4. User is active

### Issue: Password validation failing

**Check**:
1. Password has minimum 8 characters
2. Password contains uppercase letter
3. Password contains digit
4. Validator function in schema is correct

### Issue: CORS errors

**Solution**:
```python
# In main.py, add your frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Next Steps

After completing backend implementation:

1. **Frontend Implementation** (Phase 7-8):
   - Create auth context
   - Build signup/signin forms
   - Add profile questionnaire
   - Protect routes
   - Update navigation

2. **Integration Testing** (Phase 9):
   - Test end-to-end flows
   - Verify personalization works
   - Test error cases
   - Performance testing

3. **Polish & Deploy** (Phase 10):
   - Add loading states
   - Improve error messages
   - Write documentation
   - Deploy to production

---

**Document Status**: Complete ✅
**Previous**: `04-tasks.md`
**Next**: Begin implementation with Phase 1

**Implementation Start Date**: _____
**Target Completion**: _____
