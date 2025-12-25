"""
Chatbot Integration Agent

This agent helps users integrate a chatbot with RAG capabilities into their frontend.
It can:
- Set up chatbot UI components
- Configure text selection features
- Add quick action buttons
- Test frontend-backend integration
- Generate integration code
"""

from typing import Dict, List, Any
import os
import json


class ChatbotIntegrationAgent:
    """
    Agent for integrating chatbot features into a web application.

    This agent automates:
    1. Chatbot component setup
    2. Text selection detection
    3. Quick action buttons configuration
    4. API integration
    5. Testing and validation
    """

    def __init__(self):
        self.features = {
            "text_selection": True,
            "quick_actions": ["explain", "summarize", "what"],
            "auto_open": True,
            "dark_mode": True
        }

    def generate_chatbot_config(self, api_base_url: str = "http://localhost:8000") -> Dict[str, Any]:
        """
        Generate chatbot configuration.

        Args:
            api_base_url: Backend API base URL

        Returns:
            Configuration dictionary
        """
        config = {
            "apiBaseUrl": api_base_url,
            "features": self.features,
            "endpoints": {
                "chat": "/api/chat",
                "health": "/health"
            },
            "ui": {
                "position": "bottom-right",
                "theme": "auto",
                "width": "350px",
                "height": "500px"
            }
        }

        print("✓ Chatbot configuration generated")
        return config

    def setup_text_selection(self) -> str:
        """
        Generate code for text selection detection.

        Returns:
            TypeScript/JavaScript code snippet
        """
        code = '''
// Text selection detection
useEffect(() => {
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedStr = selection?.toString().trim() || '';

    if (selectedStr.length > 3) {
      setSelectedText(selectedStr);
      console.log('Text selected:', selectedStr.substring(0, 50) + '...');
    }
  };

  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('touchend', handleTextSelection);

  return () => {
    document.removeEventListener('mouseup', handleTextSelection);
    document.removeEventListener('touchend', handleTextSelection);
  };
}, []);
'''
        print("✓ Text selection code generated")
        return code

    def setup_quick_actions(self, actions: List[str] = None) -> str:
        """
        Generate code for quick action buttons.

        Args:
            actions: List of action names

        Returns:
            TypeScript/JavaScript code snippet
        """
        if actions is None:
            actions = self.features["quick_actions"]

        code = f'''
const handleQuickAction = (action: string) => {{
  if (!selectedText) return;

  if (!isOpen) setIsOpen(true);

  let question = '';
  switch (action) {{
'''

        action_map = {
            "explain": "Explain this in detail",
            "summarize": "Summarize this",
            "what": "What is this about?",
            "more": "Tell me more about this"
        }

        for action in actions:
            question = action_map.get(action, f"Tell me about this")
            code += f'''    case '{action}':
      question = '{question}';
      break;
'''

        code += '''    default:
      question = action;
  }

  handleSendMessage(question);
};
'''
        print(f"✓ Quick actions code generated for: {', '.join(actions)}")
        return code

    def generate_api_integration(self, api_base_url: str) -> str:
        """
        Generate API integration code.

        Args:
            api_base_url: Backend API URL

        Returns:
            Fetch API code snippet
        """
        code = f'''
const sendChatMessage = async (question: string, context?: string) => {{
  try {{
    const response = await fetch('{api_base_url}/api/chat', {{
      method: 'POST',
      headers: {{
        'Content-Type': 'application/json',
      }},
      body: JSON.stringify({{
        question: question,
        context: context || undefined,
        conversation_id: conversationId || undefined,
      }}),
    }});

    if (!response.ok) {{
      throw new Error(`HTTP error! status: ${{response.status}}`);
    }}

    const data = await response.json();

    return {{
      answer: data.answer,
      sources: data.sources,
      conversation_id: data.conversation_id
    }};
  }} catch (error) {{
    console.error('Chat API error:', error);
    throw error;
  }}
}};
'''
        print("✓ API integration code generated")
        return code

    def test_integration(self, frontend_url: str = "http://localhost:3000",
                        backend_url: str = "http://localhost:8000") -> Dict[str, Any]:
        """
        Test frontend-backend integration.

        Args:
            frontend_url: Frontend server URL
            backend_url: Backend server URL

        Returns:
            Test results
        """
        import requests

        results = {
            "frontend_running": False,
            "backend_running": False,
            "api_responding": False,
            "cors_configured": False
        }

        # Test frontend
        try:
            requests.get(frontend_url, timeout=2)
            results["frontend_running"] = True
            print(f"✓ Frontend accessible at {frontend_url}")
        except Exception as e:
            print(f"✗ Frontend not accessible: {e}")

        # Test backend health
        try:
            response = requests.get(f"{backend_url}/health", timeout=2)
            if response.status_code == 200:
                results["backend_running"] = True
                print(f"✓ Backend health check passed")
        except Exception as e:
            print(f"✗ Backend health check failed: {e}")

        # Test chat API
        try:
            response = requests.post(
                f"{backend_url}/api/chat",
                json={"question": "Test question"},
                timeout=10
            )
            if response.status_code in [200, 422]:  # 422 is expected without context
                results["api_responding"] = True
                print(f"✓ Chat API is responding")
        except Exception as e:
            print(f"✗ Chat API test failed: {e}")

        return results

    def generate_integration_guide(self) -> str:
        """Generate a step-by-step integration guide."""
        guide = """
╔════════════════════════════════════════════════════════════╗
║         Chatbot Integration Guide                          ║
╚════════════════════════════════════════════════════════════╝

Step 1: Install Dependencies
----------------------------
npm install clsx

Step 2: Create Chatbot Component
---------------------------------
- Create ChatbotWidget.tsx component
- Add text selection detection
- Add quick action buttons
- Implement API integration

Step 3: Configure API Base URL
-------------------------------
- Set up API_BASE_URL in environment
- Configure CORS in backend
- Add frontend URL to allowed origins

Step 4: Add Chatbot to Layout
------------------------------
- Import ChatbotWidget in Root.tsx or Layout.tsx
- Add component to render tree
- Ensure it's available on all pages

Step 5: Style the Chatbot
--------------------------
- Create ChatbotWidget.module.css
- Add responsive styles
- Add dark mode support

Step 6: Test Integration
-------------------------
- Run backend: python -m uvicorn app.main:app --port 8000
- Run frontend: npm start
- Test text selection
- Test quick actions
- Verify API responses

Features Included:
------------------
✓ Text selection detection
✓ Quick action buttons (Explain, Summarize, What is this)
✓ Auto-open on quick action
✓ Dark mode support
✓ Source citations
✓ Conversation history

Troubleshooting:
----------------
Issue: CORS errors
Fix: Add frontend URL to backend CORS origins

Issue: API not responding
Fix: Check backend is running on correct port

Issue: Text selection not working
Fix: Check event listeners are attached to document
"""
        return guide

    def generate_deployment_checklist(self) -> List[str]:
        """Generate deployment checklist."""
        checklist = [
            "[ ] Environment variables configured (.env files)",
            "[ ] API keys added (OpenAI, Qdrant)",
            "[ ] Backend dependencies installed",
            "[ ] Frontend dependencies installed",
            "[ ] Vector database indexed with content",
            "[ ] Backend server starts without errors",
            "[ ] Frontend builds successfully",
            "[ ] CORS configured for production URLs",
            "[ ] API endpoints tested",
            "[ ] Chatbot UI displays correctly",
            "[ ] Text selection works on all pages",
            "[ ] Quick actions trigger correctly",
            "[ ] Responses appear in chat",
            "[ ] Sources are displayed",
            "[ ] Dark mode works",
            "[ ] Mobile responsive",
            "[ ] Error handling in place",
            "[ ] Loading states shown",
            "[ ] Analytics/logging configured (optional)",
        ]

        print("\n📋 Deployment Checklist:")
        print("=" * 50)
        for item in checklist:
            print(item)
        print("=" * 50)

        return checklist


# Example usage
if __name__ == "__main__":
    agent = ChatbotIntegrationAgent()

    print(agent.generate_integration_guide())
    print("\n")
    agent.generate_deployment_checklist()

    # Test integration
    print("\n🧪 Testing Integration...")
    results = agent.test_integration()
    print(f"\nTest Results: {results}")
