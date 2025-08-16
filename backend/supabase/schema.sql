
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type') THEN
    CREATE TYPE account_type AS ENUM ('personal', 'business');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
    CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending_verification');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
    CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'transfer', 'payment', 'airtime', 'data', 'electricity', 'cable', 'school_fees');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
    CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
  END IF;
END
$$;

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  
  -- Personal account fields
  first_name TEXT,
  last_name TEXT,
  
  -- Business account fields
  business_name TEXT,
  rc_number TEXT,
  nin TEXT,
  
  -- Common fields
  account_type account_type NOT NULL DEFAULT 'personal',
  display_name TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  status user_status DEFAULT 'pending_verification',
  
  -- KYC and Tier information
  tier INTEGER DEFAULT 1 CHECK (tier BETWEEN 1 AND 3),
  bvn TEXT,
  date_of_birth DATE,
  gender TEXT,
  country TEXT DEFAULT 'Nigeria',
  state TEXT,
  city TEXT,
  address TEXT,
  
  -- Security
  pin_hash TEXT,
  security_question TEXT,
  security_answer_hash TEXT,
  
  -- Referral
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create accounts/wallets table
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  account_number TEXT UNIQUE NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0.00 CHECK (balance >= 0),
  currency TEXT DEFAULT 'NGN',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  
  transaction_type transaction_type NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'NGN',
  status transaction_status DEFAULT 'pending',
  
  -- Transaction details
  reference TEXT UNIQUE NOT NULL,
  description TEXT,
  recipient_phone TEXT,
  recipient_name TEXT,
  
  -- Service-specific fields (for airtime, data, electricity, etc.)
  service_provider TEXT,
  service_data JSONB,
  
  -- External reference (from payment providers)
  external_reference TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create virtual_cards table
CREATE TABLE IF NOT EXISTS public.virtual_cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  card_number TEXT UNIQUE NOT NULL,
  card_name TEXT NOT NULL,
  expiry_month INTEGER NOT NULL CHECK (expiry_month BETWEEN 1 AND 12),
  expiry_year INTEGER NOT NULL,
  cvv TEXT NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0.00 CHECK (balance >= 0),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create kyc_documents table
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL, -- 'id_card', 'utility_bill', 'passport', etc.
  document_url TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create vault_files table (for document storage)
