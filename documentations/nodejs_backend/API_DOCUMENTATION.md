# eVault Backend API Documentation

## Overview

The eVault Backend API provides comprehensive fintech services including authentication, KYC management, transaction processing, and account management. Built with Express.js and Supabase integration.

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://your-domain.com`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The JWT token is obtained from Supabase authentication and contains user information.

## Response Format

All API responses follow this standard format:

```json
{
  "success": boolean,
  "data": object | array,
  "error": string,
  "message": string,
  "code": string
}
```

## Error Codes

- `AUTH_REQUIRED` - Authentication required
- `INVALID_TOKEN` - Invalid or expired token
- `INSUFFICIENT_TIER` - User tier insufficient for operation
- `INSUFFICIENT_BALANCE` - Account balance insufficient
- `DAILY_LIMIT_EXCEEDED` - Daily transaction limit exceeded
- `VALIDATION_ERROR` - Request validation failed

---

## Health Check

### GET /api/health

Check server status and available services.

**Response:**
```json
{
  "status": "OK",
  "message": "eVault Backend Server Running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "2.0.0",
  "environment": "development",
  "services": {
    "authentication": "active",
    "kyc": "active",
    "transactions": "active",
    "accounts": "active"
  }
}
```

---

## Authentication Endpoints

### POST /api/auth/signup

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "account_type": "personal",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+2341234567890",
  "referral_code": "REF123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "personal",
    "tier": 1
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token"
  },
  "message": "Account created successfully"
}
```

### POST /api/auth/login

Authenticate user and get session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "personal",
    "tier": 1
  },
  "token": "jwt-token",
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token"
  }
}
```

---

## KYC Endpoints

### GET /api/kyc/status

Get user's KYC status and tier information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "kyc": {
    "currentTier": 1,
    "eligibleTier": 2,
    "isVerified": false,
    "completionPercentage": 60,
    "checks": {
      "email_verified": true,
      "phone_verified": true,
      "bvn_provided": false,
      "id_document": false,
      "utility_bill": false
    },
    "nextSteps": [
      "Provide BVN",
      "Upload valid ID document"
    ],
    "tierLimits": {
      "dailyLimit": 50000,
      "monthlyLimit": 200000,
      "features": ["Basic transfers", "Airtime purchase"]
    }
  }
}
```

### POST /api/kyc/bvn

Update user's BVN.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "bvn": "12345678901"
}
```

**Response:**
```json
{
  "success": true,
  "message": "BVN updated successfully"
}
```

### POST /api/kyc/phone/send-otp

Send OTP to phone number for verification.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "phone": "+2341234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otp": "123456"
}
```

### POST /api/kyc/phone/verify

Verify phone number with OTP.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "phone": "+2341234567890",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Phone number verified successfully"
}
```

### POST /api/kyc/documents/upload

Upload KYC document.

**Headers:** `Authorization: Bearer <token>`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `document_type`: string (id_card, passport, utility_bill, etc.)
- `document`: file (JPEG, PNG, PDF - max 5MB)

**Response:**
```json
{
  "success": true,
  "document": {
    "id": "uuid",
    "document_type": "id_card",
    "verification_status": "pending",
    "uploaded_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Document uploaded successfully"
}
```

---

## Account Endpoints

### GET /api/accounts

Get user's accounts/wallets.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "accounts": [
    {
      "id": "uuid",
      "account_number": "2001234567",
      "balance": 50000.00,
      "formatted_balance": "₦50,000.00",
      "currency": "NGN",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /api/accounts/primary/balance

Get primary account balance.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "balance": {
    "amount": 50000.00,
    "currency": "NGN",
    "formatted": "₦50,000.00",
    "account_number": "2001234567"
  }
}
```

### GET /api/accounts/summary

Get account summary with totals and statistics.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "summary": {
    "total_balance": 50000.00,
    "formatted_total_balance": "₦50,000.00",
    "active_accounts": 1,
    "total_accounts": 1,
    "last_30_days": {
      "total_credits": 75000.00,
      "total_debits": 25000.00,
      "net_flow": 50000.00,
      "transaction_count": 15
    }
  }
}
```

---

## Transaction Endpoints

### POST /api/transactions

Create a new transaction.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "type": "airtime",
  "amount": 1000,
  "description": "Airtime purchase",
  "service_provider": "MTN",
  "service_data": {
    "phone": "+2341234567890",
    "network": "MTN"
  }
}
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "id": "uuid",
    "reference": "AIR_1640995200000_123",
    "transaction_type": "airtime",
    "amount": 1000,
    "status": "completed",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Transaction completed successfully"
}
```

### GET /api/transactions

Get user's transactions with pagination.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit`: number (default: 20, max: 100)
- `offset`: number (default: 0)
- `type`: string (filter by transaction type)
- `status`: string (filter by status)
- `start_date`: ISO date string
- `end_date`: ISO date string

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": "uuid",
      "reference": "AIR_1640995200000_123",
      "transaction_type": "airtime",
      "amount": 1000,
      "status": "completed",
      "description": "Airtime purchase",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### GET /api/transactions/stats

