from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.routers import public, admin, chat, upload, auth
from app.database import engine, Base
import asyncio

app = FastAPI(title="Smart Promo & Insights Assistant API")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public.router, prefix="/api/public", tags=["Public Content"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chatbot"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])

@app.on_event("startup")
async def startup():
    # In production, use Alembic. For quick proto, create tables here.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Promo API"}
