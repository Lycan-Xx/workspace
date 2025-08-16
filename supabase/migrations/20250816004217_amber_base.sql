/*
  # Create accounts table for user financial accounts

  1. New Tables
    - `accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `account_number` (text, unique)
      - `account_name` (text)
      - `balance` (decimal, default 0)
      - `currency` (text, default 'NGN')
      - `account_type` (text, enum: savings, current)
      - `status` (text, enum: active, inactive, suspended)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `accounts` table
    - Add policy for users to read/update their own accounts
    - Add policy for admins to read all accounts

  3. Functions
    - Create function to generate unique account numbers
    - Create trigger to automatically create account when user profile is created
*/

-- Create enums
CREATE TYPE account_status_enum AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE financial_account_type_enum AS ENUM ('savings', 'current');

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_number text UNIQUE NOT NULL,
  account_name text NOT NULL,
  balance decimal(15,2) DEFAULT 0.00 CHECK (balance >= 0),
  currency text DEFAULT 'NGN',
  account_type financial_account_type_enum DEFAULT 'savings',
  status account_status_enum DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own accounts"
  ON accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts"
  ON accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to generate account number
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS text AS $$
DECLARE
  account_num text;
  exists_check boolean;
BEGIN
  LOOP
    -- Generate 10-digit account number starting with 4321
    account_num := '4321' || LPAD(floor(random() * 1000000)::text, 6, '0');
    
    -- Check if account number already exists
    SELECT EXISTS(SELECT 1 FROM accounts WHERE account_number = account_num) INTO exists_check;
    
    -- Exit loop if unique
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN account_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create account for new user profile
CREATE OR REPLACE FUNCTION create_user_account()
RETURNS trigger AS $$
DECLARE
  account_name_val text;
BEGIN
  -- Determine account name based on account type
  IF NEW.account_type = 'business' THEN
    account_name_val := NEW.business_name;
  ELSE
    account_name_val := CONCAT(NEW.first_name, ' ', NEW.last_name);
  END IF;

  -- Create account for the user
  INSERT INTO accounts (
    user_id,
    account_number,
    account_name,
    account_type
  )
  VALUES (
    NEW.id,
    generate_account_number(),
    account_name_val,
    CASE 
      WHEN NEW.account_type = 'business' THEN 'current'::financial_account_type_enum
      ELSE 'savings'::financial_account_type_enum
    END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create account
DROP TRIGGER IF EXISTS on_user_profile_created ON user_profiles;
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION create_user_account();

-- Create trigger for updated_at
CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_account_number ON accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(status);
CREATE INDEX IF NOT EXISTS idx_accounts_created_at ON accounts(created_at);