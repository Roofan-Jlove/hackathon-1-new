---
title: Leverage Existing RAG Chatbot Implementation
date: 2025-12-17
status: Accepted
deciders:
  - Gemini CLI
---

## Context

The initial request was to implement a Retrieval-Augmented Generation (RAG) chatbot within the project. Upon investigation of the provided codebase, it was discovered that a significant portion of the RAG chatbot's backend (FastAPI endpoints, RAG service, indexing service) and frontend (React components, conditional rendering logic) was already present and well-structured.

## Decision

The decision was made to leverage and enhance the existing RAG chatbot implementation rather than starting from scratch. This involved:

*   **Backend:**
    *   Confirming the completeness and correctness of the `/api/chat` endpoint, `rag_service.py`, and `indexing_service.py`.
    *   Enhancing the backend's `test_chat.py` with more comprehensive unit tests for various request scenarios and error handling.
    *   Creating a standalone `ingest_data.py` script to programmatically trigger the `indexing_service` and updating the `backend/README.md` with relevant usage instructions.
*   **Frontend:**
    *   Confirming the `ChatbotWidget.tsx` and `ConditionalChatbot.tsx` components fulfilled the UI and conditional rendering requirements (chatbot appears only on book content pages).
    *   Integrating the `ConditionalChatbot` into the Docusaurus `DocItem.tsx` for proper display on all documentation pages.
    *   Centralizing API base URL configuration through `docusaurus.config.ts` and `frontend/src/theme/Root.tsx` to ensure the correct backend endpoint is used consistently, removing redundant global script injection from `frontend/static/js/config.js` and `docusaurus.config.ts`.
    *   Rewriting `ChatbotWidget.test.tsx` to align with the actual component implementation, mock the `fetch` API correctly, and improve test coverage, including for selected text context.

## Status

Accepted

## Consequences

*   **Positive:**
    *   Significant time-saving in development as core functionalities were already present.
    *   Ensured consistency with existing project architecture and coding standards.
    *   Improved overall code quality and test coverage through additions and refactoring.
*   **Negative:**
    *   Required thorough investigation and understanding of pre-existing code, which took some initial time.
    *   Some refactoring of existing configurations and tests was necessary to align with best practices and the actual component behavior.
