# SP.PLAN - Authentication & User Profiling Implementation Plan

## Implementation Overview

This plan outlines the step-by-step implementation of authentication and user profiling features, broken down into manageable phases with clear dependencies and checkpoints.

---

## Implementation Phases

### Phase 1: Database Setup ⏱️ 1-2 hours
**Dependencies**: None
**Goal**: Set up database schema for users, profiles, and sessions

#### 1.1 Create Migration File
- [ ] Install Alembic (if not already)
- [ ] Initialize Alembic in backend
- [ ] Create migration: `add_auth_tables.py`

#### 1.2 Define Schema
- [ ] Create `users` table
- [ ] Create `user_profiles` table
- [ ] Create `sessions` table
- [ ] Add `user_id` to `conversations` table
- [ ] Create all necessary indexes

#### 1.3 Run Migration
- [ ] Test migration locally
- [ ] Verify tables created
- [ ] Check indexes
- [ ] Rollback test
- [ ] Document migration

**Checkpoint**: Database tables exist with correct schema

---

### Phase 2: Backend Models ⏱️ 1 hour
**Dependencies**: Phase 1
**Goal**: Create Pydantic models and SQLAlchemy ORM models

#### 2.1 SQLAlchemy Models
- [ ] Create `User` model (`app/models/user.py`)
- [ ] Create `UserProfile` model (`app/models/profile.py`)
- [ ] Create `Session` model (`app/models/session.py`)
- [ ] Update `Conversation` model (add user_id relationship)

#### 2.2 Pydantic Schemas
- [ ] Create `UserCreate` schema
- [ ] Create `UserResponse` schema
- [ ] Create `ProfileCreate` schema
- [ ] Create `ProfileResponse` schema
- [ ] Create `SessionResponse` schema
- [ ] Create validation schemas for profile questions

**Checkpoint**: All models defined and importable

---

### Phase 3: Security & Auth Core ⏱️ 2 hours
**Dependencies**: Phase 2
**Goal**: Implement password hashing, JWT tokens, and auth utilities

#### 3.1 Security Module
- [ ] Create `app/core/security.py`
- [ ] Implement password hashing (bcrypt)
- [ ] Implement password verification
- [ ] Create JWT token generation
- [ ] Create JWT token verification
- [ ] Add token expiration logic

#### 3.2 Auth Dependencies
- [ ] Create `app/core/dependencies.py`
- [ ] Implement `get_current_user` dependency
- [ ] Implement `require_auth` dependency
- [ ] Add session validation
- [ ] Add token refresh logic (optional)

#### 3.3 Configuration
- [ ] Add auth settings to `config.py`
- [ ] Set up SECRET_KEY
- [ ] Configure token expiration
- [ ] Set password requirements

**Checkpoint**: Can hash/verify passwords and generate/validate tokens

---

### Phase 4: Auth Services ⏱️ 2 hours
**Dependencies**: Phase 3
**Goal**: Implement business logic for authentication

#### 4.1 Auth Service
- [ ] Create `app/services/auth_service.py`
- [ ] Implement `signup()` method
- [ ] Implement `signin()` method
- [ ] Implement `signout()` method
- [ ] Implement `verify_session()` method
- [ ] Add email uniqueness check
- [ ] Add password validation

#### 4.2 Profile Service
- [ ] Create `app/services/profile_service.py`
- [ ] Implement `create_profile()` method
- [ ] Implement `get_profile()` method
- [ ] Implement `update_profile()` method
- [ ] Add profile validation
- [ ] Add default values for optional fields

**Checkpoint**: Services can create users and profiles

---

### Phase 5: Backend API Endpoints ⏱️ 2-3 hours
**Dependencies**: Phase 4
**Goal**: Create REST API endpoints for auth

#### 5.1 Auth Endpoints
- [ ] Create `app/api/auth.py`
- [ ] POST `/api/auth/signup` endpoint
- [ ] POST `/api/auth/signin` endpoint
- [ ] POST `/api/auth/signout` endpoint
- [ ] GET `/api/auth/me` endpoint
- [ ] Add request validation
- [ ] Add error handling
- [ ] Add response formatting

#### 5.2 Profile Endpoints
- [ ] Create `app/api/profile.py`
- [ ] GET `/api/profile` endpoint (requires auth)
- [ ] PUT `/api/profile` endpoint (requires auth)
- [ ] Add validation
- [ ] Add error handling

#### 5.3 Update Existing Endpoints
- [ ] Modify `/api/chat` to require auth
- [ ] Add user_id to conversation creation
- [ ] Update CORS settings
- [ ] Test backwards compatibility

#### 5.4 API Testing
- [ ] Test signup with valid data
- [ ] Test signup with invalid data
- [ ] Test signin with correct credentials
- [ ] Test signin with wrong credentials
- [ ] Test protected endpoints without auth
- [ ] Test profile creation and updates

