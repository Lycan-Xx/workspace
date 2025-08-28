# eVault Backend - Comprehensive Documentation

## 🎯 Project Overview

### Vision Statement
eVault Backend is a production-ready fintech API system designed to power digital financial services in Nigeria. Built with modern technologies and security-first principles, it provides comprehensive payment processing, KYC management, and account services.

### Problem Statement
Traditional fintech backends often lack:
- Seamless authentication integration
- Tier-based access control
- Nigerian market compliance
- Real-time transaction processing
- Comprehensive KYC management
- Production-ready security features

### Solution
eVault Backend addresses these challenges by providing:
- **Integrated Authentication**: Seamless Supabase JWT integration
- **Multi-Tier KYC System**: Progressive verification (Tier 1-3)
- **Payment Processing**: Airtime, data, bills, transfers
- **Security-First Design**: Rate limiting, input validation, audit logging
- **Nigerian Compliance**: BVN integration, local payment methods
- **Developer Experience**: Comprehensive documentation, easy setup

---

## 🏗 Architecture Overview

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Supabase      │
│   (React)       │◄──►│   (Express.js)  │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Auth     │    │   Business      │    │   Row Level     │
│   (JWT Tokens)  │    │   Logic         │    │   Security      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase JWT
- **File Storage**: Multer + Cloud Storage
- **Security**: Helmet, Rate Limiting, Input Validation
- **Documentation**: OpenAPI/Swagger compatible

### Design Principles
1. **Security First**: Every endpoint secured by default
2. **Modular Architecture**: Clear separation of concerns
3. **Nigerian Market Focus**: Local compliance and payment methods
4. **Developer Experience**: Comprehensive docs and easy setup
5. **Production Ready**: Monitoring, logging, error handling
6. **Scalable Design**: Horizontal scaling capabilities

---

## 📁 Project Structure

```
backend/
├── middleware/              # Express middleware
│   └── auth.js             # Authentication & authorization
├── routes/                 # API route handlers
│   ├── accounts.routes.js  # Account management endpoints
│   ├── kyc.routes.js      # KYC verification endpoints
│   └── transactions.routes.js # Payment & transaction endpoints
├── services/              # Business logic layer
│   ├── kycService.js      # KYC management service
│   └── transactionService.js # Transaction processing
├── supabase/             # Supabase integration
│   ├── config.js         # Supabase client configuration
│   ├── schema.sql        # Database schema
│   └── services/         # Legacy service layer
│       ├── apiService.js # Main API service
│       └── authService.js # Authentication service
├── setup/                # Database setup utilities
│   └── createTables.js   # Database verification script
├── uploads/              # File upload storage
├── logs/                # Application logs
├── documentations/       # Project documentation
├── server.js            # Main application entry point
├── package.json         # Dependencies and scripts
├── .env                 # Environment configuration
└── README.md           # Project overview
```

### Key Components

#### Middleware Layer (`middleware/`)
- **auth.js**: JWT validation, role-based access control, tier verification

#### Route Layer (`routes/`)
- **accounts.routes.js**: Account management, balance inquiries, statements
- **kyc.routes.js**: Document upload, verification, tier upgrades
- **transactions.routes.js**: Payment processing, utility bills, transfers

#### Service Layer (`services/`)
- **kycService.js**: KYC business logic, tier management
- **transactionService.js**: Payment processing, balance management

#### Database Layer (`supabase/`)
- **config.js**: Database connection and configuration
- **schema.sql**: Complete database schema with triggers and policies

---

## 🔐 Authentication & Security

### Authentication Flow
1. **Frontend Authentication**: User logs in via Supabase
2. **JWT Token Generation**: Supabase generates JWT token
3. **Backend Validation**: Middleware validates JWT with Supabase
4. **User Context**: User profile loaded from database
5. **Request Processing**: Business logic executed with user context

### Security Features

#### JWT Token Validation
```javascript
// Every protected endpoint validates JWT tokens
const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
```

#### Tier-Based Access Control
```javascript
// Different features require different tier levels
AuthMiddleware.requireTier(2) // Requires Tier 2 or higher
```

#### Rate Limiting
- Authentication endpoints: 5 requests/minute
- Transaction endpoints: 10 requests/minute
- General endpoints: 100 requests/minute

