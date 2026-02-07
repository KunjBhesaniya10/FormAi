from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import json
import os
from models.context import UserContext, SportConfig
from database.client import supabase

router = APIRouter(prefix="/user", tags=["User"])

class OnboardRequest(BaseModel):
    user_id: str
    sport_id: str
    skill_level: str

import hashlib
import uuid

# Helper for hashing
def hash_password(password: str, salt: str = None) -> str:
    if not salt:
        salt = uuid.uuid4().hex
    # Simple SHA256 with salt
    key = hashlib.sha256(f"{password}{salt}".encode()).hexdigest()
    return f"{salt}${key}"

def verify_password(stored_hash: str, password: str) -> bool:
    try:
        salt, key = stored_hash.split('$')
        return hash_password(password, salt) == stored_hash
    except:
        return False

class RegisterRequest(BaseModel):
    username: str
    password: str
    email: str
    full_name: str
    sport_id: str
    skill_level: str

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register")
async def register(request: RegisterRequest):
    """
    Register a new user with password, email, and initial sport.
    """
    try:
        # 1. Check if user exists
        existing = supabase.table("users").select("id").eq("username", request.username).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Username already taken")

        # 2. Hash Password
        pwd_hash = hash_password(request.password)

        # 3. Create User
        user_data = {
            "username": request.username,
            "password_hash": pwd_hash,
            "email": request.email,
            "full_name": request.full_name,
            "current_sport_id": request.sport_id
        }
        user_resp = supabase.table("users").insert(user_data).execute()
        user = user_resp.data[0]
        user_id = user['id']

        # 4. Create Initial Sport Entry
        skill_level = request.skill_level
        if skill_level not in ['Beginner', 'Intermediate', 'Advanced', 'Pro']:
            skill_level = 'Beginner'

        sport_data = {
            "user_id": user_id,
            "sport_id": request.sport_id,
            "skill_level": skill_level,
            "joined_at": "now()",
            "profile_data": {}
        }
        supabase.table("user_sports").insert(sport_data).execute()

        return {
            "status": "success", 
            "user_id": user_id, 
            "current_sport_id": request.sport_id,
            "message": "Registration successful"
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Register error: {e}")
        # Check for column error to hint at migration
        if "column \"password_hash\" does not exist" in str(e):
             raise HTTPException(status_code=500, detail="Database schema outdated. Please run migration.")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(request: LoginRequest):
    """
    Login with username and password.
    """
    try:
        # 1. Fetch User
        # We need password_hash
        user_response = supabase.table("users").select("*").eq("username", request.username).execute()
        users = user_response.data
        
        if not users:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        user = users[0]
        stored_hash = user.get("password_hash")

        # 2. Verify Password
        # Backward compatibility for old users who might not have a password set (if any)
        # For strict security, force reset, but here we can just fail or allow if empty (insecure but practical for migration phase)
        # We will fail if no password set to enforce security.
        if not stored_hash:
             # If it's the specific demo user used before, maybe allow? No, let's enforce.
             raise HTTPException(status_code=401, detail="Account requires password setup (or invalid credentials)")

        if not verify_password(stored_hash, request.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
        return {
            "status": "success", 
            "user_id": user['id'], 
            "current_sport_id": user.get('current_sport_id')
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error detail: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/onboard")
async def onboard_user(request: OnboardRequest):
    """
    Onboards OR Switches a user to a specific sport.
    """
    try:
        # DB check constraint allows: 'Beginner', 'Intermediate', 'Advanced', 'Pro'
        skill_level = request.skill_level
        if skill_level not in ['Beginner', 'Intermediate', 'Advanced', 'Pro']:
            skill_level = 'Beginner'

        # 1. Update user's current sport pointer
        supabase.table("users").update({"current_sport_id": request.sport_id}).eq("id", request.user_id).execute()
        
        # 2. Add/Update user_sports entry
        # Check if already exists to decide insert or update (upsert)
        existing = supabase.table("user_sports").select("*").eq("user_id", request.user_id).eq("sport_id", request.sport_id).execute()
        
        data = {
            "user_id": request.user_id,
            "sport_id": request.sport_id,
            "skill_level": skill_level,
            "joined_at": "now()",
            "profile_data": {}
        }
        
        if existing.data:
            supabase.table("user_sports").update(data).eq("user_id", request.user_id).eq("sport_id", request.sport_id).execute()
        else:
            supabase.table("user_sports").insert(data).execute()
            
        print(f"User {request.user_id} switched to {request.sport_id}")
        return {"status": "success", "active_sport": request.sport_id}

    except Exception as e:
        print(f"Onboard error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard-config")
async def get_dashboard_config(user_id: str):
    """
    Returns the config for the user's current sport from DB + Local JSON config.
    """
    try:
        # 1. Get User
        user_resp = supabase.table("users").select("*").eq("id", user_id).single().execute()
        user = user_resp.data
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        active_sport_id = user.get("current_sport_id")
        if not active_sport_id:
             # Default fallback if no sport selected yet
             active_sport_id = "table_tennis"

        # 2. Get Config (JSON file)
        # Check both current dir and server/ dir for local testing
        config_path = f"configs/sports/{active_sport_id}.json"
        if not os.path.exists(config_path):
            config_path = f"server/configs/sports/{active_sport_id}.json"
        
        if not os.path.exists(config_path):
            # Fallback to defaults or error
             print(f"Config for {active_sport_id} not found, checking cwd: {os.getcwd()}")
             raise HTTPException(status_code=404, detail=f"Sport config for {active_sport_id} not found")
            
        with open(config_path, "r") as f:
            sport_config = json.load(f)

        # 3. Calculate Stats (Average Technical Score)
        stats = {
            "points": 0,
            "accuracy": "0%",
            "tier": "Beginner"
        }
        
        try:
            # Fetch sessions for this user & sport
            sessions_resp = supabase.table("sessions").select("analysis_json").eq("user_id", user_id).eq("sport_id", active_sport_id).execute()
            sessions = sessions_resp.data
            
            if sessions:
                total_sessions = len(sessions)
                total_score = 0
                for s in sessions:
                    try:
                        score = s.get("analysis_json", {}).get("technical_score", 0)
                        total_score += float(score)
                    except:
                        pass
                
                avg_score = total_score / total_sessions if total_sessions > 0 else 0
                
                stats["points"] = total_sessions * 150 # 150 points per session
                stats["accuracy"] = f"{int(avg_score * 10)}%" # Score 0-10 -> 0-100%
                stats["avg_score"] = round(avg_score, 1)
                
                # Simple Tier Logic
                if total_sessions > 10 and avg_score > 7:
                    stats["tier"] = "Pro"
                elif total_sessions > 5:
                    stats["tier"] = "Advanced"
                elif total_sessions > 2:
                    stats["tier"] = "Intermediate"
        except Exception as e:
            print(f"Stats calculation error: {e}")

        return {
            "user_id": user_id,
            "username": user.get("username"),
            "full_name": user.get("full_name"),
            "active_sport": active_sport_id,
            "theme": sport_config.get("theme_color"),
            "config": sport_config,
            "stats": stats
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Dashboard config error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
