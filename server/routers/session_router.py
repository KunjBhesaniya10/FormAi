from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import google.generativeai as genai
import os
import json
import asyncio
import time
from typing import List
from database.client import supabase

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
        file_content = await file.read()
        f.write(file_content)

    video_url = None
    try:
        # 2. Upload to Supabase Storage
        # Ensure unique filename
        timestamp = int(time.time())
        storage_path = f"{user_id}/{timestamp}_{file.filename}"
        
        with open(file_path, 'rb') as f:
             # 'videos' is the bucket name. make sure it exists.
            try:
                supabase.storage.from_("videos").upload(file=f, path=storage_path, file_options={"content-type": file.content_type})
                video_url = supabase.storage.from_("videos").get_public_url(storage_path)
            except Exception as e:
                print(f"Storage Upload Failed: {e}")
                # We continue even if storage fails, just to show analysis
                video_url = "https://placeholder.com/video_failed_upload"

        # 3. Upload to Gemini File API
        print(f"Uploading {file.filename} to Gemini...")
        genai_file = await asyncio.to_thread(genai.upload_file, path=file_path)
        
        # 4. Wait for file to be processed
        while genai_file.state.name == "PROCESSING":
            print("Gemini is processing the video...")
            await asyncio.sleep(2)
            genai_file = await asyncio.to_thread(genai.get_file, genai_file.name)

        if genai_file.state.name == "FAILED":
            raise HTTPException(status_code=500, detail="Gemini video processing failed")

        # 5. Analyze with Gemini 3 Pro (The Next-Gen Reasoning Engine)
        model = genai.GenerativeModel('gemini-2.0-flash-lite-preview-02-05') 
        
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
             # Fallback if Gemini returns malformed JSON
            print("Failed to parse Gemini JSON, using fallback.")
            analysis_result = {
                "technical_score": 0.0,
                "summary": "Could not parse analysis.",
                "detailed_flaws": ["Analysis error"],
                "equipment_advice": "N/A"
            }

        # 6. Save Session to DB
        try:
            session_data = {
                "user_id": user_id,
                "sport_id": sport_id,
                "video_url": video_url,
                "duration_seconds": 0, # Could extract this
                "analysis_json": analysis_result,
                "coach_audio_script": analysis_result.get("summary", "")
            }
            supabase.table("sessions").insert(session_data).execute()
        except Exception as e:
            print(f"DB Insert Failed: {e}") 

        # Cleanup Local
        if os.path.exists(file_path):
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
