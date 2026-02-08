CREATE TABLE IF NOT EXISTS letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  receiver_email TEXT NOT NULL,
  message_type TEXT NOT NULL,
  response TEXT,
  status TEXT,
  timezone TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add columns for existing DBs that were created with the old schema
ALTER TABLE letters ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE letters ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE letters ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;
