#!/bin/bash
# Chatbot Integration Test Skill
# Tests frontend chatbot and backend API integration

cd "$(dirname "$0")/../../backend" || exit 1

echo "🤖 Testing Chatbot Integration..."
echo "=================================="

# Check if backend is running
if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "❌ Backend not running on port 8000"
    echo "💡 Start with: cd backend && python -m uvicorn app.main:app --port 8000"
    exit 1
fi

echo "[OK] Backend server is running"

# Check if frontend is running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "⚠️  Frontend not running on port 3000"
    echo "💡 Start with: cd frontend && npm start"
fi

echo "[OK] Testing chat API endpoint..."

# Run API test
python test_api.py

echo ""
echo "=================================="
echo "✅ Chatbot integration test complete!"
echo ""
echo "📱 Open http://localhost:3000 to test manually:"
echo "   1. Select some text on the page"
echo "   2. Click a quick action button"
echo "   3. Verify the response appears"
