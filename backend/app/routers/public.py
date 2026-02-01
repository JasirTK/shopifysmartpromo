from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models import Section
from app.schemas import SectionResponse
from typing import List

router = APIRouter()

@router.get("/content/{key}", response_model=SectionResponse)
async def get_content(key: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Section).where(Section.key == key))
    section = result.scalars().first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section

@router.get("/all-content", response_model=List[SectionResponse])
async def get_all_content(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Section))
    sections = result.scalars().all()
    return sections
