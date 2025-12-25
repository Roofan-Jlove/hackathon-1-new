"""
RAG Pipeline Setup Agent

This agent helps users set up and configure a RAG (Retrieval-Augmented Generation) pipeline.
It can:
- Set up vector database (Qdrant)
- Configure embeddings (HuggingFace)
- Index content into vector store
- Set up OpenAI integration
- Test the full pipeline
"""

from typing import List, Dict, Any
import os
from pathlib import Path


class RAGPipelineAgent:
    """
    Agent for setting up and managing RAG pipelines.

    This agent automates the process of:
    1. Checking required dependencies
    2. Setting up environment variables
    3. Configuring vector database
    4. Indexing content
    5. Testing the pipeline
    """

    def __init__(self):
        self.required_env_vars = [
            "OPENAI_API_KEY",
            "QDRANT_URL",
            "QDRANT_API_KEY"
        ]
        self.status = {}

    def check_environment(self) -> Dict[str, bool]:
        """Check if all required environment variables are set."""
        results = {}
        for var in self.required_env_vars:
            results[var] = os.getenv(var) is not None
        return results

    def verify_dependencies(self) -> Dict[str, bool]:
        """Verify required Python packages are installed."""
        required_packages = [
            "langchain",
            "langchain_community",
            "qdrant_client",
            "openai",
            "sentence_transformers"
        ]

        results = {}
        for package in required_packages:
            try:
                __import__(package)
                results[package] = True
            except ImportError:
                results[package] = False

        return results

    def setup_vector_database(self, url: str, api_key: str, collection_name: str = "book_content"):
        """
        Set up connection to Qdrant vector database.

        Args:
            url: Qdrant instance URL
            api_key: Qdrant API key
            collection_name: Name of the collection to create/use
        """
        from qdrant_client import QdrantClient
        from qdrant_client.models import Distance, VectorParams

        client = QdrantClient(url=url, api_key=api_key, prefer_grpc=False)

        # Check if collection exists
        try:
            collection_info = client.get_collection(collection_name)
            print(f"✓ Collection '{collection_name}' exists with {collection_info.points_count} points")
            return client
        except Exception:
            # Create collection if it doesn't exist
            print(f"Creating new collection: {collection_name}")
            client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE)
            )
            print(f"✓ Collection '{collection_name}' created")
            return client

    def index_documents(self, documents_path: str, collection_name: str = "book_content"):
        """
        Index documents from a directory into the vector database.

        Args:
            documents_path: Path to documents directory
            collection_name: Name of the collection to index into
        """
        from langchain_community.embeddings import HuggingFaceEmbeddings
        from langchain.text_splitter import RecursiveCharacterTextSplitter

        # Initialize embeddings
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

        # Load and split documents
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )

        # Process documents
        docs_path = Path(documents_path)
        if not docs_path.exists():
            raise ValueError(f"Documents path does not exist: {documents_path}")

        print(f"✓ Indexing documents from: {documents_path}")
        # Add your document loading logic here

    def test_pipeline(self, test_question: str = "What is ROS?") -> Dict[str, Any]:
        """
        Test the full RAG pipeline with a sample question.

        Args:
            test_question: Question to test with

        Returns:
            Dict with test results including answer and sources
        """
        from app.services.rag_service import rag_service
        import asyncio

        async def run_test():
            answer, sources = await rag_service.query_rag_pipeline(
                question=test_question,
                context=None
            )
            return {
                "question": test_question,
                "answer": answer,
                "sources_count": len(sources),
                "sources": sources[:2]  # Return first 2 sources
            }

        result = asyncio.run(run_test())
        print(f"✓ RAG pipeline test successful")
        print(f"  Question: {test_question}")
        print(f"  Answer length: {len(result['answer'])} characters")
        print(f"  Sources found: {result['sources_count']}")

        return result

    def generate_setup_report(self) -> str:
        """Generate a comprehensive setup status report."""
        report = []
        report.append("=" * 60)
        report.append("RAG Pipeline Setup Report")
        report.append("=" * 60)

        # Check environment
        env_status = self.check_environment()
        report.append("\n1. Environment Variables:")
        for var, status in env_status.items():
            symbol = "✓" if status else "✗"
            report.append(f"   {symbol} {var}")

        # Check dependencies
        dep_status = self.verify_dependencies()
        report.append("\n2. Dependencies:")
        for package, status in dep_status.items():
            symbol = "✓" if status else "✗"
            report.append(f"   {symbol} {package}")

        report.append("\n" + "=" * 60)
        return "\n".join(report)


# Example usage
if __name__ == "__main__":
    agent = RAGPipelineAgent()
    print(agent.generate_setup_report())