Get transaction statistics.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period`: string (7d, 30d, 90d - default: 30d)

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalTransactions": 25,
    "completedTransactions": 23,
    "failedTransactions": 2,
    "totalAmount": 125000.00,
    "byType": {
      "airtime": {
        "count": 10,
        "amount": 15000.00
      },
      "data": {
        "count": 5,
        "amount": 25000.00
      }
    }
  },
  "period": "30d"
}
```

### POST /api/transactions/airtime

Purchase airtime.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "phone": "+2341234567890",
  "amount": 1000,
  "network": "MTN"
}
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "id": "uuid",
    "reference": "AIR_1640995200000_123",
    "status": "completed"
  },
  "message": "Airtime purchase successful"
}
```

### POST /api/transactions/data

Purchase data bundle.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "phone": "+2341234567890",
  "amount": 2000,
  "network": "MTN",
  "plan": "2GB Monthly"
}
```

### POST /api/transactions/electricity

Pay electricity bill.

**Headers:** `Authorization: Bearer <token>`
**Requires:** Tier 2 or higher

**Request Body:**
```json
{
  "meter_number": "12345678901",
  "amount": 5000,
  "disco": "EKEDC",
  "customer_name": "John Doe"
}
```

### POST /api/transactions/cable

Pay cable TV subscription.

**Headers:** `Authorization: Bearer <token>`
**Requires:** Tier 2 or higher

**Request Body:**
```json
{
  "smartcard_number": "1234567890",
  "amount": 3500,
  "provider": "DSTV",
  "package_name": "Compact",
  "customer_name": "John Doe"
}
```

### POST /api/transactions/transfer

Transfer money to another user.

**Headers:** `Authorization: Bearer <token>`
**Requires:** Tier 2 or higher

**Request Body:**
```json
{
  "recipient_account": "2009876543",
  "amount": 10000,
  "description": "Payment for services",
  "recipient_name": "Jane Doe"
}
```

---

## Utility Endpoints

### GET /api/accounts/lookup/:accountNumber

Lookup account by account number (for transfers).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "account": {
    "account_number": "2009876543",
    "account_name": "Jane Doe",
    "account_type": "personal"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid request parameters",
  "code": "VALIDATION_ERROR"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required",
  "code": "AUTH_REQUIRED"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Tier 2 required. Current tier: 1",
  "code": "INSUFFICIENT_TIER",
  "requiredTier": 2,
  "currentTier": 1
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found",
  "code": "NOT_FOUND"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "code": "SERVER_ERROR"
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **Transaction endpoints**: 10 requests per minute
- **General endpoints**: 100 requests per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

---

## Development Features

### Development Mode

When `NODE_ENV=development`:

- Enhanced error messages with stack traces
- Auto-verification of documents and phone numbers
- Relaxed validation for testing
- Additional debug information in responses

### Test Data

In development mode, you can use these test values:

- **OTP**: Any 6-digit number (e.g., `123456`)
- **BVN**: Any 11-digit number (e.g., `12345678901`)
- **Phone**: Nigerian format `+234XXXXXXXXX`

---

## Integration Examples

### Frontend Integration

```javascript
// Initialize API client
const API_BASE = 'http://localhost:5000/api';

// Get user token from Supabase
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

// Make authenticated request
const response = await fetch(`${API_BASE}/accounts/primary/balance`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const result = await response.json();
```

### Purchase Airtime

```javascript
const purchaseAirtime = async (phone, amount, network) => {
  const response = await fetch(`${API_BASE}/transactions/airtime`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      phone,
      amount,
      network
    })
  });
  
  return await response.json();
};
```

---

## Security Considerations

1. **JWT Tokens**: All tokens are validated against Supabase
2. **Rate Limiting**: Prevents API abuse
3. **Input Validation**: All inputs are sanitized and validated
4. **Tier-based Access**: Features restricted by user tier
5. **Transaction Limits**: Daily and monthly limits enforced
6. **Audit Logging**: All transactions are logged
7. **CORS**: Configured for specific origins only

---

## Support

For API support and integration help:

- **Documentation**: This file
- **Health Check**: `GET /api/health`
- **Error Codes**: See error responses section above

---

**Version**: 2.0.0  
**Last Updated**: January 2024