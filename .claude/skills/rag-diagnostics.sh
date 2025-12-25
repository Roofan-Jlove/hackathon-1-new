#!/bin/bash
# RAG Diagnostics Skill
# Tests the entire RAG pipeline and reports status

cd "$(dirname "$0")/../../backend" || exit 1

echo "🔍 Running RAG Pipeline Diagnostics..."
echo "======================================"

# Check if Python is available
if ! command -v python &> /dev/null; then
    echo "❌ Python not found"
    exit 1
fi

# Run the RAG diagnostic test
python test_rag.py

echo ""
echo "======================================"
echo "✅ Diagnostics complete!"
echo ""
echo "💡 Tip: If you see errors, check:"
echo "   - backend/.env file has all required keys"
echo "   - OpenAI API key has available quota"
echo "   - Qdrant database is accessible"
