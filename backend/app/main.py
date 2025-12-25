from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Import CORSMiddleware
from app.api import chat, auth, profile
from app.core.config import get_logger


logger = get_logger(__name__)

app = FastAPI(title="Physical AI Textbook API")

# Configure CORS
origins = [
    "http://localhost:3000",  # Docusaurus dev server
    "http://localhost:3001",  # Docusaurus serve
    "http://localhost:5000",  # Alternative port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5000",
    "https://roofan-jlove.github.io",  # GitHub Pages deployments
    # Add production URLs as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(chat.router, prefix="/api", tags=["chat"])

@app.get("/")
async def read_root():
    logger.info("Root endpoint accessed.")
    return {"message": "Welcome to the Interactive Textbook Backend!"}

@app.get("/health")
async def health_check():
    logger.info("Health check endpoint accessed.")
    return {"status": "ok"}
