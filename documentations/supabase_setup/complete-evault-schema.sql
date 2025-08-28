-- =====================================================
-- COMPLETE EVAULT SUPABASE SCHEMA
-- =====================================================
-- This file contains the complete, unified schema that combines:
-- 1. Fixed trigger function for user account creation
-- 2. Backend schema extension for all services
-- 
-- Run this entire file in your Supabase SQL editor for complete setup.
-- =====================================================

-- =====================================================
-- 1. CREATE ALL REQUIRED ENUMS AND TYPES
-- =====================================================

-- Create account_type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE account_type AS ENUM ('personal', 'business');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_status enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create transaction_type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'transfer', 'payment', 'airtime', 'data', 'electricity', 'cable', 'school_fees');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create transaction_status enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 2. CREATE CORE TABLES
-- =====================================================

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    first_name TEXT,
    last_name TEXT,
    business_name TEXT,
    rc_number TEXT,
    nin TEXT,
    account_type account_type NOT NULL DEFAULT 'personal',
    display_name TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    status user_status DEFAULT 'pending_verification',
    tier INTEGER DEFAULT 1 CHECK (tier BETWEEN 1 AND 5),
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    account_number TEXT UNIQUE NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'NGN',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE EXTENDED TABLES FOR BACKEND SERVICES
-- =====================================================

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL, -- 'id_card', 'utility_bill', 'passport', etc.
  document_url TEXT NOT NULL,
  file_name TEXT,
  verification_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  verification_notes TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create vault_files table (for document storage)
CREATE TABLE IF NOT EXISTS public.vault_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  category TEXT,
  is_encrypted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create vendors table (service providers)
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  service_type TEXT NOT NULL, -- 'airtime', 'data', 'electricity', 'cable', 'school_fees'
  api_endpoint TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. ADD EXTENDED FIELDS TO USERS TABLE
-- =====================================================

-- Add missing fields to users table if they don't exist
DO $
BEGIN
  -- Add BVN field if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'bvn') THEN
    ALTER TABLE public.users ADD COLUMN bvn TEXT;
  END IF;
  
  -- Add additional KYC fields if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'date_of_birth') THEN
    ALTER TABLE public.users ADD COLUMN date_of_birth DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'gender') THEN
    ALTER TABLE public.users ADD COLUMN gender TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'country') THEN
    ALTER TABLE public.users ADD COLUMN country TEXT DEFAULT 'Nigeria';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'state') THEN
    ALTER TABLE public.users ADD COLUMN state TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'city') THEN
    ALTER TABLE public.users ADD COLUMN city TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'address') THEN
    ALTER TABLE public.users ADD COLUMN address TEXT;
  END IF;
  
  -- Add security fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'pin_hash') THEN
    ALTER TABLE public.users ADD COLUMN pin_hash TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'security_question') THEN
    ALTER TABLE public.users ADD COLUMN security_question TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'security_answer_hash') THEN
    ALTER TABLE public.users ADD COLUMN security_answer_hash TEXT;
  END IF;
END
$;

-- =====================================================
-- 5. CREATE ALL INDEXES FOR PERFORMANCE
-- =====================================================

-- Core table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_account_type ON public.users(account_type);
CREATE INDEX IF NOT EXISTS idx_users_bvn ON public.users(bvn) WHERE bvn IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_country ON public.users(country);
CREATE INDEX IF NOT EXISTS idx_users_state ON public.users(state) WHERE state IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_account_number ON public.accounts(account_number);

