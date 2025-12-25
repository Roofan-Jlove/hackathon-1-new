from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_signup():
    response = client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "password123",
            "software_background": {"python": "advanced"},
            "hardware_background": {"jetson": "beginner"}
        }
    )
    assert response.status_code == 201
    assert "user_id" in response.json()
    assert response.json()["email"] == "test@example.com"

def test_signin():
    # First, sign up a user
    client.post(
        "/api/auth/signup",
        json={
            "email": "login@example.com",
            "password": "password123",
            "software_background": {},
            "hardware_background": {}
        }
    )
    
    response = client.post(
        "/api/auth/signin",
        json={"email": "login@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_signin_invalid_credentials():
    response = client.post(
        "/api/auth/signin",
        json={"email": "nonexistent@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"
