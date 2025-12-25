from fastapi.testclient import TestClient
from backend.app.main import app
from unittest.mock import patch

client = TestClient(app)

# Mock auth dependency for protected endpoints
def mock_get_current_user():
    return {"user_id": "test_user_id", "email": "test@example.com"}

@patch('backend.app.api.translate.get_current_user', side_effect=mock_get_current_user)
@patch('backend.app.services.translation_service.translation_service')
def test_translate_endpoint(mock_translation_service, mock_user_dependency):
    mock_translation_service.translate_text.return_value = "Mocked Urdu Translation"
    
    response = client.post(
        "/api/translate",
        json={"text": "Hello world"}
    )
    assert response.status_code == 200
    assert response.json()["translated_text"] == "Mocked Urdu Translation"

@patch('backend.app.api.translate.get_current_user', side_effect=mock_get_current_user)
@patch('backend.app.services.translation_service.translation_service')
def test_translate_endpoint_translation_failed(mock_translation_service, mock_user_dependency):
    mock_translation_service.translate_text.return_value = None # Simulate translation failure
    
    response = client.post(
        "/api/translate",
        json={"text": "Hello world"}
    )
    assert response.status_code == 500
    assert response.json()["detail"] == "Translation failed"
