# SP.SPECIFY - Authentication & User Profiling Technical Specification

## Overview
Technical specification for implementing Better Auth authentication with user profiling in the Interactive Textbook application.

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Docusaurus/React)           │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ Signup Page  │  │ Signin Page  │  │ Profile Display │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Auth Context Provider                        │   │
│  │  - Session management                                 │   │
│  │  - Protected routes                                   │   │
│  │  - User state                                         │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Better Auth Integration                  │   │
│  │  - Session management                                 │   │
│  │  - Password hashing                                   │   │
│  │  - Token generation                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  Auth API    │  │ Profile API  │  │  Protected      │   │
│  │  Endpoints   │  │  Endpoints   │  │  Chat API       │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Database (PostgreSQL - Neon)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ users table  │  │profiles table│  │ sessions table  │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │conversations │  │  messages    │  (existing)            │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### New Tables

#### 1. users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    hashed_password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_email ON users(email);
```

#### 2. user_profiles
```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Software Background
    programming_experience VARCHAR(50), -- beginner, intermediate, advanced, expert
    python_proficiency VARCHAR(50),     -- never, basic, intermediate, advanced
    ros_experience VARCHAR(50),         -- never_heard, heard, beginner, intermediate, advanced
    ai_ml_experience VARCHAR(50),       -- no_experience, theoretical, pretrained, custom, research

    -- Hardware Background
    robotics_hardware VARCHAR(50),      -- no_experience, hobbyist, educational, industrial, research
    sensor_integration VARCHAR(50),     -- never, basic, advanced, fusion
    electronics_knowledge VARCHAR(50),  -- no_knowledge, basic, intermediate, advanced

    -- Learning Goals
    primary_interests TEXT[],           -- array of interests
    time_commitment VARCHAR(50),        -- casual, regular, intensive

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON user_profiles(user_id);
```

#### 3. sessions
```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### Modified Tables

#### conversations (add user_id)
```sql
ALTER TABLE conversations
ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
```

---

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/signup
```typescript
Request:
{
  email: string;
  password: string;
  profile: {
    programming_experience?: string;
    python_proficiency?: string;
    ros_experience?: string;
    ai_ml_experience?: string;
    robotics_hardware?: string;
    sensor_integration?: string;
    electronics_knowledge?: string;
    primary_interests?: string[];
    time_commitment?: string;
  }
}

Response (201):
{
  user: {
    id: string;
    email: string;
    created_at: string;
  },
  session: {
    token: string;
    expires_at: string;
  }
}

Errors:
400 - Invalid input
409 - Email already exists
500 - Server error
```

#### POST /api/auth/signin
```typescript
Request:
{
  email: string;
  password: string;
}

Response (200):
{
  user: {
    id: string;
    email: string;
    last_login: string;
  },
  session: {
    token: string;
    expires_at: string;
  }
}

Errors:
401 - Invalid credentials
404 - User not found
500 - Server error
```

#### POST /api/auth/signout
```typescript
Request Headers:
{
  Authorization: "Bearer <token>"
}

Response (200):
{
  message: "Signed out successfully"
}
```

#### GET /api/auth/me
```typescript
Request Headers:
{
  Authorization: "Bearer <token>"
}

Response (200):
{
  user: {
    id: string;
    email: string;
    email_verified: boolean;
    created_at: string;
  },
  profile: {
    programming_experience: string;
    // ... all profile fields
  }
}

Errors:
401 - Unauthorized
404 - User not found
```

### Profile Endpoints

#### GET /api/profile
```typescript
Request Headers:
{
  Authorization: "Bearer <token>"
}

Response (200):
{
  id: string;
  user_id: string;
  programming_experience: string;
  // ... all profile fields
  created_at: string;
  updated_at: string;
}
```

#### PUT /api/profile
```typescript
Request Headers:
{
  Authorization: "Bearer <token>"
}

Request Body:
{
  programming_experience?: string;
  python_proficiency?: string;
  // ... any profile fields to update
}

Response (200):
{
  profile: { /* updated profile */ }
}
```

### Modified Chat Endpoint

#### POST /api/chat (now requires auth)
```typescript
Request Headers:
{
  Authorization: "Bearer <token>"
}

Request Body:
{
  question: string;
  context?: string;
  conversation_id?: string;
}

Response (200):
{
  answer: string;
  sources: Array<Source>;
  conversation_id: string;
  personalization_applied: boolean; // NEW
}
```

