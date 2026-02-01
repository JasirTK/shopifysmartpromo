from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from datetime import datetime

class SectionBase(BaseModel):
    content: Dict[str, Any]

class SectionCreate(SectionBase):
    pass

class SectionUpdate(SectionBase):
    pass

class SectionResponse(SectionBase):
    key: str
    last_updated: datetime

    class Config:
        orm_mode = True

class ChatMessage(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    response: str
