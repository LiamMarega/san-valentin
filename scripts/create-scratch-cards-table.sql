-- Create scratch_cards table for digital scratch card feature
CREATE TABLE IF NOT EXISTS scratch_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Sender/Receiver info
  sender_name TEXT NOT NULL,
  sender_email TEXT,
  receiver_name TEXT NOT NULL,
  receiver_email TEXT NOT NULL,
  
  -- Content
  hidden_message TEXT NOT NULL,
  reveal_message TEXT,
  
  -- Theming
  theme TEXT NOT NULL DEFAULT 'corazones',
  custom_cover_url TEXT,
  
  -- Premium features
  is_premium BOOLEAN DEFAULT false,
  photo_url TEXT,
  music_url TEXT,
  
  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  timezone TEXT DEFAULT 'America/Argentina/Buenos_Aires',
  
  -- Status tracking
  status TEXT DEFAULT 'pending',
  scratch_percentage INTEGER DEFAULT 0,
  scratched_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  
  -- Payment
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  mp_payment_id VARCHAR(255),
  
  -- Email
  email_provider TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scratch_cards_receiver_email ON scratch_cards(receiver_email);
CREATE INDEX IF NOT EXISTS idx_scratch_cards_status ON scratch_cards(status);
CREATE INDEX IF NOT EXISTS idx_scratch_cards_payment_status ON scratch_cards(payment_status);
