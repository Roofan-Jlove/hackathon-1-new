import asyncio
import os
import sys
from dotenv import load_dotenv

# Add the project root to the Python path
# This is necessary to import from the 'app' module
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

# IMPORTANT: Load environment variables BEFORE importing services
# This ensures the services are initialized with the correct credentials
dotenv_path = os.path.join(project_root, '.env')
load_dotenv(dotenv_path=dotenv_path)

from app.services.indexing_service import indexing_service

async def main():
    """
    Main function to trigger the book content indexing process.
    """
    print("Starting data ingestion process...")
    print(f"Environment variables loaded from: {dotenv_path}")

    # Verify required environment variables are set
    required_vars = ["QDRANT_URL", "QDRANT_API_KEY", "OPENAI_API_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]

    if missing_vars:
        print(f"❌ Error: Missing required environment variables: {', '.join(missing_vars)}")
        print("Please ensure QDRANT_URL, QDRANT_API_KEY, and OPENAI_API_KEY are in your backend/.env file.")
        return

    print("✓ All required environment variables found")
    print(f"✓ QDRANT_URL: {os.getenv('QDRANT_URL')}")
    print(f"✓ OPENAI_API_KEY: {'*' * 20}...{os.getenv('OPENAI_API_KEY')[-4:]}")

    try:
        await indexing_service.index_book_content()
        print("\n✅ Data ingestion process completed successfully!")
    except Exception as e:
        print(f"\n❌ An error occurred during the ingestion process: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Ensure the script is run from the backend directory for correct path resolution
    if not os.path.basename(os.getcwd()) == "backend":
        print("Please run this script from the 'backend' directory.")
    else:
        # On Windows, the default event loop policy can cause issues with asyncio
        if sys.platform == "win32":
            asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
        asyncio.run(main())