#### Input Validation
- All inputs sanitized and validated
- SQL injection prevention
- XSS protection
- File upload security

#### Row Level Security (RLS)
- Database-level access control
- Users can only access their own data
- Service role for backend operations

---

## 💳 Payment Processing System

### Supported Payment Types

#### Utility Payments
- **Airtime**: MTN, GLO, Airtel, 9Mobile
- **Data Bundles**: All major networks
- **Electricity**: PHCN, EKEDC, IKEDC, etc.
- **Cable TV**: DSTV, GOtv, Startimes

#### Financial Services
- **Money Transfers**: Peer-to-peer transfers
- **Account Management**: Balance inquiries, statements
- **Virtual Cards**: Card creation and management

### Transaction Flow
1. **Request Validation**: Amount, recipient, service provider
2. **Tier Limit Check**: Daily/monthly limits based on user tier
3. **Balance Verification**: Sufficient funds check
4. **Transaction Creation**: Database record with unique reference
5. **Payment Processing**: External API integration
6. **Balance Update**: Atomic balance adjustment
7. **Status Update**: Transaction completion/failure

### Transaction States
- **Pending**: Initial state, processing
- **Completed**: Successfully processed
- **Failed**: Processing failed
- **Cancelled**: User or system cancelled

---

## 🎯 KYC Management System

### Tier System

#### Tier 1 (Basic)
- **Requirements**: Email verification
- **Daily Limit**: ₦50,000
- **Features**: Basic transfers, airtime purchase
- **Restrictions**: Limited transaction amounts

#### Tier 2 (Verified)
- **Requirements**: Phone + email verification
- **Daily Limit**: ₦200,000
- **Features**: All Tier 1 + bill payments, higher limits
- **Additional**: Virtual cards, priority support

#### Tier 3 (Premium)
- **Requirements**: Full KYC (BVN, ID documents, utility bill)
- **Daily Limit**: ₦1,000,000
- **Features**: All features, business tools, API access
- **Benefits**: Premium support, advanced analytics

### KYC Process
1. **Document Upload**: ID card, utility bill, passport
2. **BVN Verification**: Nigerian Bank Verification Number
3. **Phone Verification**: OTP-based verification
4. **Document Review**: Manual/automated verification
5. **Tier Upgrade**: Automatic progression based on completion

### Compliance Features
- **Nigerian Regulations**: CBN compliance
- **Data Protection**: GDPR-compliant data handling
- **Audit Trail**: Complete verification history
- **Document Security**: Encrypted storage

---

## 🗄 Database Design

### Core Tables

#### Users Table
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  business_name TEXT,
  account_type account_type DEFAULT 'personal',
  tier INTEGER DEFAULT 1,
  is_verified BOOLEAN DEFAULT FALSE,
  bvn TEXT,
  referral_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Accounts Table
```sql
CREATE TABLE public.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  account_number TEXT UNIQUE NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'NGN',
  is_active BOOLEAN DEFAULT TRUE
);
```

#### Transactions Table
```sql
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  transaction_type transaction_type NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  status transaction_status DEFAULT 'pending',
  reference TEXT UNIQUE NOT NULL,
  service_provider TEXT,
  service_data JSONB
);
```

### Database Features
- **ACID Compliance**: Full transaction support
- **Row Level Security**: User data isolation
- **Triggers**: Automatic profile creation
- **Indexes**: Optimized query performance
- **Constraints**: Data integrity enforcement

---

## 🚀 API Endpoints

### Authentication Endpoints
```
POST /api/auth/signup    - Create new account
POST /api/auth/login     - User authentication  
POST /api/auth/logout    - User logout
```

### Account Management
```
GET  /api/accounts                    - Get user accounts
GET  /api/accounts/primary/balance    - Get primary balance
GET  /api/accounts/summary           - Account summary
GET  /api/accounts/lookup/:number    - Account lookup
```

### KYC Management
```
GET  /api/kyc/status           - Get KYC status
POST /api/kyc/bvn              - Update BVN
POST /api/kyc/phone/verify     - Verify phone
POST /api/kyc/documents/upload - Upload documents
```

### Transaction Processing
```
POST /api/transactions              - Create transaction
GET  /api/transactions              - Transaction history
POST /api/transactions/airtime      - Purchase airtime
POST /api/transactions/electricity  - Pay electricity
POST /api/transactions/transfer     - Money transfer
```

