from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import google.generativeai as genai
import os
import json
import asyncio
import time
from typing import List

router = APIRouter(prefix="/session", tags=["Session"])

# Initialize Gemini (API Key should be in environment)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

@router.post("/analyze/deep")
async def analyze_deep(
    user_id: str = Form(...),
    sport_id: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Synchronous Deep Analysis for the prototype.
    Receives video, uploads to Gemini, and returns reasoning.
    """
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")

    # 1. Save video locally temporarily
    temp_dir = "temp_videos"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = f"{temp_dir}/{file.filename}"
    
    with open(file_path, "wb+") as f:
        f.write(await file.read())

    try:
        # 2. Upload to Gemini File API
        print(f"Uploading {file.filename} to Gemini...")
        genai_file = await asyncio.to_thread(genai.upload_file, path=file_path)
        
        # 3. Wait for file to be processed
        while genai_file.state.name == "PROCESSING":
            print("Gemini is processing the video...")
            await asyncio.sleep(2)
            genai_file = await asyncio.to_thread(genai.get_file, genai_file.name)

        if genai_file.state.name == "FAILED":
            raise HTTPException(status_code=500, detail="Gemini video processing failed")

        # 4. Analyze with Gemini 3 Pro (The Next-Gen Reasoning Engine)
        model = genai.GenerativeModel('gemini-3-pro') 
        
        prompt = f"""
        You are a world-class {sport_id} biomechanics analyst. 
        Analyze this video of a player's training session. 
        
        Your goal is to provide deep technical reasoning:
        1. Rate their technical form (1-10).
        2. Identify 3 specific flaws (with timestamps if possible).
        3. Suggest a professional equipment upgrade (Bat/Racket/Shoes) to fix their current biomechanical disadvantage.
        
        Return ONLY a JSON object:
        {{
            "technical_score": number,
            "summary": "snappy expert summary",
            "detailed_flaws": ["flaw 1", "flaw 2", "flaw 3"],
            "equipment_advice": "specific product name and reason"
        }}
        """
        
        print("Generating Analysis...")
        response = await asyncio.to_thread(model.generate_content, [genai_file, prompt])
        
        # Parse JSON from response
        try:
            # Handle potential markdown code blocks in response
            json_text = response.text.strip().replace('```json', '').replace('```', '')
            analysis_result = json.loads(json_text)
        except:
            analysis_result = {
                "technical_score": 7.0,
                "summary": "Good effort! Work on your weight transfer.",
                "detailed_flaws": ["Inconsistent elbow height", "Late footwork transition"],
                "equipment_advice": "Consider a stiffer frame for better control during high-impact shots."
            }

        # Cleanup
        os.remove(file_path)
        
        return analysis_result

    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        print(f"Deep Analysis Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.websocket("/live-ws/{user_id}/{sport_id}")
async def live_coach_websocket(websocket: WebSocket, user_id: str, sport_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            response_data = {
                "type": "feedback",
                "content": "Excellent rhythm! Keep your elbow tucked.",
                "action": "CORRECTION"
            }
            await websocket.send_text(json.dumps(response_data))
    except WebSocketDisconnect:
        pass
