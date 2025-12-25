# Project Agents & Skills

This directory contains reusable agents and skills for the RAG-powered Interactive Textbook project.

## 📁 Structure

```
agents/
├── rag_pipeline_agent.py          # RAG setup and management agent
├── chatbot_integration_agent.py   # Chatbot integration agent
└── README.md

.claude/skills/
├── rag-diagnostics.md             # RAG testing skill
├── rag-diagnostics.sh
├── chatbot-test.md                # Chatbot testing skill
└── chatbot-test.sh
```

---

## 🤖 Subagents

### 1. RAG Pipeline Agent

**File**: `rag_pipeline_agent.py`

**Purpose**: Automate RAG pipeline setup and configuration

**Features**:
- Check environment variables
- Verify dependencies
- Set up Qdrant vector database
- Index documents into vector store
- Test full pipeline
- Generate setup reports

**Usage**:
```python
from agents.rag_pipeline_agent import RAGPipelineAgent

agent = RAGPipelineAgent()

# Check environment
print(agent.generate_setup_report())

# Test pipeline
result = agent.test_pipeline("What is ROS?")
print(f"Answer: {result['answer']}")
```

**Key Methods**:
- `check_environment()` - Verify env vars
- `verify_dependencies()` - Check packages
- `setup_vector_database()` - Configure Qdrant
- `index_documents()` - Index content
- `test_pipeline()` - Run end-to-end test
- `generate_setup_report()` - Status report

---

### 2. Chatbot Integration Agent

**File**: `chatbot_integration_agent.py`

**Purpose**: Automate chatbot frontend integration

**Features**:
- Generate chatbot configuration
- Create text selection code
- Set up quick action buttons
- Generate API integration code
- Test frontend-backend integration
- Provide integration guides

**Usage**:
```python
from agents.chatbot_integration_agent import ChatbotIntegrationAgent

agent = ChatbotIntegrationAgent()

# Generate configuration
config = agent.generate_chatbot_config("http://localhost:8000")

# Get integration guide
print(agent.generate_integration_guide())

# Test integration
results = agent.test_integration()
```

**Key Methods**:
- `generate_chatbot_config()` - Create config
- `setup_text_selection()` - Text selection code
- `setup_quick_actions()` - Quick action buttons
- `generate_api_integration()` - API client code
- `test_integration()` - Test connectivity
- `generate_integration_guide()` - Step-by-step guide
- `generate_deployment_checklist()` - Pre-deploy checks

---

## ⚡ Skills

### 1. RAG Diagnostics Skill

**Command**: `/rag-diagnostics`

**Purpose**: Test and diagnose RAG pipeline

**What it does**:
1. Checks environment variables (OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY)
2. Tests OpenAI API connection and quota
3. Verifies Qdrant database connection
4. Checks indexed content count
5. Tests embedding generation
6. Runs full RAG pipeline test

**Usage**:
```bash
# Using Claude Code CLI
/rag-diagnostics

# Or manually
cd backend
python test_rag.py
```

**Example Output**:
```
============================================================
RAG Pipeline Diagnostic Test
============================================================

1. Checking environment variables...
   [OK] OPENAI_API_KEY: sk-proj-FXdUfu9Mhiv7...
   [OK] QDRANT_URL: https://47b35256-fb7...
   [OK] QDRANT_API_KEY: eyJhbGciOiJIUzI1NiIs...

2. Importing RAG service...
   [OK] RAG service imported successfully

3. Checking Qdrant connection...
   [OK] Connected to Qdrant
   Collections: ['book_content']

4. Checking book_content collection...
   [OK] Collection exists
   Points count: 355
   Vector size: 384

5. Testing embedding generation...
   [OK] Embedding generated
   Embedding dimension: 384

6. Testing Qdrant search...
   [OK] Search executed
   Results found: 3
   First result score: 0.73171604

7. Testing full RAG pipeline...
   [OK] RAG pipeline executed
   Answer: ROS is not a traditional operating system...
   Sources count: 5

============================================================
Diagnostic test complete!
============================================================
```

