# Database Migration Required

Please run the following SQL command in your Supabase SQL Editor to support password authentication:

```sql
ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}'::jsonb;
```
