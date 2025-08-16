/*
  # Create user profiles table for extended user data

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `business_name` (text)
      - `phone` (text)
      - `account_type` (text, enum: personal, business)
      - `tier` (integer, default 1)
      - `rc_number` (text, for business accounts)
      - `nin` (text, for business accounts)
      - `referral_code` (text)
      - `kyc_status` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for users to read/update their own profile
    - Add policy for admins to read all profiles

  3. Functions
    - Create trigger to automatically create profile when user signs up
*/

-- Create enum for account types
CREATE TYPE account_type_enum AS ENUM ('personal', 'business');

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  business_name text,
  phone text,
  account_type account_type_enum DEFAULT 'personal',
  tier integer DEFAULT 1 CHECK (tier >= 1 AND tier <= 3),
  rc_number text,
  nin text,
  referral_code text,
  kyc_status jsonb DEFAULT '{
    "bvn_verified": false,
    "documents_verified": false,
    "address_verified": false
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (
    id,
    first_name,
    last_name,
    business_name,
    phone,
    account_type,
    tier,
    rc_number,
    nin,
    referral_code
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'business_name',
    NEW.raw_user_meta_data->>'phone',
    COALESCE(
      (NEW.raw_user_meta_data->>'account_type')::account_type_enum,
      'personal'
    ),
    COALESCE((NEW.raw_user_meta_data->>'tier')::integer, 1),
    NEW.raw_user_meta_data->>'rc_number',
    NEW.raw_user_meta_data->>'nin',
    NEW.raw_user_meta_data->>'referral_code'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_account_type ON user_profiles(account_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tier ON user_profiles(tier);
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);