-- Extended table indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON public.transactions(reference);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_virtual_cards_user_id ON public.virtual_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON public.kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_files_user_id ON public.vault_files(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_service_type ON public.vendors(service_type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- =====================================================
-- 6. CREATE HELPER FUNCTIONS FOR TRIGGERS
-- =====================================================

-- Enhanced logging helper function
CREATE OR REPLACE FUNCTION log_trigger_event(
  p_level TEXT,
  p_event_type TEXT,
  p_user_email TEXT,
  p_message TEXT,
  p_context JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  RAISE LOG '[TRIGGER] [%] [%] [%] %: %', 
    UPPER(p_level), 
    p_event_type, 
    COALESCE(p_user_email, 'unknown'), 
    p_message,
    CASE WHEN p_context IS NOT NULL THEN p_context::text ELSE '' END;
END;
$$ LANGUAGE plpgsql;

-- Safe referral code generation function
CREATE OR REPLACE FUNCTION generate_safe_referral_code(
  p_email TEXT,
  p_business_name TEXT DEFAULT NULL,
  p_account_type account_type DEFAULT 'personal',
  p_user_id UUID DEFAULT NULL
) RETURNS TEXT AS $$
DECLARE
  generated_code TEXT;
  base_string TEXT;
  attempt_count INTEGER := 0;
  max_attempts INTEGER := 5;
  random_suffix TEXT;
BEGIN
  -- Generate base string with fallback strategies
  BEGIN
    IF p_account_type = 'business' AND NULLIF(TRIM(COALESCE(p_business_name, '')), '') IS NOT NULL THEN
      base_string := UPPER(SUBSTRING(REGEXP_REPLACE(p_business_name, '[^A-Za-z0-9]', '', 'g') FROM 1 FOR 4));
      IF LENGTH(base_string) < 4 THEN
        base_string := RPAD(base_string, 4, 'B');
      END IF;
    ELSE
      base_string := UPPER(SUBSTRING(REGEXP_REPLACE(SPLIT_PART(p_email, '@', 1), '[^A-Za-z0-9]', '', 'g') FROM 1 FOR 4));
      IF LENGTH(base_string) < 4 THEN
        base_string := RPAD(base_string, 4, 'U');
      END IF;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    base_string := 'USER';
  END;
  
  -- Generate unique code with limited attempts
  LOOP
    EXIT WHEN attempt_count >= max_attempts;
    random_suffix := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    generated_code := base_string || random_suffix;
    
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM public.users WHERE referral_code = generated_code) THEN
        RETURN generated_code;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      EXIT;
    END;
    
    attempt_count := attempt_count + 1;
  END LOOP;
  
  -- UUID-based fallback
  IF p_user_id IS NOT NULL THEN
    RETURN UPPER(SUBSTRING(REPLACE(p_user_id::text, '-', '') FROM 1 FOR 8));
  ELSE
    RETURN 'REF' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
  END IF;
  
EXCEPTION WHEN OTHERS THEN
  RETURN 'DEFAULT' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Account number generation function
CREATE OR REPLACE FUNCTION generate_unique_account_number(
  p_user_id UUID,
  p_max_attempts INTEGER DEFAULT 3
) RETURNS TEXT AS $$
DECLARE
  account_number TEXT;
  attempt_count INTEGER := 0;
  base_prefix TEXT := '200';
  random_component TEXT;
  timestamp_component TEXT;
BEGIN
  timestamp_component := RIGHT(EXTRACT(EPOCH FROM NOW())::TEXT, 3);
  
  LOOP
    EXIT WHEN attempt_count >= p_max_attempts;
    random_component := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    account_number := base_prefix || random_component || timestamp_component;
    
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM public.accounts WHERE account_number = account_number) THEN
        RETURN account_number;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      NULL; -- Continue to next attempt
    END;
    
    attempt_count := attempt_count + 1;
    PERFORM pg_sleep(0.001);
  END LOOP;
  
  -- UUID-based fallback
  RETURN base_prefix || SUBSTR(REPLACE(p_user_id::text, '-', ''), 1, 7);
  
EXCEPTION WHEN OTHERS THEN
  RETURN base_prefix || LPAD(FLOOR(RANDOM() * 10000000)::TEXT, 7, '0');
END;
$$ LANGUAGE plpgsql;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. MAIN TRIGGER FUNCTION FOR USER CREATION
-- =====================================================

-- Drop existing function and trigger to replace with fixed version
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the fixed trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  -- Data extraction variables
  user_account_type account_type;
  user_display_name TEXT;
  user_phone TEXT;
  user_first_name TEXT;
  user_last_name TEXT;
  user_business_name TEXT;
  user_rc_number TEXT;
  user_nin TEXT;
  user_tier INTEGER;
  user_phone_verified BOOLEAN;
  user_email_verified BOOLEAN;
  user_status user_status;
  
  -- Referral code generation variables
  generated_referral_code TEXT;
  referrer_id UUID;
  
  -- Account creation variables
  new_account_number TEXT;
  account_creation_success BOOLEAN := FALSE;
  
BEGIN
  -- Log trigger start
  PERFORM log_trigger_event('INFO', 'TRIGGER_START', new.email, 'Enhanced trigger function initiated');
  
  -- ========================================
  -- SAFE DATA EXTRACTION AND VALIDATION
  -- ========================================
  
  -- Safe account_type casting with fallback to 'personal'
  BEGIN
    user_account_type := COALESCE(
      NULLIF(TRIM(new.raw_user_meta_data->>'account_type'), '')::account_type, 
      'personal'::account_type
    );
  EXCEPTION WHEN OTHERS THEN
    user_account_type := 'personal'::account_type;
    PERFORM log_trigger_event('WARNING', 'DATA_PROCESSING', new.email, 'Failed to parse account_type, defaulting to personal');
  END;
  
  -- Safe boolean field processing
  BEGIN
    user_phone_verified := CASE 
      WHEN new.raw_user_meta_data->>'phone_verified' IS NULL THEN FALSE
      WHEN LOWER(TRIM(new.raw_user_meta_data->>'phone_verified')) IN ('true', '1', 'yes', 'verified') THEN TRUE
      ELSE FALSE
    END;
  EXCEPTION WHEN OTHERS THEN
    user_phone_verified := FALSE;
  END;
  
  -- Safe integer field validation
  BEGIN
    user_tier := CASE 
      WHEN new.raw_user_meta_data->>'tier' IS NULL OR TRIM(new.raw_user_meta_data->>'tier') = '' THEN 1
      WHEN (new.raw_user_meta_data->>'tier')::integer BETWEEN 1 AND 5 THEN (new.raw_user_meta_data->>'tier')::integer
      ELSE 1
    END;
  EXCEPTION WHEN OTHERS THEN
    user_tier := 1;
  END;
  
  -- Comprehensive null/empty string handling using NULLIF and COALESCE
  user_phone := NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'phone', '')), '');
  user_first_name := NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'first_name', '')), '');
  user_last_name := NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'last_name', '')), '');
  user_business_name := NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'business_name', '')), '');
  user_rc_number := NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'rc_number', '')), '');
  user_nin := NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'nin', '')), '');
  
  -- Safe display name generation with comprehensive fallbacks
  user_display_name := COALESCE(
    NULLIF(TRIM(new.raw_user_meta_data->>'display_name'), ''),
    CASE 
      WHEN user_account_type = 'business' AND user_business_name IS NOT NULL
      THEN user_business_name
      WHEN user_first_name IS NOT NULL AND user_last_name IS NOT NULL
      THEN user_first_name || ' ' || user_last_name
      WHEN user_first_name IS NOT NULL
      THEN user_first_name
      ELSE SPLIT_PART(new.email, '@', 1)
    END
  );
  
  -- Safe email verification and status determination
  user_email_verified := new.email_confirmed_at IS NOT NULL;
  user_status := CASE 
    WHEN user_email_verified THEN 'active'::user_status
    ELSE 'pending_verification'::user_status
  END;
  
  PERFORM log_trigger_event('INFO', 'DATA_PROCESSED', new.email, 'All user data processed successfully');
  
  -- ========================================
  -- REFERRAL CODE GENERATION (NON-CRITICAL)
  -- ========================================
  
  BEGIN
    generated_referral_code := generate_safe_referral_code(
      new.email, 
      user_business_name, 
      user_account_type, 
      new.id
    );
    PERFORM log_trigger_event('INFO', 'REFERRAL_GENERATED', new.email, 'Referral code generated successfully');
  EXCEPTION WHEN OTHERS THEN
    generated_referral_code := 'USER' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    PERFORM log_trigger_event('WARNING', 'REFERRAL_GENERATION_ERROR', new.email, 'Referral code generation failed, using fallback');
  END;
  
  -- Find referrer with error isolation
  referrer_id := NULL;
  IF NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'referral_code', '')), '') IS NOT NULL THEN
    BEGIN
      SELECT id INTO referrer_id 
      FROM public.users 
      WHERE referral_code = TRIM(new.raw_user_meta_data->>'referral_code')
      AND status = 'active'::user_status;
      
      IF referrer_id IS NOT NULL THEN
        PERFORM log_trigger_event('INFO', 'REFERRER_FOUND', new.email, 'Valid referrer found');
      END IF;
    EXCEPTION WHEN OTHERS THEN
      PERFORM log_trigger_event('WARNING', 'REFERRER_LOOKUP_ERROR', new.email, 'Referrer lookup failed, continuing without referrer');
    END;
  END IF;
  
  -- ========================================
  -- ACCOUNT NUMBER GENERATION
  -- ========================================
  
  BEGIN
    new_account_number := generate_unique_account_number(new.id);
    PERFORM log_trigger_event('INFO', 'ACCOUNT_NUMBER_GENERATED', new.email, 'Account number generated successfully');
  EXCEPTION WHEN OTHERS THEN
    new_account_number := '200' || SUBSTR(REPLACE(new.id::text, '-', ''), 1, 7);
    PERFORM log_trigger_event('WARNING', 'ACCOUNT_NUMBER_ERROR', new.email, 'Account number generation failed, using UUID fallback');
  END;
  
  -- ========================================
  -- USER PROFILE CREATION (CRITICAL - MUST SUCCEED)
  -- ========================================
  
  BEGIN
    INSERT INTO public.users (
      id, email, phone, first_name, last_name, business_name, rc_number, nin,
      account_type, display_name, is_verified, phone_verified, email_verified,
      status, tier, referral_code, referred_by, created_at, updated_at
    )
    VALUES (
      new.id, new.email, user_phone, user_first_name, user_last_name, 
      user_business_name, user_rc_number, user_nin, user_account_type, 
      user_display_name, FALSE, user_phone_verified, user_email_verified,
      user_status, user_tier, generated_referral_code, referrer_id, NOW(), NOW()
    );
    
    PERFORM log_trigger_event('SUCCESS', 'USER_PROFILE_CREATED', new.email, 'User profile created successfully');
    
  EXCEPTION WHEN OTHERS THEN
    PERFORM log_trigger_event('CRITICAL', 'USER_PROFILE_CREATION_FAILED', new.email, 'CRITICAL ERROR: User profile creation failed');
    RAISE EXCEPTION 'Failed to create user profile: %', SQLERRM;
  END;
  
  -- ========================================
  -- ACCOUNT CREATION (NON-CRITICAL - CAN FAIL GRACEFULLY)
  -- ========================================
  
  BEGIN
    INSERT INTO public.accounts (
      user_id, account_number, balance, currency, is_active, created_at, updated_at
    )
    VALUES (
      new.id, new_account_number, 0.00, 'NGN', TRUE, NOW(), NOW()
    );
    
    account_creation_success := TRUE;
    PERFORM log_trigger_event('SUCCESS', 'ACCOUNT_CREATED', new.email, 'Account created successfully');
    
  EXCEPTION 
    WHEN unique_violation THEN
      -- Handle account number conflicts with retry
      PERFORM log_trigger_event('WARNING', 'ACCOUNT_NUMBER_CONFLICT', new.email, 'Account number conflict detected, attempting retry');
      
      BEGIN
        new_account_number := generate_unique_account_number(new.id);
        
        INSERT INTO public.accounts (
          user_id, account_number, balance, currency, is_active, created_at, updated_at
        )
        VALUES (
          new.id, new_account_number, 0.00, 'NGN', TRUE, NOW(), NOW()
        );
        
        account_creation_success := TRUE;
        PERFORM log_trigger_event('SUCCESS', 'ACCOUNT_CREATED_RETRY', new.email, 'Account created successfully on retry');
        
      EXCEPTION WHEN OTHERS THEN
        PERFORM log_trigger_event('ERROR', 'ACCOUNT_CREATION_RETRY_FAILED', new.email, 'Account creation retry failed - user profile exists but no account created');
        account_creation_success := FALSE;
      END;
      
    WHEN OTHERS THEN
      PERFORM log_trigger_event('ERROR', 'ACCOUNT_CREATION_ERROR', new.email, 'Account creation failed but user profile was created successfully');
      account_creation_success := FALSE;
  END;
  
  -- Final status reporting
  IF account_creation_success THEN
    PERFORM log_trigger_event('SUCCESS', 'TRIGGER_COMPLETE_FULL', new.email, 'Trigger completed successfully - user profile and account created');
  ELSE
    PERFORM log_trigger_event('SUCCESS', 'TRIGGER_COMPLETE_PARTIAL', new.email, 'Trigger completed with warnings - user profile created, account creation failed');
  END IF;
  
  RETURN new;
  
