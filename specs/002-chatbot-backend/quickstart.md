# Quickstart: Backend Setup

This guide provides the essential steps to set up your local environment for developing and running the backend services.

## 1. System Requirements

-   Python 3.10+
-   Poetry for dependency management (or `pip`)
-   Access to the required external services (OpenAI, Google Translate, Better-Auth, Neon, Qdrant).

## 2. Environment Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a Python virtual environment:**
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    ```

3.  **Install dependencies:**
    This project will use `pyproject.toml` for dependency management.
    ```bash
    pip install fastapi uvicorn[standard] python-dotenv langchain langchain-community langchain-openai qdrant-client sentence-transformers google-cloud-translate psycopg2-binary
    ```
    (A `pyproject.toml` or `requirements.txt` file will be created in a later step).

4.  **Set up Environment Variables:**
    Create a `.env` file in the `backend/` directory and add your API keys and service URLs:
    ```env
    OPENAI_API_KEY="sk-..."
    GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/google-credentials.json"
    BETTER_AUTH_API_KEY="..."
    NEON_DATABASE_URL="postgres://..."
    QDRANT_URL="..."
    QDRANT_API_KEY="..."
    ```

## 3. Running the Backend Server

Once the dependencies are installed and the `.env` file is configured, you can run the FastAPI server:

```bash
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`. You can access the auto-generated documentation at `http://localhost:8000/docs`.
