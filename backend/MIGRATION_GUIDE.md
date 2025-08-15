
# Migration Guide: PocketBase to Supabase

This guide will help you migrate your eVault application from PocketBase to Supabase.

## 1. Supabase Setup

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new account or sign in
3. Create a new project
4. Wait for setup to complete (2-3 minutes)

### Step 2: Get Your Credentials
1. Go to Project Settings > API
2. Copy the following:
   - Project URL
   - Anon (public) key
   - Service role (secret) key

### Step 3: Set Up Environment Variables
1. Create `backend/.env` from `backend/.env.example`
2. Add your Supabase credentials:
```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=5000
NODE_ENV=development
```

3. Create `.env` in your root directory from `.env.example`:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BACKEND_URL=http://localhost:5000
```

## 2. Database Setup

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Run Database Schema
1. Copy the contents of `backend/supabase/schema.sql`
2. Go to your Supabase dashboard > SQL Editor
3. Paste and run the schema

OR use the setup script:
```bash
cd backend
npm run setup
```

## 3. Start the Services

### Step 1: Start Backend Server
```bash
cd backend
npm run dev
```
Server will run on http://localhost:5000

### Step 2: Start Frontend
```bash
npm run dev
```
Frontend will run on http://localhost:5173

## 4. Key Differences from PocketBase

### Authentication
- Supabase has built-in auth with email verification
- User profiles are stored in a separate `users` table
- Row Level Security (RLS) is used instead of collection rules

### Data Structure
- Personal accounts: `first_name`, `last_name` fields
- Business accounts: `business_name`, `rc_number`, `nin` fields
- Account type stored as enum: `'personal'` or `'business'`
- User tier system (1, 2, 3) for KYC levels

### API Endpoints
- RESTful endpoints instead of SDK methods
- Authentication handled via JWT tokens
- Automatic account creation with user signup

## 5. Testing the Migration

### Test Authentication
1. Try signing up a new user
2. Check user appears in Supabase dashboard
3. Try signing in with the new user
4. Verify user profile data

### Test Account Types
1. Create personal account - check first_name, last_name stored
2. Create business account - check business_name, rc_number stored
3. Verify account_type field is set correctly

## 6. Data Migration (if you have existing users)

If you have existing PocketBase users, you can migrate them:

1. Export users from PocketBase
2. Transform the data to match new schema
3. Import via Supabase dashboard or API

Contact support if you need help with data migration.

## 7. Production Deployment

1. Set up Supabase production project
2. Update environment variables
3. Deploy backend to Replit
4. Update frontend environment variables
5. Test thoroughly

## 8. Rollback Plan

If you need to rollback:
1. Keep your PocketBase files
2. Switch environment variables back
3. Restart services

Your original PocketBase setup remains untouched in this migration.

## Support

If you encounter issues:
1. Check the console logs
2. Verify environment variables
3. Check Supabase dashboard for errors
4. Test API endpoints directly

Happy migrating! 🚀
