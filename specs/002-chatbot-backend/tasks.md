# Tasks: RAG Chatbot and User Services Backend

**Input**: Design documents from `/specs/002-chatbot-backend/`

## Phase 1: Setup & Authentication

- [x] T001 Initialize a new FastAPI project in the `backend/` directory with a `pyproject.toml` file.
- [x] T002 Create the directory structure `backend/app/api`, `backend/app/services`, `backend/app/core`.
- [x] T003 Create `backend/app/main.py` as the main FastAPI app entry point.
- [x] T004 Create `backend/.env` file from `quickstart.md` and populate with placeholder values.
- [x] T005 [P] Implement a health check endpoint `/health` in `backend/app/main.py`.
- [x] T006 [P] Implement user signup and signin endpoints in `backend/app/api/auth.py` by integrating with `better-auth.com`.
- [x] T007 Implement a service in `backend/app/services/user_service.py` to create and retrieve user profiles from the Neon Postgres database.
- [x] T008 Define the `users` table schema in an SQL script or using an ORM like SQLAlchemy in `backend/app/models.py`.

## Phase 2: RAG Pipeline - Ingestion

- [x] T009 Create a data ingestion script in `backend/scripts/ingest_data.py`.
- [x] T010 [US1] Implement logic in `ingest_data.py` to find and read all `.mdx` files from the `Physical-AI-Humanoid-Robotics/docs/` directory.
- [x] T011 [US1] Implement text splitting logic in `ingest_data.py` to chunk the book content.
- [x] T012 [US1] Implement embedding logic in `ingest_data.py` to convert text chunks to vectors using `sentence-transformers/all-MiniLM-L6-v2`.
- [x] T013 [US1] Implement logic in `ingest_data.py` to connect to Qdrant Cloud and store the vector embeddings.
- [x] T014 [US1] Make the `ingest_data.py` script runnable as a CLI command.

## Phase 3: RAG Pipeline - API

- [x] T015 [US1] Create the `/chat` API endpoint in `backend/app/api/chat.py` according to the `chat.yml` OpenAPI contract.
- [x] T016 [US1] Implement the core RAG logic in `backend/app/services/rag_service.py`.
- [x] T017 [US1] In `rag_service.py`, implement the function to receive a user question and optional context text.
- [x] T018 [US1] In `rag_service.py`, implement the logic to embed the user's question.
- [x] T019 [US1] In `rag_service.py`, implement the logic to query Qdrant for relevant document chunks.
- [x] T020 [US1] In `rag_service.py`, implement the logic to call the OpenAI API, providing the original question and retrieved context to generate an answer.
- [x] T021 [US1] Connect the `/chat` endpoint to the `rag_service` to return the final answer to the user.

## Phase 4: Translation Service

- [x] T022 [US3] Create the `/translate` API endpoint in `backend/app/api/translate.py` according to the `translate.yml` OpenAPI contract.
- [x] T023 [US3] Implement a service in `backend/app/services/translation_service.py` to connect to the Google Translate API.
- [x] T024 [US3] Implement the logic in `translation_service.py` to take input text and return the Urdu translation.
- [x] T025 [US3] Connect the `/translate` endpoint to the `translation_service`.
- [x] T026 [US3] Ensure the `/translate` endpoint is secured and only accessible by authenticated users.

## Phase 5: Polish & Integration

- [x] T027 [P] Add unit tests for all services and API endpoints in the `backend/tests/` directory.
- [x] T028 [P] Add comprehensive logging to all services.
- [x] T029 Configure CORS middleware in `backend/app/main.py` to allow requests from the Docusaurus frontend.
- [x] T030 Create a `README.md` for the `backend/` directory with setup and run instructions.
- [x] T031 Finalize dependency list in `pyproject.toml` or `requirements.txt`.
