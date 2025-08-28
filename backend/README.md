# eVault Backend API

A comprehensive fintech backend API built with Express.js and Supabase, providing authentication, KYC management, transaction processing, and account management services for the eVault platform.

## 🚀 Features

### Core Services
- **Authentication**: JWT-based auth with Supabase integration
- **KYC Management**: Multi-tier verification system
- **Transaction Processing**: Payments, transfers, and utility bills
- **Account Management**: Wallet operations and balance management
- **Real-time Operations**: Live transaction processing

### Payment Services
- **Airtime Purchase**: All major Nigerian networks
- **Data Bundles**: Mobile data subscriptions
- **Electricity Bills**: PHCN and distribution companies
- **Cable TV**: DSTV, GOtv, Startimes subscriptions
- **Money Transfers**: Peer-to-peer transfers

### Security Features
- **Tier-based Access Control**: Progressive feature unlocking
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Comprehensive request sanitization
- **Audit Logging**: Complete transaction trails
- **Row Level Security**: Database-level access control

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase project
- PostgreSQL database (via Supabase)

## 🛠 Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-org/evault-backend.git
cd evault-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template:

```bash
cp .env.example .env
```

Configure your `.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Frontend Configuration
FRONTEND_URL=http://localhost:5173

# Development Settings
LOG_LEVEL=debug
```

### 4. Database Setup

Run the database setup script:

```bash
npm run setup
```

This will create all necessary tables, triggers, and policies in your Supabase database.

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 🏗 Project Structure

```
backend/
├── middleware/           # Express middleware
│   └── auth.js          # Authentication middleware
├── routes/              # API route handlers
│   ├── kyc.routes.js    # KYC endpoints
│   ├── transactions.routes.js # Transaction endpoints
│   └── accounts.routes.js     # Account endpoints
├── services/            # Business logic services
│   ├── kycService.js    # KYC management
│   └── transactionService.js # Transaction processing
├── supabase/           # Supabase integration
│   ├── config.js       # Supabase client setup
│   ├── schema.sql      # Database schema
│   └── services/       # Legacy service layer
├── uploads/            # File upload storage
├── logs/              # Application logs
├── server.js          # Main application entry
└── package.json       # Dependencies and scripts
```

## 🔧 API Endpoints

### Health Check
```
GET /api/health - Server status and service health
```

### Authentication (Legacy - via Supabase)
```
POST /api/auth/signup   - Create new account
POST /api/auth/login    - User authentication
POST /api/auth/logout   - User logout
```

### KYC Management
```
GET  /api/kyc/status           - Get KYC status
POST /api/kyc/bvn              - Update BVN
POST /api/kyc/phone/send-otp   - Send phone OTP
POST /api/kyc/phone/verify     - Verify phone number
POST /api/kyc/documents/upload - Upload KYC document
POST /api/kyc/upgrade          - Request tier upgrade
```

### Account Management
```
GET /api/accounts                    - Get user accounts
GET /api/accounts/primary/balance    - Get primary balance
GET /api/accounts/summary           - Account summary
GET /api/accounts/lookup/:number    - Lookup account
```

### Transactions
```
POST /api/transactions              - Create transaction
GET  /api/transactions              - Get transaction history
GET  /api/transactions/stats        - Transaction statistics
POST /api/transactions/airtime      - Purchase airtime
POST /api/transactions/data         - Purchase data bundle
POST /api/transactions/electricity  - Pay electricity bill
POST /api/transactions/cable        - Pay cable TV
POST /api/transactions/transfer     - Money transfer
```

## 🔐 Authentication

The API uses JWT tokens from Supabase for authentication. Include the token in the Authorization header:

```javascript
headers: {
  'Authorization': 'Bearer <your-jwt-token>',
  'Content-Type': 'application/json'
}
```

## 🎯 User Tiers

The system implements a 3-tier verification system:

### Tier 1 (Basic)
- Daily limit: ₦50,000
- Features: Basic transfers, airtime purchase
- Requirements: Email verification

