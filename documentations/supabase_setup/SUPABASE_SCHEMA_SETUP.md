# eVault Supabase Schema Setup Guide

## 📋 Overview

This guide covers the complete setup of the eVault Supabase database schema using the unified `complete-evault-schema.sql` file. This schema provides a production-ready foundation for the eVault financial platform, supporting both frontend authentication flows and backend services.

## 🎯 What This Schema Provides

### Core Features
- ✅ **User Authentication & Profiles** - Complete user management with Supabase Auth integration
- ✅ **Account Management** - Bank account creation with unique account numbers
- ✅ **Transaction Processing** - Full transaction lifecycle management
- ✅ **KYC & Verification** - Document upload and verification system
- ✅ **Virtual Cards** - Digital card management
- ✅ **Secure File Storage** - Encrypted document vault
- ✅ **Vendor Management** - Service provider integration
- ✅ **Notifications** - User notification system

### Technical Features
- ✅ **Automatic Triggers** - User profile creation on signup
- ✅ **Row Level Security** - Data isolation and protection
- ✅ **Performance Indexes** - Optimized database queries
- ✅ **Data Validation** - Comprehensive constraints and checks
- ✅ **Audit Logging** - Detailed trigger event logging

## 🚀 Quick Setup

### Prerequisites
1. Active Supabase project
2. Access to Supabase Dashboard
3. SQL Editor permissions

### Installation Steps

1. **Navigate to Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/[your-project-id]
   ```

2. **Open SQL Editor**
   - Go to "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Execute Schema**
   - Copy the entire contents of `complete-evault-schema.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

4. **Verify Installation**
   - The schema includes built-in verification queries
   - Check the results for ✅ success indicators

## 📊 Database Schema Structure

### Core Tables

#### 1. Users Table (`public.users`)
**Purpose**: User profiles and authentication data
```sql
Key Fields:
- id (UUID) - References auth.users(id)
- email, phone, first_name, last_name
- business_name, rc_number, nin
- account_type ('personal', 'business')
- tier (1-5), status, verification flags
- referral_code, referred_by
```

#### 2. Accounts Table (`public.accounts`)
**Purpose**: User bank accounts and balances
```sql
Key Fields:
- id (UUID), user_id (FK)
- account_number (unique)
- balance (DECIMAL), currency
- is_active (BOOLEAN)
```

### Extended Tables

#### 3. Transactions Table (`public.transactions`)
**Purpose**: All financial transactions
```sql
Key Fields:
- transaction_type (airtime, data, electricity, etc.)
- amount, currency, status
- reference (unique), external_reference
- service_provider, service_data (JSONB)
```

#### 4. Virtual Cards Table (`public.virtual_cards`)
**Purpose**: Digital payment cards
```sql
Key Fields:
- card_number, card_name, cvv
- expiry_month, expiry_year
- balance, is_active
```

#### 5. KYC Documents Table (`public.kyc_documents`)
**Purpose**: Identity verification documents
```sql
Key Fields:
- document_type, document_url
- verification_status, verification_notes
- verified_at, uploaded_at
```

#### 6. Vault Files Table (`public.vault_files`)
**Purpose**: Secure document storage
```sql
Key Fields:
- file_name, file_url, file_type
- file_size, category
- is_encrypted (BOOLEAN)
```

#### 7. Vendors Table (`public.vendors`)
**Purpose**: Service providers
```sql
Key Fields:
- name, service_type
- api_endpoint, is_active
```

#### 8. Notifications Table (`public.notifications`)
**Purpose**: User notifications
```sql
Key Fields:
- title, message, type
- read_at, created_at
```

## 🔧 Custom Types & Enums

### Account Types
```sql
account_type: 'personal' | 'business'
```

### User Status
```sql
user_status: 'active' | 'inactive' | 'suspended' | 'pending_verification'
```

### Transaction Types
```sql
transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 
                 'airtime' | 'data' | 'electricity' | 'cable' | 'school_fees'
```

### Transaction Status
```sql
transaction_status: 'pending' | 'completed' | 'failed' | 'cancelled'
```

## ⚡ Trigger Functions

### 1. User Creation Trigger (`handle_new_user()`)
**Purpose**: Automatically creates user profile when auth user is created

**Features**:
- ✅ Safe data extraction from `raw_user_meta_data`
- ✅ Automatic referral code generation
- ✅ Account number creation
- ✅ Comprehensive error handling
- ✅ Detailed logging

**Triggered On**: `INSERT` on `auth.users`

### 2. Updated At Triggers
**Purpose**: Automatically updates `updated_at` timestamp on record changes

**Applied To**: All tables with `updated_at` fields

## 🔒 Row Level Security (RLS)

