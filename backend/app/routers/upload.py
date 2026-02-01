import shutil
from pathlib import Path
from app.auth import get_current_user
from app.models import User
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends

router = APIRouter()

UPLOAD_DIR = Path("static/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/")
async def upload_file(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    try:
        # Create a safe filename (basic timestamp or unique ID could be added here)
        filename = file.filename.replace(" ", "_")
        file_path = UPLOAD_DIR / filename
        
        # Save the file
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return the URL (assuming mounted at /static)
        return {"url": f"http://localhost:8000/static/uploads/{filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
