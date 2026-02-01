from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from app.database import Base

class Section(Base):
    __tablename__ = "sections"

    key = Column(String, primary_key=True, index=True) # e.g., 'hero', 'features'
    content = Column(JSONB, nullable=False) # The structured content
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    user_message = Column(Text)
    bot_response = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
