# HH Goa 2026 - Builder ID Card Generator

A professional, creative Builder ID card generator for the Hacker House Goa 2026 event. 
Users can upload their photo, enter details, and instantly generate a beautifully designed Builder pass suitable for sharing on X (formerly Twitter) using `#FrameInGoa`.

## Features
- Fast, NO-signup generation
- Client-side upload, server-side processing
- Automatic EXIF orientation fix
- Robust HEIC/HEIF support
- High-quality card composition using Google Fonts and custom graphic design
- Social-sharing ready (`og:image` injection via dynamic share URLs)
- Responsive, premium dark-mode frontend

## Architecture
- **Frontend**: React + Vite (Fast, beautiful UI)
- **Backend**: Python + FastAPI
- **Image Processing**: Pillow + pillow-heif
- **Storage**: Ephemeral local storage for MVP (No DB required)

## Installation & Running Locally

### Backend Setup
1. Open a terminal and navigate to the `backend` folder.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `.\venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
   Server will run at `http://localhost:8000`

### Frontend Setup
1. Open a second terminal and navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Frontend will run at `http://localhost:5173`

## Project Structure
```
goa_hackhouse/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   └── generator.py
│   ├── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```
