
# PocketBase Setup Instructions for eVault

## 1. Start PocketBase
Run the "Start PocketBase" workflow or execute:
```bash
./backend/start-pocketbase.sh
```

## 2. Access PocketBase Admin
1. Open your browser and go to: `http://localhost:8090/_/`
2. Create an admin account when prompted

## 3. Create the Users Collection

### Collection Name: `users`

### Fields Configuration:

#### Basic Fields:
- **id** (Text, Primary Key) - Auto-generated
- **created** (Date) - Auto-generated
- **updated** (Date) - Auto-generated

#### Authentication Fields:
- **email** (Email, Required, Unique)
- **password** (Password, Required, Min: 6 characters)
- **phone** (Text, Required, Unique, Pattern: `^\+\d{10,15}$`)

#### Account Type:
- **account_type** (Select, Required)
  - Options: `personal`, `business`
  - Default: `personal`

#### Personal Account Fields:
- **firstname** (Text, Optional, Min: 2 characters)
- **lastname** (Text, Optional, Min: 2 characters)

#### Business Account Fields:
- **business_name** (Text, Optional, Min: 2 characters)
- **rc_number** (Text, Optional, Min: 6 characters)
- **nin** (Text, Optional, Pattern: `^\d{11}$`)

#### Additional Fields:
- **name** (Text, Required) - Display name (firstname + lastname OR business_name)
- **verified** (Bool, Default: false)
- **referral_code** (Text, Optional)
- **tier** (Select, Default: `tier1`)
  - Options: `tier1`, `tier2`, `tier3`

### API Rules:

#### List/Search Rule:
```javascript
@request.auth.id != ""
```

#### View Rule:
```javascript
@request.auth.id != "" && (id = @request.auth.id || @request.auth.role = "admin")
```

#### Create Rule:
```javascript
// Allow public registration
@request.data.email != "" && @request.data.password != ""
```

#### Update Rule:
```javascript
@request.auth.id = id
```

#### Delete Rule:
```javascript
@request.auth.id = id || @request.auth.role = "admin"
```

## 4. Create OTP Verification Collection (Optional for production)

### Collection Name: `otp_verifications`

#### Fields:
- **phone** (Text, Required, Unique)
- **otp_code** (Text, Required, Length: 6)
- **expires_at** (Date, Required)
- **verified** (Bool, Default: false)
- **attempts** (Number, Default: 0, Max: 5)

### API Rules:
- **List/Search**: `@request.auth.id != ""`
- **View**: `@request.auth.id != ""`
- **Create**: `phone != ""`
- **Update**: `@request.auth.id != ""`
- **Delete**: `@request.auth.id != ""`

## 5. Validation Rules

### Email Validation:
```javascript
@request.data.email ~ "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
```

### Phone Validation:
```javascript
@request.data.phone ~ "^\+[1-9]\d{1,14}$"
```

### Business Account Validation:
```javascript
// For business accounts, require business-specific fields
(@request.data.account_type != "business") || 
(@request.data.business_name != "" && @request.data.rc_number != "" && @request.data.nin != "")
```

### Personal Account Validation:
```javascript
// For personal accounts, require name fields
(@request.data.account_type != "personal") || 
(@request.data.firstname != "" && @request.data.lastname != "")
```

## 6. Indexes for Performance

Create indexes for frequently queried fields:
- `email` (unique)
- `phone` (unique)
- `account_type`
- `verified`

## 7. Backup Configuration

Set up automatic backups in the PocketBase admin panel:
1. Go to Settings > Backups
2. Enable automatic backups
3. Set backup frequency (daily recommended)

## 8. Environment Variables

Add to your `.env` file:
```
POCKETBASE_URL=http://localhost:8090
POCKETBASE_ADMIN_EMAIL=admin@evault.com
POCKETBASE_ADMIN_PASSWORD=your_secure_password
```

## 9. Testing the Setup

Use the PocketBase admin interface to:
1. Create test users for both account types
2. Verify email uniqueness constraints
3. Test authentication workflows
4. Verify field validations work correctly

## 10. Production Considerations

- Change default admin credentials
- Set up SSL/TLS certificates
- Configure proper CORS settings
- Set up monitoring and logging
- Implement rate limiting for sensitive endpoints
