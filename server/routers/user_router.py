from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import json
import os
from models.context import UserContext, SportConfig

router = APIRouter(prefix="/user", tags=["User"])

class OnboardRequest(BaseModel):
    user_id: str
    sport_id: str
    skill_level: str

# In-memory store for prototype
user_active_sports = {
    "dummy_user_123": "table_tennis"
}

@router.post("/onboard")
async def onboard_user(request: OnboardRequest):
    """
    Onboards OR Switches a user to a specific sport.
    """
    user_active_sports[request.user_id] = request.sport_id
    print(f"User {request.user_id} switched to {request.sport_id}")
    
    return {"status": "success", "active_sport": request.sport_id}

@router.get("/dashboard-config")
async def get_dashboard_config(user_id: str):
    """
    Returns the config for the user's current sport from memory.
    """
    active_sport_id = user_active_sports.get(user_id, "table_tennis")
    
    # Check both current dir and server/ dir for local testing
    config_path = f"configs/sports/{active_sport_id}.json"
    if not os.path.exists(config_path):
        config_path = f"server/configs/sports/{active_sport_id}.json"
    
    if not os.path.exists(config_path):
        raise HTTPException(status_code=404, detail=f"Sport config for {active_sport_id} not found")
        
    with open(config_path, "r") as f:
        sport_config = json.load(f)
        
    return {
        "user_id": user_id,
        "active_sport": active_sport_id,
        "theme": sport_config.get("theme_color"),
        "config": sport_config
    }
