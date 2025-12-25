# RAG Diagnostics Skill

Diagnose and test the RAG (Retrieval-Augmented Generation) pipeline.

## What this skill does

This skill helps you:
- Test OpenAI API key and quota
- Check Qdrant vector database connection
- Verify indexed content
- Test embedding generation
- Run full RAG pipeline test
- Diagnose common issues

## Usage

```bash
/rag-diagnostics
```

## What it checks

1. **Environment Variables**
   - OPENAI_API_KEY
   - QDRANT_URL
   - QDRANT_API_KEY

2. **OpenAI API**
   - Key validity
   - Available quota
   - Model access

3. **Qdrant Vector Database**
   - Connection status
   - Collection existence
   - Number of indexed chunks
   - Vector dimensions

4. **Embeddings**
   - Model loading
   - Embedding generation
   - Vector search

5. **Full RAG Pipeline**
   - End-to-end test with sample question
   - Response generation
   - Source retrieval

## Example Output

```
[OK] Environment variables loaded
[OK] OpenAI API key valid with quota
[OK] Qdrant connected (355 chunks indexed)
[OK] Embeddings working (384 dimensions)
[OK] RAG pipeline test successful
```

## Common Issues

**Issue**: `insufficient_quota`
**Fix**: Add credits at https://platform.openai.com/account/billing

**Issue**: `Qdrant connection failed`
**Fix**: Check QDRANT_URL and QDRANT_API_KEY in .env

**Issue**: `Collection not found`
**Fix**: Run indexing with `/rag-index` skill