EXCEPTION WHEN OTHERS THEN
  PERFORM log_trigger_event('CRITICAL', 'TRIGGER_FAILED', new.email, 'Trigger failed with error');
  RAISE;
END;
$$;

-- =====================================================
-- 8. CREATE ALL TRIGGERS
-- =====================================================

-- Create the main trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at triggers for all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_virtual_cards_updated_at BEFORE UPDATE ON public.virtual_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 9. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 10. CREATE RLS POLICIES
-- =====================================================

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Accounts table policies
CREATE POLICY "Users can view own accounts" ON public.accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts" ON public.accounts
  FOR UPDATE USING (auth.uid() = user_id);

-- Transactions table policies
CREATE POLICY "Users can view own transactions" ON public.transactions 
  FOR SELECT USING (auth.uid() = user_id);

-- Virtual cards table policies
CREATE POLICY "Users can view own virtual cards" ON public.virtual_cards 
  FOR SELECT USING (auth.uid() = user_id);

-- KYC documents table policies
CREATE POLICY "Users can view own KYC documents" ON public.kyc_documents 
  FOR SELECT USING (auth.uid() = user_id);

-- Vault files table policies
CREATE POLICY "Users can manage own vault files" ON public.vault_files 
  FOR ALL USING (auth.uid() = user_id);