---

## Frontend Components

### Component Structure

```
frontend/src/
├── components/
│   ├── Auth/
│   │   ├── SignupForm.tsx           # Signup form with profile questions
│   │   ├── SigninForm.tsx           # Signin form
│   │   ├── ProfileQuestionnaire.tsx # Multi-step profile questions
│   │   ├── ProtectedRoute.tsx       # Route wrapper for auth
│   │   └── AuthContext.tsx          # Auth state management
│   │
│   ├── Profile/
│   │   ├── ProfileDisplay.tsx       # Show user profile
│   │   ├── ProfileEdit.tsx          # Edit profile
│   │   └── ProfileBadge.tsx         # User skill badge
│   │
│   └── Chatbot/
│       └── ChatbotWidget.tsx        # (Modified for auth)
│
├── pages/
│   ├── signup.tsx                   # Signup page
│   ├── signin.tsx                   # Signin page
│   └── profile.tsx                  # Profile page
│
└── utils/
    ├── auth.ts                      # Auth helper functions
    └── api.ts                       # (Modified) API client with auth
```

### Key Components Specification

#### SignupForm.tsx
```typescript
interface SignupFormProps {
  onSuccess: () => void;
}

Features:
- Email/password validation
- Password strength indicator
- Multi-step form (credentials → profile questions)
- Progress indicator
- Skip option for profile questions
- Error handling
- Loading states
```

#### ProfileQuestionnaire.tsx
```typescript
interface ProfileQuestionnaireProps {
  onComplete: (profile: UserProfile) => void;
  onSkip: () => void;
}

Features:
- Grouped question sections
- Radio button groups
- Multi-select for interests
- Help tooltips
- Progress saving
- Skip functionality
- Validation
```

#### AuthContext.tsx
```typescript
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (credentials: SignupData) => Promise<void>;
  signout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

Features:
- Session persistence (localStorage)
- Auto-refresh on mount
- Token management
- Global auth state
```

---

## Backend Implementation

### File Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── auth.py              # NEW: Auth endpoints
│   │   ├── profile.py           # NEW: Profile endpoints
│   │   └── chat.py              # MODIFIED: Add auth middleware
│   │
│   ├── core/
│   │   ├── auth.py              # NEW: Auth utilities
│   │   ├── security.py          # NEW: Password hashing, tokens
│   │   └── dependencies.py      # NEW: Auth dependencies
│   │
│   ├── models/
│   │   ├── user.py              # NEW: User model
│   │   ├── profile.py           # NEW: Profile model
│   │   └── session.py           # NEW: Session model
│   │
│   └── services/
│       ├── auth_service.py      # NEW: Auth business logic
│       ├── profile_service.py   # NEW: Profile business logic
│       └── rag_service.py       # MODIFIED: Personalization
│
└── alembic/
    └── versions/
        └── xxxx_add_auth_tables.py  # NEW: Migration
```

### Key Modules

#### core/security.py
```python
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""

