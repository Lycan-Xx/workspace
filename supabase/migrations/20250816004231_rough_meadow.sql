/*
  # Create transactions table for financial transactions

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `from_account_id` (uuid, references accounts)
      - `to_account_id` (uuid, references accounts)
      - `amount` (decimal)
      - `currency` (text, default 'NGN')
      - `transaction_type` (text, enum)
      - `status` (text, enum)
      - `reference` (text, unique)
      - `description` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `transactions` table
    - Add policy for users to read their own transactions
    - Add policy for system to create transactions

  3. Functions
    - Create function to generate unique transaction references
*/

-- Create enums
CREATE TYPE transaction_type_enum AS ENUM (
  'transfer', 'deposit', 'withdrawal', 'payment', 
  'airtime', 'data', 'electricity', 'cable', 'school_fees'
);

CREATE TYPE transaction_status_enum AS ENUM (
  'pending', 'processing', 'completed', 'failed', 'cancelled'
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  from_account_id uuid REFERENCES accounts(id),
  to_account_id uuid REFERENCES accounts(id),
  amount decimal(15,2) NOT NULL CHECK (amount > 0),
  currency text DEFAULT 'NGN',
  transaction_type transaction_type_enum NOT NULL,
  status transaction_status_enum DEFAULT 'pending',
  reference text UNIQUE NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    auth.uid() IN (
      SELECT user_id FROM accounts WHERE id = from_account_id OR id = to_account_id
    )
  );

CREATE POLICY "System can create transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to generate transaction reference
CREATE OR REPLACE FUNCTION generate_transaction_reference()
RETURNS text AS $$
DECLARE
  ref_num text;
  exists_check boolean;
BEGIN
  LOOP
    -- Generate reference like TXN202501221234567890
    ref_num := 'TXN' || TO_CHAR(now(), 'YYYYMMDD') || LPAD(floor(random() * 1000000000)::text, 10, '0');
    
    -- Check if reference already exists
    SELECT EXISTS(SELECT 1 FROM transactions WHERE reference = ref_num) INTO exists_check;
    
    -- Exit loop if unique
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN ref_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updated_at
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_from_account ON transactions(from_account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_to_account ON transactions(to_account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);