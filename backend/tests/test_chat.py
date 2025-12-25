from fastapi.testclient import TestClient
from backend.app.main import app
from unittest.mock import patch, MagicMock
import pytest

client = TestClient(app)

# Mock the RAG service to avoid actual API calls and dependencies during testing
@pytest.fixture(autouse=True)
def mock_rag_service():
    with patch('backend.app.api.chat.rag_service', new_callable=MagicMock) as mock_service:
        # Configure the mock to return a tuple, as expected by the endpoint
        mock_service.query_rag_pipeline.return_value = ("Mocked Answer", [{"chunk": "Mock Source", "score": 0.9}])
        yield mock_service

def test_chat_endpoint_with_context(mock_rag_service):
    """
    Tests the chat endpoint with both a question and context.
    """
    response = client.post(
        "/api/chat",
        json={"question": "What is ROS 2?", "context": "ROS 2 is a framework."}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == "Mocked Answer"
    assert len(data["sources"]) == 1
    assert data["sources"][0]["chunk"] == "Mock Source"
    # Verify that the service was called with the correct arguments
    mock_rag_service.query_rag_pipeline.assert_called_with(
        question="What is ROS 2?",
        context="ROS 2 is a framework.",
        conversation_id=data["conversation_id"]
    )

def test_chat_endpoint_no_context(mock_rag_service):
    """
    Tests the chat endpoint with only a question (no context).
    """
    response = client.post(
        "/api/chat",
        json={"question": "What is ROS 2?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == "Mocked Answer"
    # Verify that the service was called with context as None
    mock_rag_service.query_rag_pipeline.assert_called_with(
        question="What is ROS 2?",
        context=None,
        conversation_id=data["conversation_id"]
    )

def test_chat_endpoint_service_error(mock_rag_service):
    """
    Tests how the endpoint handles an exception from the RAG service.
    """
    # Configure the mock to raise an exception
    mock_rag_service.query_rag_pipeline.side_effect = Exception("Service unavailable")
    
    response = client.post(
        "/api/chat",
        json={"question": "This will fail"}
    )
    assert response.status_code == 500
    assert response.json() == {"detail": "Internal server error during chat processing"}

def test_health_check():
    """
    Tests the health check endpoint.
    """
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
