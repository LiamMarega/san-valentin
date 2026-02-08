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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Theme & personalisation (v2)
  theme TEXT DEFAULT 'classic',
  custom_content TEXT,
  relationship_type TEXT DEFAULT 'pareja',
  photo_url TEXT,
  music_url TEXT
);

-- Add columns for existing DBs that were created with the old schema
ALTER TABLE letters ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE letters ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE letters ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;

-- v2 personalisation columns
ALTER TABLE letters ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'classic';
ALTER TABLE letters ADD COLUMN IF NOT EXISTS custom_content TEXT;
ALTER TABLE letters ADD COLUMN IF NOT EXISTS relationship_type TEXT DEFAULT 'pareja';
ALTER TABLE letters ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE letters ADD COLUMN IF NOT EXISTS music_url TEXT;

-- v3 Paddle payment columns
ALTER TABLE letters ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE letters ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'free';
ALTER TABLE letters ADD COLUMN IF NOT EXISTS paddle_txn_id VARCHAR(100);
