import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    if SUPABASE_URL and not SUPABASE_URL.endswith("/"):
        SUPABASE_URL += "/"
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")
    
    # Validation
    if not GEMINI_API_KEY:
        print("WARNING: GEMINI_API_KEY not set")
    if not SUPABASE_URL:
        print("WARNING: SUPABASE_URL not set")
    if not SUPABASE_KEY:
        print("WARNING: SUPABASE_KEY not set")
