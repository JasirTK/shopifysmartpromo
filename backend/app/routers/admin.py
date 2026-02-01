from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models import Section
from app.schemas import SectionUpdate, SectionResponse

router = APIRouter()

from app.auth import get_current_user
from app.models import User

@router.put("/content/{key}", response_model=SectionResponse)
async def update_content(key: str, section_update: SectionUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Section).where(Section.key == key))
    section = result.scalars().first()
    
    if not section:
        # Create if not exists (upsert-ish behavior for admin convenience)
        section = Section(key=key, content=section_update.content)
        db.add(section)
    else:
        section.content = section_update.content
    
    await db.commit()
    await db.refresh(section)
    return section
