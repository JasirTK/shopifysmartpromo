from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback/Default for development if .env is missing or empty
    DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/shopifysmartpromo"

# Handle SSL for Production (Vercel, Neon, Render)
connect_args = {}
if "vercel" in DATABASE_URL or "neon" in DATABASE_URL or "render" in DATABASE_URL:
    connect_args = {"server_settings": {"jit": "off"}} # Optional perf tweak
    # Render Internal URLs usually don't need SSL forced, but external ones do.
    # We'll rely on the connection string params mostly.
    
engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