### User Data Isolation
```sql
-- Users can only access their own data
auth.uid() = user_id
```

### Service Role Access
```sql
-- Backend services have full access
auth.jwt() ->> 'role' = 'service_role'
```

### Public Access
```sql
-- Vendors are publicly readable when active
is_active = true
```

## 📈 Performance Optimizations

### Indexes Created
- **Email lookups**: `idx_users_email`
- **Referral codes**: `idx_users_referral_code`
- **Account numbers**: `idx_accounts_account_number`
- **Transaction queries**: `idx_transactions_user_id`, `idx_transactions_reference`
- **Service lookups**: `idx_vendors_service_type`

### Query Optimization
- Partial indexes on nullable fields
- Composite indexes for common query patterns
- Unique constraints for data integrity

## 🧪 Testing & Verification

### Built-in Verification
The schema includes verification queries that check:
- ✅ Trigger function existence
- ✅ Trigger activation
- ✅ Table creation
- ✅ RLS enablement

### Sample Data
Pre-populated vendor data for immediate testing:
- Nigerian telecom providers (MTN, Airtel, Glo, 9mobile)
- Utility services (EKEDC, IKEDC, DStv, GOtv)

## 🔗 Frontend Integration

### SignUp Flow Support
The trigger function handles metadata from your React signup form:
```javascript
// Your frontend sends this data
{
  account_type: 'personal' | 'business',
  first_name: string,
  last_name: string,
  business_name?: string,
  phone?: string,
  referral_code?: string
}
```

### API Compatibility
All tables support your existing API service methods:
- `getUserProfile()`
- `createTransaction()`
- `uploadKYCDocument()`
- `getUserTransactions()`

## 🛠️ Backend Service Integration

### Transaction Service
```javascript
// Supported by transactions table
transactionService.createTransaction()
transactionService.processUtilityPayment()
transactionService.updateAccountBalance()
```

### KYC Service
```javascript
// Supported by kyc_documents table
kycService.uploadDocument()
kycService.verifyDocument()
kycService.updateBVN()
```

### Auth Middleware
```javascript
// Supported by users table fields
authMiddleware.requireAccountType()
authMiddleware.requireTier()
authMiddleware.requireVerification()
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Trigger Not Firing
**Symptoms**: User profile not created on signup
**Solution**: 
```sql
-- Check trigger exists
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Recreate if missing
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### 2. RLS Blocking Queries
**Symptoms**: "Row level security policy violation" errors
**Solution**:
```sql
-- Check policies exist
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Verify service role access
SELECT auth.jwt() ->> 'role';
```

#### 3. Enum Type Conflicts
**Symptoms**: "type already exists" errors
**Solution**: The schema handles this automatically with `DO $$ BEGIN...EXCEPTION` blocks

### Debug Logging
Monitor trigger execution:
```sql
-- View trigger logs (if logging enabled)
SELECT * FROM pg_stat_statements 
WHERE query LIKE '%handle_new_user%';
```

## 📝 Maintenance

### Regular Tasks
1. **Monitor Performance**: Check slow queries and index usage
2. **Update Vendors**: Keep service provider list current
3. **Archive Data**: Implement data retention policies
4. **Security Audit**: Review RLS policies regularly

### Schema Updates
When adding new features:
1. Use `ALTER TABLE IF EXISTS`
2. Add appropriate indexes
3. Update RLS policies
4. Test with sample data

## 🔄 Migration from Existing Schema

If you have existing data:

1. **Backup Current Data**
   ```sql
   -- Export existing tables
   pg_dump --data-only your_database > backup.sql
   ```

2. **Run New Schema**
   - Execute `complete-evault-schema.sql`

3. **Migrate Data**
   ```sql
   -- Map old fields to new structure
   INSERT INTO public.users (id, email, ...)
   SELECT id, email, ... FROM old_users_table;
   ```

## 📞 Support

### Getting Help
- Check verification queries output
- Review Supabase logs in Dashboard
- Examine trigger function logs
- Test with minimal data first

### Common Patterns
```sql
-- Check user profile exists
SELECT * FROM public.users WHERE id = auth.uid();

-- Get user transactions
SELECT * FROM public.transactions WHERE user_id = auth.uid();

-- Verify account balance
SELECT balance FROM public.accounts WHERE user_id = auth.uid();
```

---

## 🎉 Success!

After running this schema, your eVault platform will have:
- ✅ Complete user authentication flow
- ✅ Automatic profile creation
- ✅ Secure data access
- ✅ Full transaction support
- ✅ KYC and verification system
- ✅ Production-ready performance

Your frontend signup should now work seamlessly, and your backend services will have all required database support.

**Next Steps**: Test the signup flow and verify all features work as expected!