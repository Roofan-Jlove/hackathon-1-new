# Authentication Testing Guide

## 🚀 Servers Running

- ✅ **Backend**: http://localhost:8000
- ✅ **Frontend**: http://localhost:3000

---

## 📋 Step-by-Step Testing Guide

### Test 1: Verify Backend is Running

**Check Health Endpoint:**
1. Open browser: http://localhost:8000/health
2. Should see: `{"status":"ok"}`

**Check API Docs:**
1. Open browser: http://localhost:8000/docs
2. Should see interactive API documentation (Swagger UI)
3. You can test endpoints directly from here!

---

### Test 2: Signup Flow (Complete User Journey)

**Step 2.1: Navigate to Signup**
1. Open browser: http://localhost:3000
2. Look at the top-right navbar
3. Click **"Sign Up"** button

**Step 2.2: Fill Credentials**
1. Email: `test@example.com`
2. Password: `Test1234` (must have uppercase + digit)
3. Confirm Password: `Test1234`
4. Click **"Continue to Profile"**

**Step 2.3: Complete Profile (Step 1 - Software)**
- Programming Experience: Select your level
- Python Proficiency: Select your level
- ROS Experience: Select your level
- AI/ML Experience: Select your level
- Click **"Next"**

**Step 2.4: Complete Profile (Step 2 - Hardware)**
- Robotics Hardware Experience: Select your level
- Sensor Integration: Select your level
- Electronics Knowledge: Select your level
- Click **"Next"**

**Step 2.5: Complete Profile (Step 3 - Goals)**
- Primary Interests: Select multiple interests (click to select/deselect)
- Time Commitment: Select your availability
- Click **"Complete Signup"**

**Expected Results:**
- ✅ Success message or redirect to home
- ✅ Navbar now shows your email address
- ✅ "Sign Out" button appears
- ✅ You're now logged in!

---

### Test 3: Test Personalized Chat

**With Authentication (Personalized Responses):**

1. Make sure you're signed in (check navbar)
2. Click the chatbot icon (bottom-right)
3. Ask: **"What is ROS?"**
4. **Note the response style** - should be tailored to your skill level:
   - Beginner: Detailed explanation with examples
   - Intermediate: Clear explanation with technical terms
   - Advanced: Concise, technical response

**Without Authentication (Default Responses):**

1. Click **"Sign Out"** in navbar
2. Open chatbot again
3. Ask the same question: **"What is ROS?"**
4. **Compare the response** - should be intermediate-level, generic

This demonstrates the personalization feature working!

---

### Test 4: Profile Management

**View Your Profile:**
1. Sign in if not already
2. Click your email in the navbar
3. Should navigate to `/profile`
4. See your account information and learning profile

**Update Your Profile:**
1. On profile page, click **"Update Profile"**
2. Change some answers in the questionnaire
3. Click through steps
4. Click **"Complete Signup"** on last step
5. Verify changes are saved

---

### Test 5: Session Persistence

**Test Auto-Login:**
1. While signed in, **refresh the page** (F5)
2. Verify you're still signed in (navbar shows email)

**Test Across Browser Restart:**
1. While signed in, **close the browser completely**
2. Reopen browser
3. Navigate to http://localhost:3000
4. Verify you're still signed in!

---

### Test 6: Protected Routes

**Test Profile Protection:**
1. Sign out
2. Try to navigate directly to: http://localhost:3000/profile
3. **Expected**: Automatically redirected to signin page
4. Sign in
5. **Expected**: Now can access profile page

---

### Test 7: Signin Flow

**Test Existing User Login:**
1. Sign out
2. Click **"Sign In"** in navbar
3. Email: `test@example.com`
4. Password: `Test1234`
5. Click **"Sign In"**
6. **Expected**: Successfully signed in, redirected to home

**Test Wrong Password:**
1. Try to sign in with wrong password
2. **Expected**: Error message displayed

---

### Test 8: Backend API Testing (Advanced)

**Using the API Docs (Swagger UI):**

1. Open http://localhost:8000/docs

**Test Signup Endpoint:**
1. Find `POST /api/auth/signup`
2. Click "Try it out"
3. Use this JSON:
```json
{
  "email": "api-test@example.com",
  "password": "ApiTest123",
  "profile": {
    "programming_experience": "intermediate",
    "python_proficiency": "advanced",
    "ros_experience": "beginner"
  }
}
```
4. Click "Execute"
5. Check response: Should get user data + token

**Test Signin Endpoint:**
1. Find `POST /api/auth/signin`
2. Click "Try it out"
3. Use this JSON:
```json
{
  "email": "api-test@example.com",
  "password": "ApiTest123"
}
```
4. Click "Execute"
5. Check response: Should get user data + token

**Test Protected Endpoint:**
1. Copy the token from signin response
2. Find `GET /api/auth/me`
3. Click "Try it out"
4. Click the lock icon (🔒) and paste token
5. Click "Execute"
6. Should get current user info

---

## 🐛 Troubleshooting

### Backend Issues

**Port Already in Use:**
```bash
# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /F /PID <process_id>
```

**Dependencies Missing:**
```bash
cd backend
pip install -r requirements.txt
# Or if using poetry:
poetry install
```

**Database Connection Error:**
- Check `.env` file has correct `NEON_DATABASE_URL`
- Verify database is accessible

### Frontend Issues

**Port Already in Use:**
```bash
# Frontend will auto-suggest port 3001
# Or kill process on port 3000
netstat -ano | findstr :3000
taskkill /F /PID <process_id>
```

**Dependencies Missing:**
```bash
cd frontend
npm install
```

**Build Errors:**
```bash
cd frontend
npm run clear
npm install
npm start
```

### Auth Issues

**"Invalid token" on page refresh:**
- Backend may have restarted (clears sessions)
- Sign out and sign in again

**Profile not loading:**
- Check browser console for errors
- Verify backend is running
- Check network tab in dev tools

**Chatbot not personalizing:**
- Verify you're signed in (check navbar)
- Make sure you completed profile
- Check browser console for token in requests

---

## ✅ What to Verify

After testing, you should have confirmed:

- [ ] Backend health endpoint works
- [ ] Can sign up new user
- [ ] Profile questionnaire works
- [ ] Can sign in existing user
- [ ] Session persists on refresh
- [ ] Navbar shows correct auth state
- [ ] Can sign out
- [ ] Protected routes redirect when not authenticated
- [ ] Can view and update profile
- [ ] Chatbot sends auth token when logged in
- [ ] Responses are personalized based on profile
- [ ] Anonymous chatbot still works

---

## 🎯 Success Criteria

**Complete Success** means:
1. ✅ Full signup → profile → signin → signout cycle works
2. ✅ Chatbot responses differ based on auth state
3. ✅ Profile persistence across sessions
4. ✅ Protected routes properly secured
5. ✅ No console errors during normal flow

---

## 📝 Notes

**Test Users:**
- Primary: `test@example.com` / `Test1234`
- API Test: `api-test@example.com` / `ApiTest123`

**Ports:**
- Backend: 8000
- Frontend: 3000

**Stopping Servers:**
- Backend: Press Ctrl+C in terminal
- Frontend: Press Ctrl+C in terminal

**Viewing Logs:**
- Backend: Check terminal where uvicorn is running
- Frontend: Check terminal where npm start is running
- Browser: F12 → Console tab

---

## 🚀 Ready to Test!

Start with **Test 2** (Signup Flow) and work through each test sequentially. Open http://localhost:3000 in your browser and let's see the auth system in action!
