# Chatbot Integration Test Skill

Test the frontend chatbot and its integration with the backend RAG API.

## What this skill does

This skill helps you:
- Test chatbot UI functionality
- Verify backend API connection
- Test text selection feature
- Check quick action buttons
- Validate end-to-end chat flow

## Usage

```bash
/chatbot-test
```

## What it tests

1. **Backend API Endpoints**
   - Health check endpoint
   - Chat endpoint
   - Request/response format

2. **Frontend Features**
   - Chatbot widget loads
   - Text selection detection
   - Quick action buttons
   - Message sending
   - Response display

3. **Integration**
   - Frontend-backend communication
   - CORS configuration
   - API base URL configuration
   - Error handling

## Prerequisites

- Backend server running on port 8000
- Frontend server running on port 3000
- Valid OpenAI API key
- Qdrant database accessible

## Example Test Flow

1. Sends test question to API
2. Verifies response format
3. Checks sources are returned
4. Validates conversation ID
5. Tests selected text context

## Success Output

```
[OK] Backend health check passed
[OK] Chat API responding
[OK] Test question answered successfully
[OK] Sources returned: 5 chunks
[OK] Conversation ID generated
[OK] Frontend-backend integration working
```

## Common Issues

**Issue**: `Connection refused`
**Fix**: Start backend with `cd backend && python -m uvicorn app.main:app --port 8000`

**Issue**: `CORS error`
**Fix**: Check frontend URL is in backend CORS origins list

**Issue**: `422 Unprocessable Entity`
**Fix**: Check request payload matches ChatRequest schema