def verify_password(plain: str, hashed: str) -> bool:
    """Verify password against hash"""

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Create JWT access token"""

def verify_token(token: str) -> dict:
    """Verify and decode JWT token"""
```

#### services/auth_service.py
```python
class AuthService:
    def __init__(self, db: Session):
        self.db = db

    async def signup(self, email: str, password: str,
                    profile_data: dict) -> Tuple[User, Session]:
        """Create new user with profile"""

    async def signin(self, email: str, password: str) -> Tuple[User, Session]:
        """Authenticate user and create session"""

    async def signout(self, session_token: str) -> bool:
        """Invalidate session"""

    async def get_current_user(self, token: str) -> User:
        """Get user from session token"""
```

---

## Better Auth Integration

### Installation
```bash
# Better Auth is primarily for Next.js
# We'll use the core concepts with FastAPI implementation
pip install python-jose[cryptography]
pip install passlib[bcrypt]
pip install pydantic[email]
```

### Configuration
```python
# backend/app/core/config.py

class Settings(BaseSettings):
    # Existing settings...

    # Auth Settings
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Better Auth inspired settings
    PASSWORD_MIN_LENGTH: int = 8
    PASSWORD_REQUIRE_UPPERCASE: bool = True
    PASSWORD_REQUIRE_NUMBER: bool = True
    PASSWORD_REQUIRE_SPECIAL: bool = True
```

---

## Personalization Logic

### RAG Service Modification

```python
# app/services/rag_service.py

async def query_rag_pipeline(
    self,
    question: str,
    context: str = None,
    user_profile: UserProfile = None  # NEW
) -> Tuple[str, List[dict]]:

    # Adjust prompt based on user profile
    if user_profile:
        prompt = self._build_personalized_prompt(
            question,
            retrieved_chunks,
            context,
            user_profile
        )
    else:
        prompt = self._build_prompt(question, retrieved_chunks, context)

    # ... rest of logic

def _build_personalized_prompt(
    self,
    question: str,
    context_chunks: List[str],
    user_context: str,
    profile: UserProfile
) -> str:
    """Build prompt with personalization"""

    # Determine complexity level
    complexity = self._get_complexity_level(profile)

    # Add profile-aware instructions
    system_prompt = f"""
    You are an AI assistant for "Physical AI & Humanoid Robotics".

    User Profile:
    - Programming: {profile.programming_experience}
    - Python: {profile.python_proficiency}
    - ROS: {profile.ros_experience}
    - AI/ML: {profile.ai_ml_experience}

    Adjust your response:
    - Complexity: {complexity}
    - Skip basics if user is advanced
    - Provide code examples appropriate to skill level
    - Reference relevant prior knowledge
    """

    # ... build full prompt
```

### Personalization Rules

```python
# app/services/personalization_service.py

class PersonalizationService:
    @staticmethod
    def get_content_level(profile: UserProfile) -> str:
        """Determine appropriate content level"""

        if all([
            profile.programming_experience == "expert",
            profile.python_proficiency == "advanced",
            profile.ros_experience in ["intermediate", "advanced"]
        ]):
            return "advanced"
        elif profile.programming_experience == "beginner":
            return "beginner"
        else:
            return "intermediate"

    @staticmethod
    def should_show_prerequisites(profile: UserProfile) -> bool:
        """Decide if prerequisites should be shown"""

        return profile.programming_experience in ["beginner", "intermediate"]

    @staticmethod
    def get_recommended_topics(profile: UserProfile) -> List[str]:
        """Get topic recommendations based on profile"""

        recommendations = []

        if profile.ai_ml_experience in ["no_experience", "theoretical"]:
            recommendations.append("AI Fundamentals")

        if profile.ros_experience == "never_heard":
            recommendations.append("ROS Basics")

        # ... more logic

        return recommendations
```

---

## Security Considerations

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character

### Session Management
- JWT tokens stored in httpOnly cookies (frontend)
- 7-day expiration by default
- Refresh token mechanism (future phase)
- Session invalidation on logout

### Data Protection
- Passwords hashed with bcrypt (12 rounds)
- No plain-text password storage
- SQL injection protection (parameterized queries)
- XSS protection (input sanitization)
- CORS configured correctly

### Privacy
- GDPR compliant data collection
- Clear privacy policy
- User data deletion capability
- Minimal data collection

---

## Testing Requirements

### Unit Tests
- Password hashing/verification
- Token generation/validation
- User creation
- Profile creation
- Session management

### Integration Tests
- Signup flow
- Signin flow
- Protected endpoints
- Profile update
- Logout

### E2E Tests
- Complete signup with profile
- Signin and navigate
- Update profile
- Personalized content display

---

## Performance Considerations

### Database
- Indexed columns (email, user_id, token)
- Connection pooling
- Query optimization

### Caching
- Session data cached in Redis (future)
- User profile cached
- Token validation cached

### Frontend
- Lazy loading auth components
- Optimistic UI updates
- Local state caching

---

## Migration Strategy

### Phase 1: Database
1. Create new tables
2. Run migrations
3. Verify schema

### Phase 2: Backend
1. Implement auth endpoints
2. Add middleware
3. Test APIs

### Phase 3: Frontend
1. Create auth components
2. Add routing
3. Test UI

### Phase 4: Integration
1. Connect frontend to backend
2. Test end-to-end
3. Deploy

---

## Environment Variables

```env
# backend/.env (additions)

# Auth
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Frontend (new file: frontend/.env)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Dependencies

### Backend (requirements.txt additions)
```txt
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
pydantic[email]==2.5.0
python-multipart==0.0.6
```

### Frontend (package.json additions)
```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.4"
  }
}
```

---

**Document Status**: Complete ✅
**Previous**: `01-constitution.md`
**Next**: `03-plan.md`