### Response Format
```json
{
  "success": boolean,
  "data": object | array,
  "message": string,
  "error": string,
  "code": string
}
```

---

## 🛠 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase project
- PostgreSQL database access

### Installation Steps

#### 1. Clone and Install
```bash
git clone <repository-url>
cd backend
npm install
```

#### 2. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

#### 3. Database Setup
```bash
# Run database schema (in Supabase Dashboard)
# Copy contents of BACKEND_SCHEMA_EXTENSION.sql
# Paste in SQL Editor and run

# Verify setup
npm run setup
```

#### 4. Start Development Server
```bash
npm run dev
```

### Environment Variables
```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Server Configuration  
PORT=5000
NODE_ENV=development

# External Services
SMS_API_KEY=your-sms-key
PAYMENT_PROVIDER_KEY=your-payment-key
```

---

## 🧪 Testing & Quality Assurance

### Testing Strategy
- **Unit Tests**: Service layer testing
- **Integration Tests**: API endpoint testing
- **Security Tests**: Authentication and authorization
- **Performance Tests**: Load and stress testing

### Development Features
- **Auto-verification**: Documents and OTP in dev mode
- **Enhanced Logging**: Detailed request/response logs
- **Debug Endpoints**: Development-only endpoints
- **Mock Services**: Simulated external APIs

### Quality Metrics
- **Code Coverage**: >80% target
- **Response Time**: <200ms average
- **Uptime**: 99.9% target
- **Error Rate**: <1% target

---

## 📊 Monitoring & Observability

### Health Monitoring
```javascript
GET /api/health
{
  "status": "OK",
  "services": {
    "database": "healthy",
    "authentication": "active",
    "external_apis": "operational"
  }
}
```

### Logging Strategy
- **Application Logs**: Business logic events
- **Access Logs**: Request/response logging
- **Error Logs**: Exception tracking
- **Audit Logs**: Financial transaction trails

### Performance Monitoring
- **Response Times**: API endpoint performance
- **Database Queries**: Query optimization
- **Memory Usage**: Resource utilization
- **Error Rates**: Failure tracking

---

## 🚀 Deployment & Production

### Deployment Options
1. **Traditional VPS**: PM2 + Nginx
2. **Docker**: Containerized deployment
3. **Cloud Platforms**: AWS, GCP, Azure
4. **Serverless**: Vercel, Netlify Functions

### Production Checklist
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database migrations applied
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Monitoring setup
- [ ] Backup procedures tested
- [ ] Load balancing configured

### Scaling Considerations
- **Horizontal Scaling**: Multiple server instances
- **Database Scaling**: Read replicas, connection pooling
- **Caching**: Redis for frequently accessed data
- **CDN**: Static asset delivery
- **Load Balancing**: Traffic distribution

---

## 🔧 Maintenance & Operations

### Regular Maintenance
- **Dependency Updates**: Security patches
- **Database Optimization**: Index maintenance
- **Log Rotation**: Storage management
- **Performance Tuning**: Query optimization

### Backup Strategy
- **Database Backups**: Daily automated backups
- **File Backups**: Document and image storage
- **Configuration Backups**: Environment and settings
- **Recovery Testing**: Regular restore procedures

### Troubleshooting Guide
- **Connection Issues**: Database connectivity
- **Authentication Failures**: JWT token problems
- **Performance Issues**: Slow queries, high load
- **Integration Problems**: External API failures

---

## 📚 Additional Resources

### Documentation Links
- [API Documentation](API_DOCUMENTATION.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Database Schema](complete-evault-schema.sql)
- [Frontend Integration Guide](../README.md)

### External Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [Nigerian Fintech Regulations](https://cbn.gov.ng/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

### Community & Support
- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Comprehensive guides and examples
- **Code Examples**: Sample implementations
- **Best Practices**: Security and performance guidelines

---

## 🎯 Roadmap & Future Enhancements

### Short Term (Next 3 months)
- [ ] Advanced analytics dashboard
- [ ] Real-time notifications
- [ ] Enhanced security features
- [ ] Performance optimizations

### Medium Term (3-6 months)
- [ ] Multi-currency support
- [ ] Advanced KYC automation
- [ ] API rate limiting improvements
- [ ] Mobile SDK development