### Tier 2 (Verified)
- Daily limit: ₦200,000
- Features: All Tier 1 + bill payments, higher limits
- Requirements: Phone + email verification

### Tier 3 (Premium)
- Daily limit: ₦1,000,000
- Features: All features, business tools, API access
- Requirements: Full KYC (BVN, ID documents, utility bill)

## 🧪 Development

### Running Tests

```bash
npm test
```

### Code Linting

```bash
npm run lint
npm run lint:fix
```

### Database Migrations

```bash
npm run setup  # Initial setup
```

### Development Features

In development mode (`NODE_ENV=development`):

- Enhanced error messages with stack traces
- Auto-verification of documents and phone numbers
- Relaxed validation for testing
- Test OTP: Any 6-digit number
- Detailed request/response logging

## 📊 Monitoring

### Health Checks

The `/api/health` endpoint provides comprehensive health information:

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "2.0.0",
  "services": {
    "authentication": "active",
    "kyc": "active",
    "transactions": "active",
    "accounts": "active"
  }
}
```

### Logging

Logs are written to:
- `logs/error.log` - Error logs
- `logs/combined.log` - All logs
- Console output in development

### Performance Monitoring

Key metrics to monitor:
- Response times
- Error rates
- Database connection pool
- Memory usage
- Transaction success rates

## 🔒 Security

### Security Measures

1. **JWT Validation**: All tokens verified against Supabase
2. **Rate Limiting**: Prevents API abuse
3. **Input Sanitization**: All inputs validated and sanitized
4. **CORS Configuration**: Restricted to allowed origins
5. **Helmet.js**: Security headers
6. **Tier-based Access**: Progressive feature access
7. **Audit Logging**: Complete transaction trails

### Rate Limits

- Authentication endpoints: 5 requests/minute
- Transaction endpoints: 10 requests/minute
- General endpoints: 100 requests/minute

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
```bash
NODE_ENV=production
```

2. **Process Management**
```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
```

3. **Reverse Proxy**
Configure Nginx or similar for SSL termination and load balancing.

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment
- [Database Schema](./supabase/schema.sql) - Database structure

## 🧪 Testing

### Manual Testing

Use the provided test scripts:

```bash
# Test authentication flow
node test-auth.mjs

# Test transaction processing
curl -X POST http://localhost:5000/api/transactions/airtime \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+2341234567890","amount":1000,"network":"MTN"}'
```

### Integration Testing

The API integrates seamlessly with the frontend authentication system:

1. User authenticates via Supabase on frontend
2. Frontend receives JWT token
3. Token is used for all backend API calls
4. Backend validates token with Supabase
5. User profile and permissions loaded from database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style

- Use ESLint configuration
- Follow existing patterns
- Add JSDoc comments for functions
- Include error handling
- Write meaningful commit messages

## 📝 Changelog

### Version 2.0.0
- Complete rewrite with modular architecture
- Enhanced KYC management system
- Comprehensive transaction processing
- Tier-based access control
- Production-ready security features
- Complete API documentation

### Version 1.0.0
- Initial release with basic authentication
- Simple transaction processing
- Basic account management

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify Supabase credentials
   - Check network connectivity
   - Ensure service role key is correct

2. **Authentication Failures**
   - Verify JWT token format
   - Check token expiration
   - Ensure user exists in database

3. **File Upload Issues**
   - Check uploads directory permissions
   - Verify file size limits
   - Ensure multer configuration

### Debug Mode

Enable debug logging:

```bash
DEBUG=* NODE_ENV=development npm start
```

## 📞 Support

For support and questions:

- Check the [API Documentation](./API_DOCUMENTATION.md)
- Review [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- Open an issue on GitHub
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for authentication and database services
- **Express.js** for the web framework
- **Nigerian Fintech Community** for requirements and feedback

---

**Version**: 2.0.0  
**Maintained by**: eVault Development Team  
**Last Updated**: January 2024