CREATE TABLE IF NOT EXISTS public.vault_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  category TEXT,
  is_encrypted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email') THEN
    CREATE INDEX idx_users_email ON public.users(email);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_phone') THEN
    CREATE INDEX idx_users_phone ON public.users(phone);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_account_type') THEN
    CREATE INDEX idx_users_account_type ON public.users(account_type);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_referral_code') THEN
    CREATE INDEX idx_users_referral_code ON public.users(referral_code);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_accounts_user_id') THEN
    CREATE INDEX idx_accounts_user_id ON public.accounts(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_accounts_account_number') THEN
    CREATE INDEX idx_accounts_account_number ON public.accounts(account_number);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_user_id') THEN
    CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_reference') THEN
    CREATE INDEX idx_transactions_reference ON public.transactions(reference);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_type') THEN
    CREATE INDEX idx_transactions_type ON public.transactions(transaction_type);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_status') THEN
    CREATE INDEX idx_transactions_status ON public.transactions(status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_created_at') THEN
    CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_virtual_cards_user_id') THEN
    CREATE INDEX idx_virtual_cards_user_id ON public.virtual_cards(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_kyc_documents_user_id') THEN
    CREATE INDEX idx_kyc_documents_user_id ON public.kyc_documents(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_vault_files_user_id') THEN
    CREATE INDEX idx_vault_files_user_id ON public.vault_files(user_id);
  END IF;
END
$$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
DO $$
BEGIN
  -- Drop existing triggers if they exist
  DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
  DROP TRIGGER IF EXISTS update_accounts_updated_at ON public.accounts;
  DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
  DROP TRIGGER IF EXISTS update_virtual_cards_updated_at ON public.virtual_cards;

  -- Create fresh triggers
  CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  CREATE TRIGGER update_virtual_cards_updated_at BEFORE UPDATE ON public.virtual_cards FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
END
$$;

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_files ENABLE ROW LEVEL SECURITY;

-- Users can only see/update their own data
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
  DROP POLICY IF EXISTS "Users can view own accounts" ON public.accounts;
  DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
  DROP POLICY IF EXISTS "Users can view own virtual cards" ON public.virtual_cards;
  DROP POLICY IF EXISTS "Users can view own KYC documents" ON public.kyc_documents;
  DROP POLICY IF EXISTS "Users can manage own vault files" ON public.vault_files;

  -- Create fresh policies
  CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
  CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

  CREATE POLICY "Users can view own accounts" ON public.accounts FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Users can view own virtual cards" ON public.virtual_cards FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Users can view own KYC documents" ON public.kyc_documents FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Users can manage own vault files" ON public.vault_files FOR ALL USING (auth.uid() = user_id);
END
$$;

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    display_name,
    account_type,
    first_name,
    last_name,
    business_name,
    rc_number,
    nin,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'account_type')::account_type, 'personal'),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'business_name',
    new.raw_user_meta_data->>'rc_number',
    new.raw_user_meta_data->>'nin',
    now(),
    now()
  );
  
  -- Create default account
  INSERT INTO public.accounts (user_id, account_number, created_at, updated_at)
  VALUES (new.id, '200' || substr(replace(new.id::text, '-', ''), 1, 7), now(), now());
  
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger to create user profile on signup
DO $$
BEGIN
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
END
$$;















































-- Safe migration script to update existing schema
-- Run this instead of the full schema to avoid conflicts

-- 1. Update the handle_new_user function with improvements
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  generated_referral_code TEXT;
  referrer_id UUID;
  new_account_number TEXT;
BEGIN
  -- Generate referral code
  generated_referral_code := UPPER(SUBSTRING(new.email FROM 1 FOR 4)) || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
  
  -- Find referrer if referral code is provided
  referrer_id := NULL;
  IF new.raw_user_meta_data->>'referral_code' IS NOT NULL AND new.raw_user_meta_data->>'referral_code' != '' THEN
    SELECT id INTO referrer_id 
    FROM public.users 
    WHERE referral_code = new.raw_user_meta_data->>'referral_code';
  END IF;
  
  -- Generate account number
  new_account_number := '200' || SUBSTR(REPLACE(new.id::text, '-', ''), 1, 7);
  
  -- Insert into users table with proper field mapping
  INSERT INTO public.users (
    id,
    email,
    phone,
    first_name,
    last_name,
    business_name,
    rc_number,
    nin,
    account_type,
    display_name,
    is_verified,
    phone_verified,
    email_verified,
    status,
    tier,
    referral_code,
    referred_by,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'business_name',
    new.raw_user_meta_data->>'rc_number',
    new.raw_user_meta_data->>'nin',
    COALESCE((new.raw_user_meta_data->>'account_type')::account_type, 'personal'),
    COALESCE(new.raw_user_meta_data->>'display_name', SPLIT_PART(new.email, '@', 1)),
    FALSE, -- is_verified
    COALESCE((new.raw_user_meta_data->>'phone_verified')::boolean, FALSE),
    new.email_confirmed_at IS NOT NULL, -- email_verified based on confirmation
    CASE 
      WHEN new.email_confirmed_at IS NOT NULL THEN 'active'::user_status
      ELSE 'pending_verification'::user_status
    END,
    COALESCE((new.raw_user_meta_data->>'tier')::integer, 1),
    generated_referral_code,
    referrer_id,
    NOW(),
    NOW()
  );
  
  -- Create default account/wallet
  INSERT INTO public.accounts (
    user_id, 
    account_number, 
    balance, 
    currency, 
    is_active,
    created_at, 
    updated_at
  )
  VALUES (
    new.id, 
    new_account_number, 
    0.00, 
    'NGN', 
    TRUE,
    NOW(), 
    NOW()
  );
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error (in a real implementation, you might want to use a proper logging system)
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    -- Re-raise the exception to prevent user creation if profile creation fails
    RAISE;
END;
$$ language plpgsql security definer;

-- 2. Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Add any missing indexes (only if they don't exist)
DO $$
BEGIN
  -- Check and create missing indexes from the new schema
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email') THEN
    CREATE INDEX idx_users_email ON public.users(email);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_phone') THEN
    CREATE INDEX idx_users_phone ON public.users(phone);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_account_type') THEN
    CREATE INDEX idx_users_account_type ON public.users(account_type);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_referral_code') THEN
    CREATE INDEX idx_users_referral_code ON public.users(referral_code);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_accounts_user_id') THEN
    CREATE INDEX idx_accounts_user_id ON public.accounts(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_accounts_account_number') THEN
    CREATE INDEX idx_accounts_account_number ON public.accounts(account_number);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_user_id') THEN
    CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_reference') THEN
    CREATE INDEX idx_transactions_reference ON public.transactions(reference);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_type') THEN
    CREATE INDEX idx_transactions_type ON public.transactions(transaction_type);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_status') THEN
    CREATE INDEX idx_transactions_status ON public.transactions(status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_created_at') THEN
    CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_virtual_cards_user_id') THEN
    CREATE INDEX idx_virtual_cards_user_id ON public.virtual_cards(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_kyc_documents_user_id') THEN
    CREATE INDEX idx_kyc_documents_user_id ON public.kyc_documents(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_vault_files_user_id') THEN
    CREATE INDEX idx_vault_files_user_id ON public.vault_files(user_id);
  END IF;
END
$$;

-- 4. Ensure updated_at triggers are properly set up
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers (safe to run multiple times)
DO $$
BEGIN
  -- Drop existing triggers if they exist
  DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
  DROP TRIGGER IF EXISTS update_accounts_updated_at ON public.accounts;
  DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
  DROP TRIGGER IF EXISTS update_virtual_cards_updated_at ON public.virtual_cards;

  -- Create fresh triggers
  CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  CREATE TRIGGER update_virtual_cards_updated_at BEFORE UPDATE ON public.virtual_cards FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
END
$$;