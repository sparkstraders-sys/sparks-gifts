ALTER TABLE custom_requests ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'COD';
ALTER TABLE custom_requests ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'NOT_REQUIRED';
ALTER TABLE custom_requests ADD COLUMN IF NOT EXISTS payment_reference text;