### Long Term (6+ months)
- [ ] Machine learning fraud detection
- [ ] Blockchain integration
- [ ] International payment support
- [ ] Advanced business intelligence

---

**Version**: 2.0.0  
**Last Updated**: January 2024  
**Maintained by**: eVault Development Team
--
-

## 🎨 Code Examples & Integration Patterns

### Frontend Integration Example

#### Authentication Setup
```javascript
// Frontend API client setup
const API_BASE = 'http://localhost:5000/api';

// Get JWT token from Supabase
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  return await response.json();
};
```

#### Account Balance Integration
```javascript
// Get user's account balance
const getAccountBalance = async () => {
  try {
    const result = await apiRequest('/accounts/primary/balance');
    
    if (result.success) {
      return {
        amount: result.balance.amount,
        formatted: result.balance.formatted,
        currency: result.balance.currency
      };
    }
    
    throw new Error(result.error);
  } catch (error) {
    console.error('Balance fetch failed:', error);
    throw error;
  }
};
```

#### Transaction Processing
```javascript
// Purchase airtime
const purchaseAirtime = async (phone, amount, network) => {
  try {
    const result = await apiRequest('/transactions/airtime', {
      method: 'POST',
      body: JSON.stringify({
        phone,
        amount,
        network
      })
    });
    
    if (result.success) {
      return {
        reference: result.transaction.reference,
        status: result.transaction.status,
        message: result.message
      };
    }
    
    throw new Error(result.error);
  } catch (error) {
    console.error('Airtime purchase failed:', error);
    throw error;
  }
};
```

### Backend Service Examples

#### Custom Middleware Implementation
```javascript
// Custom rate limiting middleware
const createRateLimit = (windowMs, max, message) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old requests
    const userRequests = requests.get(key) || [];
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= max) {
      return res.status(429).json({
        success: false,
        error: message,
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }
    
    validRequests.push(now);
    requests.set(key, validRequests);
    next();
  };
};
```

#### Transaction Processing Service
```javascript
// Enhanced transaction processing
class TransactionProcessor {
  async processPayment(userId, paymentData) {
    const transaction = await this.createTransaction(userId, paymentData);
    
    try {
      // Validate user tier limits
      await this.validateTierLimits(userId, paymentData.amount);
      
      // Check account balance
      await this.validateBalance(userId, paymentData.amount);
      
      // Process with external provider
      const providerResult = await this.callExternalProvider(paymentData);
      
      if (providerResult.success) {
        // Update account balance
        await this.updateBalance(userId, paymentData.amount, 'debit');
        
        // Mark transaction as completed
        await this.updateTransactionStatus(transaction.id, 'completed');
        
        return {
          success: true,
          transaction,
          providerReference: providerResult.reference
        };
      } else {
        // Mark transaction as failed
        await this.updateTransactionStatus(transaction.id, 'failed');
        
        return {
          success: false,
          error: providerResult.error,
          transaction
        };
      }
    } catch (error) {
      // Handle processing errors
      await this.updateTransactionStatus(transaction.id, 'failed');
      throw error;
    }
  }
}
```

---

## 🔍 Advanced Configuration

### Custom Authentication Strategies

#### Multi-Factor Authentication
```javascript
// MFA middleware
const requireMFA = async (req, res, next) => {
  const { user } = req;
  
  // Check if MFA is enabled for user
  const { data: mfaSettings } = await supabaseAdmin
    .from('user_security_settings')
    .select('mfa_enabled, mfa_method')
    .eq('user_id', user.id)
    .single();
  
  if (mfaSettings?.mfa_enabled) {
    const mfaToken = req.headers['x-mfa-token'];
    
    if (!mfaToken) {
      return res.status(401).json({
        success: false,
        error: 'MFA token required',
        code: 'MFA_REQUIRED'
      });
    }
    
    // Verify MFA token
    const isValidMFA = await this.verifyMFAToken(user.id, mfaToken);
    
    if (!isValidMFA) {
      return res.status(401).json({
        success: false,
        error: 'Invalid MFA token',
        code: 'INVALID_MFA'
      });
    }
  }
  
  next();
};
```

