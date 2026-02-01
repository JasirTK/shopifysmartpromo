import shutil
import os
from pathlib import Path
from app.auth import get_current_user
from app.models import User
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Configure Cloudinary
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

if CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET:
    cloudinary.config( 
        cloud_name = CLOUDINARY_CLOUD_NAME, 
        api_key = CLOUDINARY_API_KEY, 
        api_secret = CLOUDINARY_API_SECRET,
        secure = True
    )
    USE_CLOUDINARY = True
else:
    USE_CLOUDINARY = False
    UPLOAD_DIR = Path("static/uploads")
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/")
async def upload_file(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    try:
        if USE_CLOUDINARY:
            # Upload to Cloudinary
            # result = cloudinary.uploader.upload(file.file, public_id=file.filename.split('.')[0])
            # Check if it's an image to optimize
            result = cloudinary.uploader.upload(file.file, folder="smart_promo_uploads")
            return {"url": result.get("secure_url")}
        else:
            # Fallback for Local Dev (or if keys missing)
            filename = file.filename.replace(" ", "_")
            file_path = UPLOAD_DIR / filename
            
            with file_path.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Assuming localhost:8000 for dev. In prod without Cloudinary this breaks, 
            # hence the requirement for Cloudinary on Vercel.
            return {"url": f"http://localhost:8000/static/uploads/{filename}"}
            
    except Exception as e:
        print(f"Upload Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
