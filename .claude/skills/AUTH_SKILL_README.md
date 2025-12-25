# Auth Skill - Complete Guide

## 🎯 Overview

The **Auth Skill** is a powerful command-line tool for testing and managing the authentication feature. It automates common auth-related tasks and makes testing easier.

---

## 🚀 Quick Start

```bash
# Check if servers are running
/auth check-servers

# Run complete test suite
/auth test-auth

# Create test users
/auth create-test-user beginner
/auth create-test-user advanced

# Test personalization
/auth test-personalization "What is ROS?"
```

---

## 📋 Available Commands

### 1. check-servers

**Check if backend and frontend are running**

```bash
/auth check-servers
```

**Output:**
- ✓ Backend status and health
- ✓ Frontend accessibility
- ✓ Database connection status

**Use when:**
- Starting development
- Debugging connection issues
- Verifying deployment

---

### 2. create-test-user

**Create a test user with specific skill level**

```bash
/auth create-test-user [beginner|intermediate|advanced]
```

**Examples:**
```bash
# Create beginner user
/auth create-test-user beginner

# Create intermediate user (default)
/auth create-test-user

# Create advanced user
/auth create-test-user advanced
```

**Output:**
- Email address (auto-generated)
- Password (always Test1234)
- JWT token (first 50 chars)

**Profile Settings:**

**Beginner:**
- Programming: Beginner
- Python: Basic
- ROS: Never heard
- AI/ML: None
- Interests: Autonomous navigation

**Intermediate:**
- Programming: Intermediate
- Python: Intermediate
- ROS: Beginner
- AI/ML: Pre-trained models
- Interests: Computer vision, simulation

**Advanced:**
- Programming: Expert
- Python: Advanced
- ROS: Advanced
- AI/ML: Production
- Interests: Physical AI, manipulation

---

### 3. test-auth

**Run complete authentication test suite**

```bash
/auth test-auth
```

**Tests Performed:**
1. ✓ Server availability check
2. ✓ User signup endpoint
3. ✓ User signin endpoint
4. ✓ Protected endpoint access
5. ✓ Profile creation endpoint

**Output:**
- Pass/fail for each test
- Error details if any fail
- Final summary

**Use when:**
- After code changes
- Before deploying
- Debugging auth issues

---

### 4. test-personalization

**Test personalized responses at different skill levels**

```bash
/auth test-personalization "Your question here"
```

**Examples:**
```bash
/auth test-personalization "What is ROS?"
/auth test-personalization "Explain ROS nodes"
/auth test-personalization "How does sensor fusion work?"
```

**What it does:**
1. Creates beginner test user
2. Creates advanced test user
3. Gets anonymous response (baseline)
4. Gets beginner-level response
5. Gets advanced-level response
6. Displays all three for comparison

**Use to verify:**
- Personalization is working
- Responses differ by skill level
- User profiles affect answers

---

### 5. verify-profile

**Verify a user's profile is set up correctly**

```bash
/auth verify-profile <email>
```

**Example:**
```bash
/auth verify-profile test@example.com
```

**Requirements:**
- User must exist
- Password must be Test1234 (for test users)

**Output:**
- Full profile JSON
- All profile fields
- Formatted for readability

**Use when:**
- Debugging profile issues
- Verifying profile data
- Checking user settings

---

## 🎓 Usage Examples

### Example 1: Quick Health Check

```bash
# Before starting work
/auth check-servers

# Expected output:
# ✓ Backend is running at http://localhost:8000
# ✓ Frontend is running at http://localhost:3000
# ✓ All servers are operational!
```

### Example 2: Full System Test

```bash
# Run complete test suite
/auth test-auth

# Expected output:
# ℹ Running authentication test suite...
# ℹ [1/5] Checking servers...
# ✓ All servers are operational!
# ℹ [2/5] Testing signup endpoint...
# ✓ Signup test passed
# ℹ [3/5] Testing signin endpoint...
# ✓ Signin test passed
# ℹ [4/5] Testing protected endpoint...
# ✓ Protected endpoint test passed
# ℹ [5/5] Testing profile endpoint...
# ✓ Profile creation test passed
# ✓ All authentication tests passed! ✨
```

### Example 3: Test Personalization Feature

