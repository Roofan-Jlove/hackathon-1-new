# SP.TASK - Authentication & User Profiling Task Breakdown

## Task Management

This document contains all actionable tasks for implementing the authentication and user profiling feature. Each task is designed to be completable in 15-60 minutes.

---

## Legend
- 🔴 **Blocker**: Must be completed before dependent tasks
- 🟡 **Important**: Core functionality
- 🟢 **Enhancement**: Nice-to-have features
- ⏰ **Time Estimate**: Approximate completion time
- 📦 **Dependencies**: Tasks that must be completed first

---

## PHASE 1: Database Setup

### Task 1.1: Install and Configure Alembic 🔴
⏰ 15 min | 📦 None

**Steps**:
1. Install Alembic: `pip install alembic`
2. Initialize Alembic in backend: `alembic init alembic`
3. Update `alembic.ini` with database URL
4. Update `alembic/env.py` to import models
5. Test: `alembic current`

**Acceptance Criteria**:
- Alembic initialized
- Can run `alembic current` without errors

---

### Task 1.2: Create Auth Tables Migration 🔴
⏰ 30 min | 📦 Task 1.1

**Steps**:
1. Create migration: `alembic revision -m "add_auth_tables"`
2. Add `users` table creation
3. Add `user_profiles` table creation
4. Add `sessions` table creation
5. Add `user_id` column to `conversations` table
6. Add all indexes

**File**: `alembic/versions/xxxx_add_auth_tables.py`

**Code Template**:
```python
def upgrade():
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        # ... more columns
    )

    # Create indexes
    op.create_index('idx_users_email', 'users', ['email'])
    # ... more indexes

def downgrade():
    # Drop tables in reverse order
    op.drop_table('sessions')
    op.drop_table('user_profiles')
    op.drop_table('users')
```

**Acceptance Criteria**:
- Migration file created
- All tables defined
- All indexes defined
- Downgrade function works

---

### Task 1.3: Run and Verify Migration 🔴
⏰ 15 min | 📦 Task 1.2

**Steps**:
1. Run migration: `alembic upgrade head`
2. Verify tables exist in database
3. Check indexes created
4. Test rollback: `alembic downgrade -1`
5. Re-apply: `alembic upgrade head`

**Verification Queries**:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users', 'user_profiles', 'sessions');

SELECT * FROM pg_indexes WHERE tablename IN ('users', 'user_profiles', 'sessions');
```

**Acceptance Criteria**:
- All tables exist
- All indexes exist
- Can rollback and re-apply

---

## PHASE 2: Backend Models

### Task 2.1: Create User SQLAlchemy Model 🟡
⏰ 20 min | 📦 Task 1.3

**File**: `backend/app/models/user.py`

**Implementation**:
```python
from sqlalchemy import Column, String, Boolean, DateTime, UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    email_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    sessions = relationship("Session", back_populates="user")
    conversations = relationship("Conversation", back_populates="user")
```

**Acceptance Criteria**:
- Model created
- All fields defined
- Relationships defined
- Can import without errors

---

### Task 2.2: Create UserProfile SQLAlchemy Model 🟡
⏰ 20 min | 📦 Task 2.1

**File**: `backend/app/models/profile.py`

**Implementation**:
```python
from sqlalchemy import Column, String, ForeignKey, ARRAY, Text, DateTime, UUID
from sqlalchemy.orm import relationship
import uuid

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), unique=True, nullable=False)

    # Software background
    programming_experience = Column(String(50))
    python_proficiency = Column(String(50))
    ros_experience = Column(String(50))
    ai_ml_experience = Column(String(50))

    # Hardware background
    robotics_hardware = Column(String(50))
    sensor_integration = Column(String(50))
    electronics_knowledge = Column(String(50))

    # Learning goals
    primary_interests = Column(ARRAY(Text))
    time_commitment = Column(String(50))

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="profile")
```

**Acceptance Criteria**:
- Model created
- All profile fields defined
- Relationship to User defined

---

### Task 2.3: Create Session SQLAlchemy Model 🟡
⏰ 15 min | 📦 Task 2.1

**File**: `backend/app/models/session.py`

**Implementation**:
```python
class Session(Base):
    __tablename__ = "sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    token = Column(Text, unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String(45))
    user_agent = Column(Text)

    # Relationships
    user = relationship("User", back_populates="sessions")
