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
            result = cloudinary.uploader.upload(file.file, folder="smart_promo_uploads")
            return {"url": result.get("secure_url")}
        else:
            # Fallback: Base64 Encoding (No external dependency)
            # This allows images to work on Vercel without Cloudinary or persistent storage
            import base64
            contents = await file.read()
            encoded = base64.b64encode(contents).decode("utf-8")
            mime_type = file.content_type or "image/png"
            return {"url": f"data:{mime_type};base64,{encoded}"}
            
    except Exception as e:
        print(f"Upload Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