```bash
# Create users and test personalization
/auth test-personalization "What is ROS?"

# Expected output:
# ℹ Testing personalization with question: 'What is ROS?'
# ℹ Creating test users...
#
# ℹ Getting anonymous response...
# Anonymous (Intermediate): ROS (Robot Operating System) is a flexible framework...
#
# ℹ Getting beginner response...
# Beginner Level: ROS, which stands for Robot Operating System, is like a toolbox...
#
# ℹ Getting advanced response...
# Advanced Level: ROS is a meta-operating system providing distributed computation...
#
# ✓ Personalization test complete!
```

### Example 4: Create Test Users for Manual Testing

```bash
# Create beginner user
/auth create-test-user beginner

# Output:
# Email: test-beginner-1735177200@test.com
# Password: Test1234
# Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOi...

# Now use these credentials in the frontend:
# 1. Go to http://localhost:3000/signin
# 2. Login with the email and password
# 3. Test the chatbot
```

### Example 5: Debug User Profile

```bash
# Verify a specific user's profile
/auth verify-profile test-beginner-1735177200@test.com

# Output:
# ✓ Profile found!
# {
#   "id": "...",
#   "user_id": "...",
#   "programming_experience": "beginner",
#   "python_proficiency": "basic",
#   "ros_experience": "never_heard",
#   ...
# }
```

---

## 🔧 Configuration

### Environment Variables

The skill uses these environment variables (with defaults):

```bash
BACKEND_URL=http://localhost:8000   # Backend API URL
FRONTEND_URL=http://localhost:3000  # Frontend URL
```

**To customize:**
```bash
# Linux/Mac
export BACKEND_URL=http://localhost:8080
/auth check-servers

# Windows
set BACKEND_URL=http://localhost:8080
bash .claude/skills/auth.sh check-servers
```

---

## 🐛 Troubleshooting

### "Backend not responding"

**Problem:** Backend server is not running

**Solution:**
```bash
cd backend
uvicorn app.main:app --reload
```

### "Frontend not responding"

**Problem:** Frontend server is not running

**Solution:**
```bash
cd frontend
npm start
```

### "Signup test failed"

**Possible causes:**
1. Database connection issue
2. Email already exists
3. Password validation failed

**Debug:**
```bash
# Check backend logs
# Check database connection in .env
# Try different email
```

### "Profile not found"

**Problem:** User hasn't completed profile

**Solution:**
1. Login to frontend
2. Go to /profile
3. Complete questionnaire
4. Try verify-profile again

---

## 📊 Test Coverage

The auth skill tests:

- ✅ Server connectivity (backend + frontend)
- ✅ User signup (with and without profile)
- ✅ User signin (credential validation)
- ✅ JWT token generation
- ✅ Protected endpoint access
- ✅ Profile CRUD operations
- ✅ Response personalization
- ✅ Different complexity levels

---

## 🎯 Best Practices

### Daily Development

```bash
# Start of day
/auth check-servers

# After making changes
/auth test-auth

# Before committing
/auth test-personalization "Test question"
```

### Testing Workflow

```bash
# 1. Verify system
/auth check-servers

# 2. Create test data
/auth create-test-user beginner
/auth create-test-user advanced

# 3. Test functionality
/auth test-auth
/auth test-personalization "What is ROS?"

# 4. Verify specific users
/auth verify-profile test@example.com
```

### Before Deployment

```bash
# Complete test suite
/auth test-auth

# Verify personalization
/auth test-personalization "Explain ROS nodes"
/auth test-personalization "What is sensor fusion?"
/auth test-personalization "How do I debug ROS?"

# Check all test users work
/auth create-test-user beginner
/auth create-test-user intermediate
/auth create-test-user advanced
```

---

## 🔗 Related Resources

- **Auth Implementation**: `backend/AUTH_IMPLEMENTATION_SUMMARY.md`
- **Frontend Implementation**: `FRONTEND_AUTH_IMPLEMENTATION.md`
- **Testing Guide**: `TESTING_GUIDE.md`
- **Skill Documentation**: `.claude/skills/auth.md`

---

## 💡 Tips

1. **Use check-servers first** - Always verify servers before other commands
2. **Save test credentials** - Keep the email/password from create-test-user
3. **Compare responses** - Use test-personalization to verify the feature works
4. **Automate testing** - Add to CI/CD pipeline for continuous testing
5. **Debug with verify-profile** - When users report issues, verify their profile first

---

## 🎉 Success!

The auth skill is ready to use! Try it out:

```bash
/auth check-servers
/auth test-auth
```

For more help, run:
```bash
/auth help
```
