from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("WARNING: DATABASE_URL not found in environment. Defaulting to local dev DB.")
    DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/shopifysmartpromo"
else:
    # Fix for SQLAlchemy async engine: postgres:// -> postgresql+asyncpg://
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
    elif DATABASE_URL.startswith("postgresql://") and "asyncpg" not in DATABASE_URL:
         DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Handle SSL for Production (Vercel, Neon, Render)
connect_args = {}
if "vercel" in DATABASE_URL or "neon" in DATABASE_URL or "render" in DATABASE_URL:
    connect_args = {"server_settings": {"jit": "off"}}

engine = create_async_engine(DATABASE_URL, echo=True, connect_args=connect_args)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