**Checkpoint**: All API endpoints working and tested

---

### Phase 6: Personalization Logic ⏱️ 1-2 hours
**Dependencies**: Phase 5
**Goal**: Implement content personalization based on user profile

#### 6.1 Personalization Service
- [ ] Create `app/services/personalization_service.py`
- [ ] Implement `get_content_level()` method
- [ ] Implement `should_show_prerequisites()` method
- [ ] Implement `get_recommended_topics()` method
- [ ] Create personalization rules

#### 6.2 RAG Service Updates
- [ ] Modify `query_rag_pipeline()` to accept user_profile
- [ ] Implement `_build_personalized_prompt()` method
- [ ] Add complexity level adjustment
- [ ] Add skill-level appropriate responses
- [ ] Test personalized vs. non-personalized responses

**Checkpoint**: RAG responses adapt to user skill level

---

### Phase 7: Frontend Auth Components ⏱️ 3-4 hours
**Dependencies**: Phase 5
**Goal**: Create signup, signin, and auth management UI

#### 7.1 Auth Context
- [ ] Create `src/components/Auth/AuthContext.tsx`
- [ ] Implement auth state management
- [ ] Add session persistence (localStorage)
- [ ] Implement `signin()` function
- [ ] Implement `signup()` function
- [ ] Implement `signout()` function
- [ ] Add loading states

#### 7.2 Signin Component
- [ ] Create `src/components/Auth/SigninForm.tsx`
- [ ] Design signin UI
- [ ] Add form validation
- [ ] Add error display
- [ ] Add loading state
- [ ] Test signin flow

#### 7.3 Signup Component - Basic
- [ ] Create `src/components/Auth/SignupForm.tsx`
- [ ] Design step 1: Email/Password
- [ ] Add password strength indicator
- [ ] Add validation
- [ ] Add error handling

#### 7.4 Profile Questionnaire
- [ ] Create `src/components/Auth/ProfileQuestionnaire.tsx`
- [ ] Design multi-step form
- [ ] Add software background questions
- [ ] Add hardware background questions
- [ ] Add learning goals questions
- [ ] Add progress indicator
- [ ] Add skip functionality
- [ ] Style components

#### 7.5 Protected Routes
- [ ] Create `src/components/Auth/ProtectedRoute.tsx`
- [ ] Wrap protected pages
- [ ] Add redirect logic
- [ ] Add loading state

**Checkpoint**: Users can signup and signin via UI

---

### Phase 8: Frontend Pages ⏱️ 2 hours
**Dependencies**: Phase 7
**Goal**: Create signup, signin, and profile pages

#### 8.1 Signup Page
- [ ] Create `src/pages/signup.tsx`
- [ ] Add SignupForm component
- [ ] Add redirect after signup
- [ ] Style page
- [ ] Add "Already have account?" link

#### 8.2 Signin Page
- [ ] Create `src/pages/signin.tsx`
- [ ] Add SigninForm component
- [ ] Add redirect after signin
- [ ] Style page
- [ ] Add "Don't have account?" link

#### 8.3 Profile Page
- [ ] Create `src/pages/profile.tsx`
- [ ] Create `ProfileDisplay` component
- [ ] Create `ProfileEdit` component
- [ ] Add profile viewing
- [ ] Add profile editing
- [ ] Style page

#### 8.4 Navigation Updates
- [ ] Add "Sign In" / "Sign Up" buttons to navbar
- [ ] Add "Profile" button when authenticated
- [ ] Add "Sign Out" button when authenticated
- [ ] Update routing

**Checkpoint**: Complete signup/signin/profile UI flow

---

### Phase 9: Integration & Testing ⏱️ 2-3 hours
**Dependencies**: Phase 8
**Goal**: Connect all pieces and test end-to-end

#### 9.1 API Integration
- [ ] Connect SignupForm to `/api/auth/signup`
- [ ] Connect SigninForm to `/api/auth/signin`
- [ ] Connect Profile to `/api/profile`
- [ ] Add token to API requests
- [ ] Test error handling
- [ ] Test success flows

#### 9.2 Session Management
- [ ] Test session persistence
- [ ] Test auto-login on page refresh
- [ ] Test token expiration
- [ ] Test logout
- [ ] Test protected routes

#### 9.3 Chatbot Integration
- [ ] Update ChatbotWidget to use auth
- [ ] Pass user profile to RAG API
- [ ] Test personalized responses
- [ ] Test anonymous vs. authenticated

#### 9.4 End-to-End Testing
- [ ] Test complete signup flow
- [ ] Test complete signin flow
- [ ] Test profile creation
- [ ] Test profile update
- [ ] Test personalized chat
- [ ] Test logout and re-login