```

**Acceptance Criteria**:
- Model created
- Token indexed
- Expiration indexed

---

### Task 2.4: Create Pydantic Schemas 🟡
⏰ 30 min | 📦 Task 2.3

**File**: `backend/app/schemas/auth.py`

**Implementation**:
```python
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class UserCreate(BaseModel):
    email: EmailStr
    password: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        # Add more validation
        return v

class ProfileCreate(BaseModel):
    programming_experience: Optional[str] = None
    python_proficiency: Optional[str] = None
    # ... all other fields

class UserResponse(BaseModel):
    id: UUID
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class ProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    programming_experience: Optional[str]
    # ... all other fields

    class Config:
        from_attributes = True

class SessionResponse(BaseModel):
    token: str
    expires_at: datetime
```

**Acceptance Criteria**:
- All schemas defined
- Password validation working
- Can serialize/deserialize

---

## PHASE 3: Security & Auth Core

### Task 3.1: Implement Password Hashing 🔴
⏰ 20 min | 📦 Task 2.4

**File**: `backend/app/core/security.py`

**Steps**:
1. Install: `pip install passlib[bcrypt]`
2. Create password context
3. Implement `hash_password()`
4. Implement `verify_password()`
5. Test with sample passwords

**Implementation**:
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

**Test**:
```python
hashed = hash_password("testpass123")
assert verify_password("testpass123", hashed) == True
assert verify_password("wrongpass", hashed) == False
```

**Acceptance Criteria**:
- Can hash passwords
- Can verify passwords
- Wrong passwords fail verification

---

### Task 3.2: Implement JWT Token Management 🔴
⏰ 30 min | 📦 Task 3.1

**File**: `backend/app/core/security.py`

**Steps**:
1. Install: `pip install python-jose[cryptography]`
2. Implement `create_access_token()`
3. Implement `verify_token()`
4. Add expiration logic
5. Test token generation/validation

**Implementation**:
```python
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

SECRET_KEY = "your-secret-key"  # From settings
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
```

**Acceptance Criteria**:
- Can create tokens
- Can verify valid tokens
- Invalid tokens return None
- Expired tokens fail

---

### Task 3.3: Create Auth Dependencies 🟡
⏰ 30 min | 📦 Task 3.2

**File**: `backend/app/core/dependencies.py`

**Implementation**:
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.security import verify_token
from app.core.database import get_db
from app.models.user import User

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user
```

**Acceptance Criteria**:
- Dependency extracts and validates token
- Returns user object
- Raises 401 for invalid tokens

---

## PHASE 4: Auth Services

### Task 4.1: Implement Signup Service 🟡
⏰ 45 min | 📦 Task 3.3

**File**: `backend/app/services/auth_service.py`

**Implementation**:
```python
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.profile import UserProfile
from app.core.security import hash_password, create_access_token
from datetime import timedelta

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    async def signup(self, email: str, password: str, profile_data: dict):
        # Check if user exists
        existing_user = self.db.query(User).filter(User.email == email).first()
        if existing_user:
            raise ValueError("Email already registered")

        # Create user
        hashed_password = hash_password(password)
        user = User(email=email, hashed_password=hashed_password)
        self.db.add(user)
        self.db.flush()  # Get user.id

        # Create profile
        profile = UserProfile(user_id=user.id, **profile_data)
        self.db.add(profile)

        # Commit
        self.db.commit()
        self.db.refresh(user)

        # Create token
        token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=timedelta(days=7)
        )

        return user, token
```

**Acceptance Criteria**:
- Creates user and profile
- Returns user and token
- Prevents duplicate emails
- Hashes password

---

### Task 4.2: Implement Signin Service 🟡
⏰ 30 min | 📦 Task 4.1

**Implementation**:
```python
async def signin(self, email: str, password: str):
    # Find user
    user = self.db.query(User).filter(User.email == email).first()
    if not user:
        raise ValueError("Invalid credentials")

    # Verify password
    if not verify_password(password, user.hashed_password):
        raise ValueError("Invalid credentials")

    # Update last login
    user.last_login = datetime.utcnow()
    self.db.commit()

    # Create token
    token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(days=7)
    )

    return user, token
```

**Acceptance Criteria**:
- Validates credentials
- Updates last login
- Returns token
- Fails gracefully

---

### Task 4.3: Implement Profile Service 🟡
⏰ 30 min | 📦 Task 4.2

**File**: `backend/app/services/profile_service.py`

