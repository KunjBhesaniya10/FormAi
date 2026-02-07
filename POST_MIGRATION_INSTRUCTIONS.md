# FormAi Authentication Update

I have implemented the requested changes:
1.  **Register/Login Separation**: Separate forms with detailed fields (Password, Email, Full Name, Sport, Skill).
2.  **Password Security**: Passwords are hashed.
3.  **Real Data**: Dashboard and Profile screens now display real user data.
4.  **Logout**: Implemented in Settings.

## IMPORTANT: Database Migration
Before testing, you **MUST** run the following SQL in your Supabase SQL Editor:

```sql
ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}'::jsonb;
```

## Testing
1.  Restart your Expo app.
2.  Go to the "Register" tab.
3.  Create a new account with a password.
4.  You should be redirected to the Onboarding/Dashboard with your correct name and sport displayed.