**Checkpoint**: All features working together

---

### Phase 10: Polish & Documentation ⏱️ 1-2 hours
**Dependencies**: Phase 9
**Goal**: Improve UX and document the feature

#### 10.1 UX Improvements
- [ ] Add loading spinners
- [ ] Add success messages
- [ ] Add error messages
- [ ] Improve form validation feedback
- [ ] Add tooltips to profile questions
- [ ] Mobile responsiveness check

#### 10.2 Documentation
- [ ] Update API documentation
- [ ] Create user guide for signup
- [ ] Document profile fields
- [ ] Update README
- [ ] Add inline code comments

#### 10.3 Testing & Bug Fixes
- [ ] Fix any identified bugs
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Performance optimization
- [ ] Security audit

**Checkpoint**: Feature complete and polished

---

## Detailed Task Breakdown by Component

### Backend Tasks

```
backend/
├── Database Migration
│   ├── Install Alembic
│   ├── Create migration file
│   └── Run migration
│
├── Models (SQLAlchemy + Pydantic)
│   ├── user.py
│   ├── profile.py
│   └── session.py
│
├── Core
│   ├── security.py (hashing, JWT)
│   ├── dependencies.py (auth middleware)
│   └── config.py (update settings)
│
├── Services
│   ├── auth_service.py
│   ├── profile_service.py
│   ├── personalization_service.py
│   └── rag_service.py (modify)
│
└── API
    ├── auth.py (new endpoints)
    ├── profile.py (new endpoints)
    └── chat.py (modify for auth)
```

### Frontend Tasks

```
frontend/
├── Components
│   ├── Auth/
│   │   ├── AuthContext.tsx
│   │   ├── SignupForm.tsx
│   │   ├── SigninForm.tsx
│   │   ├── ProfileQuestionnaire.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── Profile/
│   │   ├── ProfileDisplay.tsx
│   │   └── ProfileEdit.tsx
│   │
│   └── Chatbot/
│       └── ChatbotWidget.tsx (modify)
│
├── Pages
│   ├── signup.tsx
│   ├── signin.tsx
│   └── profile.tsx
│
├── Utils
│   ├── auth.ts (helper functions)
│   └── api.ts (modify for auth headers)
│
└── Styles
    ├── Auth.module.css
    └── Profile.module.css
```

---

## Development Workflow

### Daily Workflow
```
1. Start backend server
2. Start frontend server
3. Work on current phase tasks
4. Test after each task
5. Commit working code
6. Update progress
```

### Testing Workflow
```
1. Unit test new functions
2. Integration test APIs
3. E2E test UI flows
4. Fix bugs
5. Repeat
```

---

## Risk Mitigation Plan

### Risk 1: Database Migration Issues
**Plan**:
- Test migration on local DB first
- Create backup before production migration
- Have rollback script ready

### Risk 2: Breaking Existing Features
**Plan**:
- Test RAG chat after each backend change
- Keep auth optional initially
- Add feature flags

### Risk 3: Token/Session Issues
**Plan**:
- Implement proper token refresh
- Add detailed logging
- Test expiration scenarios

### Risk 4: User Confusion with Profile Questions
**Plan**:
- Add clear instructions
- Make questions optional
- Allow skip
- Save progress

---

## Progress Tracking

### Phase Completion Checklist
- [ ] Phase 1: Database Setup
- [ ] Phase 2: Backend Models
- [ ] Phase 3: Security & Auth Core
- [ ] Phase 4: Auth Services
- [ ] Phase 5: Backend API Endpoints
- [ ] Phase 6: Personalization Logic
- [ ] Phase 7: Frontend Auth Components
- [ ] Phase 8: Frontend Pages
- [ ] Phase 9: Integration & Testing
- [ ] Phase 10: Polish & Documentation

### Time Tracking
- Estimated Total: 16-22 hours
- Actual Time: _____ hours
- Completion Date: _____

---

## Deployment Plan

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Database migration tested
- [ ] Environment variables configured
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] User guide created

### Deployment Steps
1. Backup database
2. Run migrations
3. Deploy backend
4. Deploy frontend
5. Verify deployment
6. Monitor for errors

---

## Success Criteria

### Must Have
- ✅ Users can signup with email/password
- ✅ Users can signin
- ✅ Profile questions asked during signup
- ✅ Protected routes work
- ✅ Personalized responses based on profile

### Nice to Have
- Skip profile questions
- Edit profile later
- Profile completion percentage
- Skill badges
- Progress indicators

### Future Enhancements
- OAuth (Google, GitHub)
- Email verification
- Password reset
- 2FA
- Avatar upload

---

**Document Status**: Complete ✅
**Previous**: `02-specification.md`
**Next**: `04-tasks.md`
