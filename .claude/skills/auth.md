# Auth Feature Management Skill

A skill for managing and testing the authentication feature implementation.

## Description

This skill provides commands for testing, managing, and troubleshooting the authentication system including user signup, signin, profile management, and personalized chat features.

## Commands

### test-auth
Test the complete authentication flow end-to-end.

**Usage:**
```
/auth test-auth
```

**What it does:**
1. Verifies backend is running
2. Tests signup endpoint
3. Tests signin endpoint
4. Tests profile creation
5. Tests protected endpoints
6. Verifies personalization is working

### create-test-user
Create a test user with a specific profile type.

**Usage:**
```
/auth create-test-user [beginner|intermediate|advanced]
```

**Examples:**
- `/auth create-test-user beginner` - Creates a beginner user
- `/auth create-test-user advanced` - Creates an advanced user

**What it does:**
- Creates a user account
- Sets up profile with specified skill level
- Returns credentials and token

### check-servers
Check if backend and frontend servers are running.

**Usage:**
```
/auth check-servers
```

**What it does:**
- Checks backend health endpoint
- Checks frontend is accessible
- Verifies database connection
- Shows server status

### test-personalization
Test the personalization feature by comparing responses.

**Usage:**
```
/auth test-personalization "Your question here"
```

**Example:**
```
/auth test-personalization "What is ROS?"
```

**What it does:**
1. Asks question as anonymous user
2. Asks same question as beginner user
3. Asks same question as advanced user
4. Compares and displays the different responses

### reset-test-data
Clear all test users and start fresh.

**Usage:**
```
/auth reset-test-data
```

**What it does:**
- Removes all test users (emails ending in @test.com)
- Clears test data from database
- Keeps real user data intact

### show-tokens
Display active auth tokens for debugging.

**Usage:**
```
/auth show-tokens
```

**What it does:**
- Lists all active sessions
- Shows token expiration times
- Displays user associated with each token

### verify-profile
Verify a user's profile is set up correctly.

**Usage:**
```
/auth verify-profile <email>
```

**Example:**
```
/auth verify-profile test@example.com
```

**What it does:**
- Fetches user profile
- Validates all fields
- Checks personalization settings
- Shows recommended complexity level

## Examples

### Complete Testing Workflow

```bash
# 1. Check servers are running
/auth check-servers

# 2. Create test users with different levels
/auth create-test-user beginner
/auth create-test-user advanced

# 3. Test personalization
/auth test-personalization "Explain ROS nodes"

# 4. Run full auth test suite
/auth test-auth

# 5. Clean up when done
/auth reset-test-data
```

### Quick Debugging

```bash
# Check what's wrong
/auth check-servers

# Verify a specific user
/auth verify-profile test@example.com

# Check active sessions
/auth show-tokens
```

## Troubleshooting

### "Backend not responding"
- Run `/auth check-servers` to verify status
- Check if backend server is running: `cd backend && uvicorn app.main:app --reload`

### "Profile not found"
- Use `/auth verify-profile <email>` to check profile
- User may need to complete profile questionnaire

### "Personalization not working"
- Run `/auth test-personalization` to verify
- Check user has completed profile
- Verify token is being sent in requests

## Related Files

- Backend API: `backend/app/api/auth.py`, `backend/app/api/profile.py`
- Frontend Components: `frontend/src/components/Auth/`
- Auth Context: `frontend/src/contexts/AuthContext.tsx`
- Backend Services: `backend/app/services/auth_service.py`

## See Also

- [Backend Auth Implementation](../backend/AUTH_IMPLEMENTATION_SUMMARY.md)
- [Frontend Auth Implementation](../FRONTEND_AUTH_IMPLEMENTATION.md)
- [Testing Guide](../TESTING_GUIDE.md)