**Implementation**:
```python
class ProfileService:
    def __init__(self, db: Session):
        self.db = db

    async def get_profile(self, user_id: UUID):
        profile = self.db.query(UserProfile).filter(
            UserProfile.user_id == user_id
        ).first()
        return profile

    async def update_profile(self, user_id: UUID, profile_data: dict):
        profile = await self.get_profile(user_id)

        if not profile:
            raise ValueError("Profile not found")

        for key, value in profile_data.items():
            setattr(profile, key, value)

        profile.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(profile)

        return profile
```

**Acceptance Criteria**:
- Can get user profile
- Can update profile fields
- Updates timestamp

---

## PHASE 5: Backend API Endpoints

### Task 5.1: Create Signup Endpoint 🟡
⏰ 30 min | 📦 Task 4.1

**File**: `backend/app/api/auth.py`

**Implementation**:
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.auth_service import AuthService
from app.schemas.auth import UserCreate, ProfileCreate, UserResponse

router = APIRouter()

@router.post("/signup", response_model=dict)
async def signup(
    email: str,
    password: str,
    profile: ProfileCreate,
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)

    try:
        user, token = await auth_service.signup(
            email=email,
            password=password,
            profile_data=profile.dict(exclude_unset=True)
        )

        return {
            "user": UserResponse.from_orm(user),
            "session": {
                "token": token,
                "expires_at": datetime.utcnow() + timedelta(days=7)
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

**Acceptance Criteria**:
- Endpoint created
- Returns user and token
- Handles errors

---

### Task 5.2: Create Signin Endpoint 🟡
⏰ 20 min | 📦 Task 5.1

**Implementation**:
```python
@router.post("/signin")
async def signin(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)

    try:
        user, token = await auth_service.signin(email, password)

        return {
            "user": UserResponse.from_orm(user),
            "session": {
                "token": token,
                "expires_at": datetime.utcnow() + timedelta(days=7)
            }
        }
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
```

**Acceptance Criteria**:
- Endpoint created
- Returns user and token on success
- Returns 401 on failure

---

### Task 5.3: Create Get Current User Endpoint 🟡
⏰ 15 min | 📦 Task 5.2

**Implementation**:
```python
@router.get("/me")
async def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile_service = ProfileService(db)
    profile = await profile_service.get_profile(current_user.id)

    return {
        "user": UserResponse.from_orm(current_user),
        "profile": ProfileResponse.from_orm(profile) if profile else None
    }
```

**Acceptance Criteria**:
- Requires authentication
- Returns user and profile
- Works with valid token

---

### Task 5.4: Create Profile Endpoints 🟡
⏰ 30 min | 📦 Task 5.3

**File**: `backend/app/api/profile.py`

**Implementation**:
```python
@router.get("/profile")
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile_service = ProfileService(db)
    profile = await profile_service.get_profile(current_user.id)

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return ProfileResponse.from_orm(profile)

@router.put("/profile")
async def update_profile(
    profile_data: ProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile_service = ProfileService(db)
    profile = await profile_service.update_profile(
        current_user.id,
        profile_data.dict(exclude_unset=True)
    )

    return ProfileResponse.from_orm(profile)
```

**Acceptance Criteria**:
- Can get own profile
- Can update own profile
- Requires authentication

---

### Task 5.5: Update Chat Endpoint for Auth 🟡
⏰ 20 min | 📦 Task 5.4

**File**: `backend/app/api/chat.py`

**Modifications**:
```python
@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),  # NEW
    db: Session = Depends(get_db)
):
    # Get user profile for personalization
    profile_service = ProfileService(db)
    profile = await profile_service.get_profile(current_user.id)

    # Pass profile to RAG service
    answer, sources = await rag_service.query_rag_pipeline(
        question=request.question,
        context=request.context,
        user_profile=profile  # NEW
    )

    # ... rest of logic
```

**Acceptance Criteria**:
- Requires authentication
- Gets user profile
- Passes profile to RAG

---

## PHASE 6: Personalization Logic

### Task 6.1: Create Personalization Service 🟢
⏰ 45 min | 📦 Task 5.5

**File**: `backend/app/services/personalization_service.py`

**Implementation**:
```python
class PersonalizationService:
    @staticmethod
    def get_complexity_level(profile: UserProfile) -> str:
        """Determine content complexity level"""

        if not profile:
            return "intermediate"

        # Advanced if expert in most areas
        if all([
            profile.programming_experience in ["advanced", "expert"],
            profile.python_proficiency == "advanced",
            profile.ros_experience in ["intermediate", "advanced"]
        ]):
            return "advanced"

        # Beginner if new to most areas
        if all([
            profile.programming_experience in ["beginner", None],
            profile.python_proficiency in ["never", "basic", None]
        ]):
            return "beginner"

        return "intermediate"

    @staticmethod
    def should_show_prerequisites(profile: UserProfile) -> bool:
        """Decide if prerequisites should be shown"""
        if not profile:
            return True

        return profile.programming_experience in ["beginner", "intermediate", None]

    @staticmethod
    def get_learning_style(profile: UserProfile) -> str:
        """Determine preferred learning style"""
        if not profile:
            return "balanced"

        if profile.ai_ml_experience in ["research", "custom"]:
            return "theory_focused"

        if profile.robotics_hardware in ["industrial", "research"]:
            return "practical_focused"

        return "balanced"
```

**Acceptance Criteria**:
- Determines complexity level
- Identifies learning style
- Returns sensible defaults

---

### Task 6.2: Modify RAG Service for Personalization 🟡
⏰ 60 min | 📦 Task 6.1

**File**: `backend/app/services/rag_service.py`

**Modifications**:
```python
from app.services.personalization_service import PersonalizationService

async def query_rag_pipeline(
    self,
    question: str,
    context: str = None,
    user_profile: UserProfile = None  # NEW
) -> Tuple[str, List[dict]]:

    # ... existing embedding logic ...

    # Build personalized or standard prompt
    if user_profile:
        prompt = self._build_personalized_prompt(
            question,
            retrieved_chunks,
            context,
            user_profile
        )
    else:
        prompt = self._build_prompt(question, retrieved_chunks, context)

    # ... rest of logic ...

def _build_personalized_prompt(
    self,
    question: str,
    context_chunks: List[str],
    user_context: str,
    profile: UserProfile
) -> str:
    """Build prompt with personalization based on user profile"""

    complexity = PersonalizationService.get_complexity_level(profile)
    show_prereqs = PersonalizationService.should_show_prerequisites(profile)
    style = PersonalizationService.get_learning_style(profile)

    context_str = "\n---\n".join(context_chunks)

    system_instructions = f"""
    You are an AI assistant for "Physical AI & Humanoid Robotics".

    USER PROFILE:
    - Programming Experience: {profile.programming_experience or 'unknown'}
    - Python Proficiency: {profile.python_proficiency or 'unknown'}
    - ROS Experience: {profile.ros_experience or 'unknown'}
    - AI/ML Experience: {profile.ai_ml_experience or 'unknown'}
    - Learning Style: {style}

    ADJUST YOUR RESPONSE:
    - Complexity Level: {complexity}
    - Show Prerequisites: {show_prereqs}
    - If user is advanced, skip basic explanations
    - If user is beginner, provide more context and examples
    - Match code examples to user's skill level
    - Reference concepts user likely knows

    Answer based ONLY on the provided context.
    """

    prompt = f"""
    {system_instructions}

    CONTEXT FROM BOOK:
    {context_str}
    """

    if user_context:
        prompt += f"\n\nSELECTED TEXT:\n{user_context}\n"

    prompt += f"\n\nQUESTION: {question}\n\nANSWER:"

    return prompt.strip()
```

**Acceptance Criteria**:
- Accepts user profile
- Builds personalized prompts
- Falls back to standard prompt if no profile
- Tests show different responses for different profiles

---

## PHASE 7-10: Frontend Implementation

*(Continued in next section due to length...)*

---

## Quick Reference: Task Dependencies

```
Phase 1 (Database):
1.1 → 1.2 → 1.3

Phase 2 (Models):
1.3 → 2.1 → 2.2 → 2.3 → 2.4

Phase 3 (Security):
2.4 → 3.1 → 3.2 → 3.3

Phase 4 (Services):
3.3 → 4.1 → 4.2 → 4.3

Phase 5 (API):
4.3 → 5.1 → 5.2 → 5.3 → 5.4 → 5.5

Phase 6 (Personalization):
5.5 → 6.1 → 6.2

Phase 7-10:
6.2 → [Frontend tasks in parallel]
```

---

**Document Status**: Complete (Backend Tasks) ✅
**Previous**: `03-plan.md`
**Next**: `05-implement.md`
**Note**: Frontend tasks (Phase 7-10) to be added in Part 2 or can be implemented using similar task breakdown structure.