#### Role-Based Access Control
```javascript
// Advanced RBAC system
const createRoleMiddleware = (requiredRoles, requiredPermissions = []) => {
  return async (req, res, next) => {
    const { user } = req;
    
    // Get user roles and permissions
    const { data: userRoles } = await supabaseAdmin
      .from('user_roles')
      .select(`
        roles (
          name,
          permissions (name)
        )
      `)
      .eq('user_id', user.id);
    
    const userRoleNames = userRoles.map(ur => ur.roles.name);
    const userPermissions = userRoles.flatMap(ur => 
      ur.roles.permissions.map(p => p.name)
    );
    
    // Check role requirements
    const hasRequiredRole = requiredRoles.some(role => 
      userRoleNames.includes(role)
    );
    
    // Check permission requirements
    const hasRequiredPermissions = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );
    
    if (!hasRequiredRole || !hasRequiredPermissions) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: { roles: requiredRoles, permissions: requiredPermissions },
        current: { roles: userRoleNames, permissions: userPermissions }
      });
    }
    
    next();
  };
};
```

### Advanced Database Patterns

#### Audit Logging System
```sql
-- Audit log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES users(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $
BEGIN
  INSERT INTO audit_logs (
    table_name,
    operation,
    old_values,
    new_values,
    user_id,
    created_at
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    COALESCE(NEW.user_id, OLD.user_id),
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$ LANGUAGE plpgsql;

-- Apply audit triggers
CREATE TRIGGER transactions_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

#### Advanced RLS Policies
```sql
-- Time-based access control
CREATE POLICY "business_hours_access" ON sensitive_operations
  FOR ALL TO authenticated
  USING (
    EXTRACT(hour FROM NOW() AT TIME ZONE 'Africa/Lagos') BETWEEN 6 AND 22
    AND EXTRACT(dow FROM NOW()) BETWEEN 1 AND 5
  );

-- IP-based restrictions
CREATE POLICY "ip_whitelist_policy" ON admin_operations
  FOR ALL TO authenticated
  USING (
    inet_client_addr() <<= ANY(
      SELECT ip_range FROM allowed_ip_ranges 
      WHERE user_id = auth.uid()
    )
  );

-- Transaction amount limits
CREATE POLICY "transaction_amount_limits" ON transactions
  FOR INSERT TO authenticated
  WITH CHECK (
    amount <= (
      SELECT daily_limit FROM user_tier_limits 
      WHERE tier = (
        SELECT tier FROM users WHERE id = auth.uid()
      )
    )
  );
```

---

## 🛡 Security Best Practices

### Input Validation & Sanitization

#### Request Validation Middleware
```javascript
const { body, param, query, validationResult } = require('express-validator');

// Validation rules
const transactionValidation = [
  body('amount')
    .isFloat({ min: 50, max: 1000000 })
    .withMessage('Amount must be between ₦50 and ₦1,000,000'),
  
  body('phone')
    .matches(/^\+234[789]\d{9}$/)
    .withMessage('Invalid Nigerian phone number format'),
  
  body('network')
    .isIn(['MTN', 'GLO', 'AIRTEL', '9MOBILE'])
    .withMessage('Invalid network provider'),
  
  // Custom validation
  body('amount').custom(async (value, { req }) => {
    const user = req.user;
    const dailySpent = await getDailySpending(user.id);
    const tierLimits = getTierLimits(user.tier);
    
    if (dailySpent + value > tierLimits.dailyLimit) {
      throw new Error('Transaction would exceed daily limit');
    }
    
    return true;
  })
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array()
    });
  }
  
  next();
};
```

#### SQL Injection Prevention
```javascript
// Always use parameterized queries
const getUserTransactions = async (userId, filters) => {
  const { data, error } = await supabaseAdmin
    .from('transactions')
    .select('*')
    .eq('user_id', userId) // Parameterized
    .gte('created_at', filters.startDate) // Safe filtering
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// Never use string concatenation
// BAD: `SELECT * FROM users WHERE id = '${userId}'`
// GOOD: Use Supabase client methods or prepared statements
```

### Encryption & Data Protection

#### Sensitive Data Encryption
```javascript
const crypto = require('crypto');

class DataEncryption {
  constructor(encryptionKey) {
    this.algorithm = 'aes-256-gcm';
    this.key = Buffer.from(encryptionKey, 'hex');
  }
  
  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }
  
  decrypt(encryptedData) {
    const decipher = crypto.createDecipher(
      this.algorithm, 
      this.key, 
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Usage for sensitive fields
const encryptSensitiveData = (userData) => {
  const encryption = new DataEncryption(process.env.ENCRYPTION_KEY);
  
  return {
    ...userData,
    bvn: userData.bvn ? encryption.encrypt(userData.bvn) : null,
    nin: userData.nin ? encryption.encrypt(userData.nin) : null
  };
};
```

---

## 📈 Performance Optimization

### Database Optimization

#### Query Optimization
```sql
-- Efficient indexes for common queries
CREATE INDEX CONCURRENTLY idx_transactions_user_date 
  ON transactions(user_id, created_at DESC) 
  WHERE status = 'completed';

CREATE INDEX CONCURRENTLY idx_users_tier_status 
  ON users(tier, is_verified) 
  WHERE status = 'active';

-- Partial indexes for better performance
CREATE INDEX CONCURRENTLY idx_pending_transactions 
  ON transactions(created_at) 
  WHERE status = 'pending';
```

#### Connection Pooling
```javascript
// Supabase connection optimization
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  db: {
    schema: 'public'
  },
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      'x-application-name': 'evault-backend'
    }
  }
});