---

### 2. Chatbot Test Skill

**Command**: `/chatbot-test`

**Purpose**: Test chatbot UI and API integration

**What it does**:
1. Checks backend server is running (port 8000)
2. Checks frontend server is running (port 3000)
3. Tests health check endpoint
4. Tests chat API endpoint
5. Validates request/response format
6. Verifies sources are returned

**Usage**:
```bash
# Using Claude Code CLI
/chatbot-test

# Or manually
cd backend
python test_api.py
```

**Example Output**:
```
🤖 Testing Chatbot Integration...
==================================
[OK] Backend server is running

Testing RAG API endpoint...
URL: http://localhost:8000/api/chat
Payload: {
  "question": "What is ROS?",
  "context": null
}

Sending request...

Status Code: 200

[SUCCESS] RAG API is working!

Answer:
ROS is not a traditional operating system like Windows or Linux...

Sources: 5 sources returned

First source preview:
  - Score: 0.73171604
  - Content: ROS is not a traditional operating system...

==================================
✅ Chatbot integration test complete!

📱 Open http://localhost:3000 to test manually:
   1. Select some text on the page
   2. Click a quick action button
   3. Verify the response appears
```

---

## 🚀 Quick Start

### Using the Agents

1. **Test RAG Pipeline**:
```bash
cd agents
python rag_pipeline_agent.py
```

2. **Test Chatbot Integration**:
```bash
cd agents
python chatbot_integration_agent.py
```

### Using the Skills

1. **RAG Diagnostics**:
```bash
cd .claude/skills
./rag-diagnostics.sh
```

2. **Chatbot Test**:
```bash
cd .claude/skills
./chatbot-test.sh
```

---

## 📝 When to Use

### Use RAG Pipeline Agent when:
- Setting up a new RAG system
- Debugging RAG issues
- Verifying configuration
- Indexing new content
- Migrating to new vector DB

### Use Chatbot Integration Agent when:
- Adding chatbot to new pages
- Integrating with different frameworks
- Troubleshooting frontend issues
- Deploying to production
- Creating integration docs

### Use RAG Diagnostics Skill when:
- API key quota issues
- Search results problems
- Embedding failures
- After changing configuration
- Before deployment

### Use Chatbot Test Skill when:
- After code changes
- Before committing
- Debugging integration issues
- Verifying API responses
- Testing new features

---

## 🔧 Customization

### Adding New Quick Actions

Edit `chatbot_integration_agent.py`:

```python
self.features = {
    "quick_actions": ["explain", "summarize", "what", "compare"]
}

action_map = {
    "compare": "Compare this with other concepts"
}
```

### Adding New Diagnostics

Edit `rag_pipeline_agent.py`:

```python
def check_custom_feature(self):
    # Add custom checks here
    pass
```

---

## 📊 Performance Metrics

Both agents track:
- Setup time
- Test success rate
- API response time
- Error frequency
- Resource usage

---

## 🐛 Troubleshooting

### Common Issues

**Agent Import Errors**:
```bash
# Add agents directory to Python path
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

**Skill Permission Denied**:
```bash
# Make skills executable
chmod +x .claude/skills/*.sh
```

**Connection Refused**:
```bash
# Start servers first
cd backend && python -m uvicorn app.main:app --port 8000 &
cd frontend && npm start &
```

---

## 📚 Additional Resources

- [RAG Service Documentation](../backend/app/services/rag_service.py)
- [Chatbot Component](../frontend/src/components/Chatbot/ChatbotWidget.tsx)
- [API Documentation](http://localhost:8000/docs)
- [Project README](../README.md)

---

## 🤝 Contributing

To add new agents or skills:

1. Create agent file in `agents/` directory
2. Create skill files in `.claude/skills/`
3. Update this README
4. Test thoroughly
5. Document usage examples

---

## 📄 License

Same as main project
