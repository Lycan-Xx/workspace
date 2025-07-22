# eVault Backend Implementation Guide

## 1. System Architecture Overview

### 1.1 Core Architecture
```plaintext
eVault Platform
├── API Gateway (Express/Node.js)
├── Microservices
│   ├── Auth Service
│   ├── Account Service
│   ├── Transaction Service
│   ├── Payment Service
│   ├── Utility Service
│   └── Notification Service
├── Databases
│   ├── MongoDB (Main Database)
│   └── Redis (Caching Layer)
└── External Services Integration Layer
```

## 2. Initial Setup & Development Environment

### 2.1 Project Initialization
```bash
mkdir evault-backend
cd evault-backend
npm init -y

# Install core dependencies
npm install express mongoose dotenv helmet cors jsonwebtoken bcrypt 
npm install redis morgan winston passport multer

# Development dependencies
npm install -D nodemon typescript @types/node @types/express
```

### 2.2 Project Structure
```plaintext
src/
├── config/
│   ├── database.ts
│   ├── redis.ts
│   └── constants.ts
├── services/
│   ├── auth/
│   ├── accounts/
│   ├── transactions/
│   ├── payments/
│   └── utilities/
├── middleware/
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   └── error.middleware.ts
├── models/
│   ├── user.model.ts
│   ├── account.model.ts
│   └── transaction.model.ts
├── utils/
│   ├── logger.ts
│   ├── encryption.ts
│   └── validators.ts
└── index.ts
```

## 3. Core Services Implementation

### 3.1 Authentication Service

#### 3.1.1 User Model Schema
```typescript
// src/models/user.model.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountType: { type: String, enum: ['personal', 'business'] },
  tier: { type: Number, default: 1 },
  kycStatus: {
    bvnVerified: Boolean,
    documentsVerified: Boolean,
    addressVerified: Boolean
  },
  security: {
    twoFactorEnabled: Boolean,
    lastLogin: Date,
    loginAttempts: Number
  }
});
```

#### 3.1.2 Authentication Routes
```typescript
// src/services/auth/routes.ts
import { Router } from 'express';
import { validateRegistration, validateLogin } from '../middleware/validation';

router.post('/register', validateRegistration, async (req, res) => {
  // Implementation for user registration
});

router.post('/login', validateLogin, async (req, res) => {
  // Implementation for user login
});

router.post('/verify-bvn', authMiddleware, async (req, res) => {
  // BVN verification implementation
});
```

### 3.2 Account Service

#### 3.2.1 Account Model
```typescript
// src/models/account.model.ts
const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  accountNumber: { type: String, unique: true },
  balance: { type: Number, default: 0 },
  type: { type: String, enum: ['savings', 'current'] },
  currency: { type: String, default: 'NGN' },
  status: { type: String, enum: ['active', 'inactive', 'suspended'] }
});
```

#### 3.2.2 Account Service Implementation
```typescript
// src/services/accounts/account.service.ts
class AccountService {
  async createAccount(userId: string, type: string): Promise<IAccount> {
    const accountNumber = await this.generateAccountNumber();
    return await Account.create({
      userId,
      accountNumber,
      type
    });
  }

  async upgradeAccountTier(userId: string, newTier: number): Promise<void> {
    // Implement tier upgrade logic
  }
}
```

### 3.3 Transaction Service

#### 3.3.1 Transaction Model
```typescript
// src/models/transaction.model.ts
const transactionSchema = new mongoose.Schema({
  fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  toAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['transfer', 'deposit', 'withdrawal'] },
  status: { type: String, enum: ['pending', 'completed', 'failed'] },
  reference: { type: String, unique: true },
  metadata: { type: Map, of: String }
});
```

### 3.4 Payment Service

#### 3.4.1 Payment Integration
```typescript
// src/services/payments/payment.service.ts
class PaymentService {
  async processUtilityPayment(data: IUtilityPayment): Promise<IPaymentResult> {
    // Implement utility payment logic
  }

  async processAirtimeRecharge(data: IAirtimeRecharge): Promise<IRechargeResult> {
    // Implement airtime recharge logic
  }
}
```

## 4. Security Implementation

### 4.1 Authentication Middleware
```typescript
// src/middleware/auth.middleware.ts
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
```

### 4.2 Data Encryption
```typescript
// src/utils/encryption.ts
import crypto from 'crypto';

export class Encryption {
  static encrypt(data: string): string {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
  }

  static decrypt(encryptedData: string): string {
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    return decipher.update(encryptedData, 'hex', 'utf8') + decipher.final('utf8');
  }
}
```

## 5. External Integrations

### 5.1 Payment Gateway Integration
```typescript
// src/services/payments/gateway.ts
class PaymentGateway {
  async initializePayment(amount: number, email: string): Promise<string> {
    // Implementation for payment initialization
  }

  async verifyPayment(reference: string): Promise<IPaymentVerification> {
    // Implementation for payment verification
  }
}
```

### 5.2 SMS/Email Service
```typescript
// src/services/notifications/notification.service.ts
class NotificationService {
  async sendSMS(phone: string, message: string): Promise<void> {
    // SMS sending implementation
  }

  async sendEmail(email: string, subject: string, template: string, data: any): Promise<void> {
    // Email sending implementation
  }
}
```

## 6. Database Management

### 6.1 Database Connection
```typescript
// src/config/database.ts
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
```

### 6.2 Redis Cache Implementation
```typescript
// src/config/redis.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD
});

export const cacheData = async (key: string, data: any, ttl: number): Promise<void> => {
  await redis.setex(key, ttl, JSON.stringify(data));
};
```

## 7. Error Handling & Logging

### 7.1 Error Middleware
```typescript
// src/middleware/error.middleware.ts
export const errorHandler = (err, req, res, next) => {
  const error = {
    status: err.status || 500,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };
  
  logger.error(`${error.status} - ${error.message} - ${req.originalUrl}`);
  res.status(error.status).json({ error: error.message });
};
```

### 7.2 Logger Implementation
```typescript
// src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 8. Testing Strategy

### 8.1 Unit Tests Setup
```typescript
// tests/unit/auth.test.ts
import { expect } from 'chai';
import { AuthService } from '../../src/services/auth/auth.service';

describe('Auth Service', () => {
  it('should create a new user', async () => {
    // Test implementation
  });

  it('should validate user credentials', async () => {
    // Test implementation
  });
});
```

## 9. Deployment Configuration

### 9.1 Docker Configuration
```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### 9.2 Environment Variables
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/evault
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

## 10. API Documentation

### 10.1 Swagger Configuration
```typescript
// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'eVault API Documentation',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);
```

## 11. Monitoring & Maintenance

### 11.1 Health Check Implementation
```typescript
// src/routes/health.ts
router.get('/health', async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  };
  try {
    await mongoose.connection.db.admin().ping();
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).send();
  }
});
```

This implementation guide provides a foundation for building the eVault backend system. Each component should be implemented incrementally, with thorough testing at each stage. The modular architecture allows for easy scaling and maintenance as the system grows.
