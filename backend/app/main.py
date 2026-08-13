from fastapi import FastAPI, UploadFile, Form, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import os
import shutil
from dotenv import load_dotenv
load_dotenv()

from .generator import generate_card

app = FastAPI(title="HH Goa 2026 Builder ID API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "temp")
OUTPUT_DIR = os.path.join(BASE_DIR, "generated")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

app.mount("/generated", StaticFiles(directory=OUTPUT_DIR), name="generated")

@app.post("/api/generate")
async def generate(
    photo: UploadFile = File(...),
    name: str = Form(...),
    stack: str = Form(...),
    optional_field: str = Form("")
):
    if not photo.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
        
    ext = os.path.splitext(photo.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".heic", ".heif"]:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload JPG, PNG, or HEIC.")

    temp_path = os.path.join(UPLOAD_DIR, photo.filename)
    try:
        with open(temp_path, "wb") as f:
            shutil.copyfileobj(photo.file, f)
            
        card_id, public_url = generate_card(temp_path, name, stack, optional_field, OUTPUT_DIR)
        
        # Cleanup
        os.remove(temp_path)
        
        return {
            "success": True,
            "card_id": card_id,
            "image_url": public_url,
            "share_url": public_url
        }
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/share/{filename}", response_class=HTMLResponse)
async def share_page(request: Request, filename: str):
    image_url = f"{request.base_url}generated/{filename}"
    page_url = str(request.url)
    
    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HH Goa 2026 - Builder ID</title>
        <meta name="description" content="My HH Goa 2026 Builder ID is ready. #FrameInGoa">
        
        <meta property="og:type" content="website">
        <meta property="og:url" content="{page_url}">
        <meta property="og:title" content="HH Goa 2026 - Builder ID">
        <meta property="og:description" content="My HH Goa 2026 Builder ID is ready. #FrameInGoa">
        <meta property="og:image" content="{image_url}">

        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{page_url}">
        <meta property="twitter:title" content="HH Goa 2026 - Builder ID">
        <meta property="twitter:description" content="My HH Goa 2026 Builder ID is ready. #FrameInGoa">
        <meta property="twitter:image" content="{image_url}">
        
        <style>
            body {{
                background-color: #0A0A0C;
                color: white;
                font-family: sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
            }}
            img {{
                max-width: 90%;
                max-height: 80vh;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(234, 88, 12, 0.2);
            }}
            .btn {{
                margin-top: 20px;
                padding: 12px 24px;
                background-color: #EA580C;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
            }}
        </style>
    </head>
    <body>
        <img src="{image_url}" alt="Builder ID">
        <a href="/" class="btn">Create Your Own</a>
    </body>
    </html>
    """
    return HTMLResponse(content=html)
