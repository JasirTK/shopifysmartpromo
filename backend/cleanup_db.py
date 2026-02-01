import asyncio
from app.database import AsyncSessionLocal
from app.models import Section
from sqlalchemy import delete

async def cleanup():
    async with AsyncSessionLocal() as db:
        print("Deleting announcement_bar section...")
        await db.execute(delete(Section).where(Section.key == 'announcement_bar'))
        await db.commit()
    print("Cleanup complete.")

if __name__ == "__main__":
    asyncio.run(cleanup())