// Connection pool monitoring
const monitorConnections = () => {
  setInterval(async () => {
    try {
      const { data } = await supabaseAdmin
        .from('pg_stat_activity')
        .select('count(*)')
        .eq('application_name', 'evault-backend');
      
      console.log(`Active connections: ${data[0].count}`);
    } catch (error) {
      console.error('Connection monitoring failed:', error);
    }
  }, 30000); // Check every 30 seconds
};
```

### Caching Strategies

#### Redis Integration
```javascript
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

// Cache middleware
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}:${req.user?.id}`;
    
    try {
      const cached = await client.get(key);
      
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      // Override res.json to cache response
      const originalJson = res.json;
      res.json = function(data) {
        client.setex(key, duration, JSON.stringify(data));
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};

// Usage
app.get('/api/accounts/summary', 
  AuthMiddleware.verifyToken,
  cacheMiddleware(600), // Cache for 10 minutes
  async (req, res) => {
    // Route handler
  }
);
```

---

## 🚨 Error Handling & Logging

### Centralized Error Handling

#### Error Handler Middleware
```javascript
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler
const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Log error
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    user: req.user?.id,
    timestamp: new Date().toISOString()
  });
  
  // Supabase errors
  if (err.code === 'PGRST116') {
    error = new AppError('Resource not found', 404, 'NOT_FOUND');
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401, 'INVALID_TOKEN');
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new AppError(message, 400, 'VALIDATION_ERROR');
  }
  
  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message,
    code: error.code,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};
```

### Structured Logging

#### Winston Logger Configuration
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'evault-backend' },
  transports: [
    // Error logs
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Combined logs
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5
    }),
    
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id
    });
  });
  
  next();
};
```

---

## 🔄 CI/CD & DevOps

### GitHub Actions Workflow

#### Automated Testing & Deployment
```yaml
# .github/workflows/backend-ci.yml
name: Backend CI/CD

on:
  push:
    branches: [ main, develop ]
    paths: [ 'backend/**' ]
  pull_request:
    branches: [ main ]
    paths: [ 'backend/**' ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
    
    - name: Install dependencies
      run: |
        cd backend
        npm ci
    
    - name: Run linting
      run: |
        cd backend
        npm run lint
    
    - name: Run tests
      run: |
        cd backend
        npm test
      env:
        NODE_ENV: test
        SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
    
    - name: Run security audit
      run: |
        cd backend
        npm audit --audit-level moderate

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to production
      run: |
        # Add deployment script here
        echo "Deploying to production..."
```

### Docker Configuration

#### Multi-stage Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine AS production

# Create app directory
WORKDIR /usr/src/app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S evault -u 1001

# Copy built application
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=evault:nodejs . .

# Create uploads directory
RUN mkdir -p uploads/kyc && chown -R evault:nodejs uploads

# Switch to non-root user
USER evault

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

EXPOSE 5000

CMD ["node", "server.js"]
```

#### Docker Compose for Development
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
    env_file:
      - .env
    volumes:
      - ./uploads:/usr/src/app/uploads
      - ./logs:/usr/src/app/logs
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  redis_data:
```

---

This comprehensive documentation covers all aspects of the eVault backend system, from initial concept to production deployment. It serves as both a technical reference and implementation guide for developers working with the system.