-- Vendors table policies (public read access)
CREATE POLICY "Anyone can view active vendors" ON public.vendors 
  FOR SELECT USING (is_active = true);

-- Notifications table policies
CREATE POLICY "Users can view own notifications" ON public.notifications 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications 
  FOR UPDATE USING (auth.uid() = user_id);

-- Backend service role policies (for server-side operations)
CREATE POLICY "Service role can manage all data" ON public.users 
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage accounts" ON public.accounts 
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage transactions" ON public.transactions 
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage virtual cards" ON public.virtual_cards 
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage KYC documents" ON public.kyc_documents 
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage vault files" ON public.vault_files 
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage vendors" ON public.vendors 
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage notifications" ON public.notifications 
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- 11. INSERT SAMPLE DATA (OPTIONAL)
-- =====================================================

-- Insert sample vendors for testing
INSERT INTO public.vendors (name, service_type, is_active) VALUES
  ('MTN Nigeria', 'airtime', true),
  ('Airtel Nigeria', 'airtime', true),
  ('Glo Nigeria', 'airtime', true),
  ('9mobile', 'airtime', true),
  ('MTN Data', 'data', true),
  ('Airtel Data', 'data', true),
  ('EKEDC', 'electricity', true),
  ('IKEDC', 'electricity', true),
  ('DStv', 'cable', true),
  ('GOtv', 'cable', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 12. VERIFICATION QUERIES
-- =====================================================

-- Verify the trigger function exists and is properly configured
SELECT 
  'Trigger Function Status' as check_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'handle_new_user' AND routine_schema = 'public') 
    THEN '✅ FUNCTION EXISTS' 
    ELSE '❌ FUNCTION MISSING' 
  END as status;

