from supabase import create_client, Client
from config import Config

def get_supabase() -> Client:
    if not Config.SUPABASE_URL or not Config.SUPABASE_KEY:
        raise ValueError("Supabase credentials not configured in .env")
    
    return create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)

# Singleton instance
supabase = get_supabase()
