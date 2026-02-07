from database.client import supabase
import sys

try:
    print("Testing Supabase connection...")
    res = supabase.table("users").select("*", count="exact").limit(1).execute()
    print("Connection successful!")
    print(f"Users found: {res.count}")
    
    # Try finding a non-existent user with single()
    print("Testing single() behavior for non-existent user...")
    try:
        res = supabase.table("users").select("*").eq("username", "random_unlikely_user_12345").single().execute()
        print("Found user (unexpectedly)")
    except Exception as e:
        print(f"Exception caught (expected if single() fails on no rows): {e}")

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