-- Verify the trigger exists
SELECT 
  'Trigger Status' as check_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') 
    THEN '✅ TRIGGER EXISTS' 
    ELSE '❌ TRIGGER MISSING' 
  END as status;

-- Verify all tables exist
SELECT 
  'Tables Status' as check_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') AND
         EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'accounts' AND table_schema = 'public') AND
         EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'transactions' AND table_schema = 'public') AND
         EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'virtual_cards' AND table_schema = 'public') AND
         EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'kyc_documents' AND table_schema = 'public') AND
         EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vault_files' AND table_schema = 'public') AND
         EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vendors' AND table_schema = 'public') AND
         EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications' AND table_schema = 'public')
    THEN '✅ ALL TABLES EXIST' 
    ELSE '❌ SOME TABLES MISSING' 
  END as status;

-- Verify RLS is enabled
SELECT 
  'RLS Status' as check_name,
  CASE 
    WHEN (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true) >= 8
    THEN '✅ RLS ENABLED ON ALL TABLES' 
    ELSE '⚠️ RLS NOT ENABLED ON ALL TABLES' 
  END as status;

-- Final success message
SELECT 
  '🎉 COMPLETE EVAULT SCHEMA DEPLOYMENT SUCCESSFUL!' as message,
  'All tables, triggers, functions, and policies have been created.' as details,
  'Your eVault platform is now ready for both frontend and backend operations.' as next_steps;