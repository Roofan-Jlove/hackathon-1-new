# RAG Chatbot Implementation History

## Overview
This document details the implementation of a Retrieval-Augmented Generation (RAG) chatbot integrated into the "Physical AI & Humanoid Robotics" Docusaurus book. The chatbot enables users to ask questions about the book's content and receive contextually relevant responses based on the book's text.

## Architecture
- **Frontend**: React component embedded in Docusaurus layout
- **Backend**: FastAPI server with async support
- **Vector Database**: Qdrant Cloud (free tier) for document embeddings
- **Relational Database**: Neon Serverless Postgres for conversation history
- **LLM Integration**: OpenAI API for chat completions

## Components Implemented

### Backend (FastAPI)
1. **RAG Service** (`backend/app/services/rag_service.py`)
   - Implements the core RAG pipeline
   - Handles embedding generation and similarity search
   - Integrates with OpenAI for response generation
   - Supports context-aware queries based on selected text

2. **Indexing Service** (`backend/app/services/indexing_service.py`)
   - Parses book content from MD/MDX files
   - Creates vector embeddings of content chunks
   - Loads content into Qdrant vector database

3. **Chat API** (`backend/app/api/chat.py`)
   - Provides `/api/chat` endpoint for conversations
   - Adds `/api/index-book` for content indexing
   - Manages conversation state with UUIDs

4. **Database Models** (`backend/app/models.py`)
   - Extended to include Conversation and Message models
   - Supports conversation history tracking

### Frontend (React/Docusaurus)
1. **Chatbot Widget** (`frontend/src/components/Chatbot/ChatbotWidget.tsx`)
   - Floating chat interface with toggle functionality
   - Text selection integration for context-aware queries
   - Conversation history display
   - Source citations for retrieved content

2. **Styling** (`frontend/src/components/Chatbot/ChatbotWidget.module.css`)
   - Responsive design with dark/light mode support
   - Modern UI with typing indicators
   - Message bubbles with source references

## Key Features

### Text Selection Integration
- Users can select text on any page and ask questions about it
- Selected text is automatically provided as context to the chatbot
- Enhances contextual understanding of user queries

### RAG Pipeline
1. User asks question about book content
2. Question is embedded using sentence transformers
3. Vector search retrieves relevant book excerpts from Qdrant
4. Relevant context is combined with question in OpenAI prompt
5. Response is generated based on book content only
6. Sources are cited to show where information came from

### Content Indexing
- Automatically parses MD/MDX files from `frontend/docs`
- Splits content into manageable chunks
- Generates embeddings using HuggingFace models
- Stores in Qdrant for efficient similarity search

## Environment Variables Required
- `OPENAI_API_KEY` - for OpenAI API access
- `QDRANT_URL` - URL for Qdrant Cloud instance
- `QDRANT_API_KEY` - API key for Qdrant Cloud
- `NEON_DATABASE_URL` - Connection string for Neon Postgres

## API Endpoints
- `POST /api/chat` - Main chat endpoint
- `POST /api/index-book` - Index book content
- `GET /api/conversations/{user_id}` - Get user's conversations
- `GET /api/conversation/{conversation_id}` - Get specific conversation

## Usage Instructions
1. Set up environment variables in `.env` file
2. Start the backend server: `cd backend && uvicorn app.main:app --reload`
3. The chatbot will automatically index book content on first use
4. Chatbot widget appears on all book pages for user interaction

## Security Considerations
- API keys stored in environment variables
- Request validation using Pydantic models
- Rate limiting should be implemented in production
- Input sanitization for preventing prompt injection

## Performance Notes
- Vector search provides fast retrieval of relevant content
- Embeddings cached in Qdrant for efficient lookups
- Conversation state managed client-side with optional server-side persistence
- Chunked content allows for context-appropriate responses

## Testing
- Manual testing of chat functionality with various book topics
- Validation that responses are grounded in book content
- Verification of text selection context integration
- Cross-browser compatibility testing

## Future Enhancements
- User account integration for persistent conversation history
- Advanced conversation memory and context management
- Support for multimedia content in responses
- Analytics and usage tracking
- More sophisticated document parsing for better chunking