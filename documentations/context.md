# eVault Complete System Architecture & Context Guide

## 1. Project Overview

eVault is a comprehensive fintech platform built with a modern three-pronged architecture approach, designed to provide users with secure account onboarding, multi-tiered KYC verification, balance management, instant payments, and utility services (airtime, data, TV, electricity, school fees, etc.). The system leverages a strategic separation of concerns across three distinct layers for optimal security, scalability, and maintainability.

### Three-Pronged Architecture Philosophy

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│                     │    │                     │    │                     │
│    FRONTEND         │◄──►│    SUPABASE         │◄──►│    BACKEND          │
│    (React/Vite)     │    │    (Auth + DB)      │    │    (Node.js/Express)│
│                     │    │                     │    │                     │
│ • User Interface    │    │ • Authentication    │    │ • Business Logic    │
│ • State Management  │    │ • Database          │    │ • Payment Processing│
│ • User Experience   │    │ • Real-time Updates │    │ • KYC Management    │
│ • Client Validation │    │ • Row Level Security│    │ • External APIs     │
│ • Responsive Design │    │ • Session Management│    │ • Complex Operations│
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

### Why This Architecture?

1. **Frontend (React)**: Handles all user interactions, UI/UX, and client-side state management
2. **Supabase**: Manages authentication, database operations, and real-time features with built-in security
3. **Backend (Node.js)**: Processes complex business logic, external API integrations, and sensitive operations

This approach provides:
- **Security**: Sensitive operations isolated in backend with proper authentication
- **Performance**: Direct database access for simple operations, backend for complex ones
- **Scalability**: Each layer can be scaled independently
- **Maintainability**: Clear separation of concerns and responsibilities
- **Developer Experience**: Modern tooling and clear architectural boundaries

---

## 2. System Architecture Overview

### 2.1 Frontend Layer (React/Vite)
**Location**: `src/` directory
**Purpose**: User interface, experience, and client-side logic
**Technology Stack**: React 18, Vite, Redux Toolkit, Tailwind CSS, Framer Motion

### 2.2 Supabase Layer (Database + Auth)
**Location**: `documentations/supabase_setup/`
**Purpose**: Authentication, database, real-time features, and security
**Technology Stack**: PostgreSQL, Supabase Auth, Row Level Security, Triggers

### 2.3 Backend Layer (Node.js/Express)
**Location**: `backend/` directory
**Purpose**: Business logic, payment processing, KYC management, external integrations
**Technology Stack**: Node.js 18+, Express.js, Supabase Client, Multer, Winston

---

## 3. Frontend Directory Structure

```
evault-frontend/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── App.jsx
│   ├── index.js
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   │   ├── LandingPage/
│   │   │   ├── About.jsx
│   │   │   ├── Feedback.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Mission.jsx
│   │   │   ├── MobileApp.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Offer.jsx
│   │   │   └── Services.jsx
│   │   ├── EvaultPlatform/
│   │   │   ├── PlatformApp.jsx
│   │   │   ├── PlatfromRoute.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ServiceCard.jsx
│   │   │   ├── Slider.jsx
│   │   │   ├── account-upgrades/
│   │   │   │   ├── business-upgrade/
│   │   │   │   ├── shared/
│   │   │   │   ├── tier2/
│   │   │   │   └── tier3/
│   │   │   ├── authentication/
│   │   │   │   └── security/
│   │   │   ├── common/
│   │   │   │   └── PinVerificationModal.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── PaymentCard.jsx
│   │   │   │   ├── Portal.jsx
│   │   │   │   ├── ServiceCardsDescription.jsx
│   │   │   │   ├── SettingsApp.jsx
│   │   │   │   ├── SideBar.jsx
│   │   │   │   ├── TopBar.jsx
│   │   │   │   ├── Trade.jsx
│   │   │   │   ├── VirtualCardRequest.jsx
│   │   │   │   ├── layout/
│   │   │   │   ├── Portfolio/
│   │   │   │   ├── Services/
│   │   │   │   ├── settings/
│   │   │   │   ├── TabContents/
│   │   │   │   └── Vault/
│   │   │   ├── InstantPayments/
│   │   │   │   ├── CategoryGrid.jsx
│   │   │   │   ├── InstantPayments.jsx
│   │   │   │   ├── VendorDetails.jsx
│   │   │   │   └── VendorList/
│   │   │   ├── layout/
│   │   │   │   ├── ContentColumn.jsx
│   │   │   │   ├── InfoColumn.jsx
│   │   │   │   └── MainLayout.jsx
│   │   │   ├── security/
│   │   │   │   └── ConfigureSecurity.jsx
│   │   │   ├── signin/
│   │   │   │   └── SignIn.jsx
│   │   │   ├── signup/
│   │   │   │   └── SignUp.jsx
│   │   │   ├── store/
│   │   │   │   ├── authSlice.js
│   │   │   │   └── store.js
│   │   └── assets/
│   │       ├── ...images
│   │       └── ...logos
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

---

## 4. Supabase Integration Layer

### 4.1 Database Schema
**Location**: `documentations/supabase_setup/complete-evault-schema.sql`

#### Core Tables:
- **users**: Extended user profiles with KYC data
- **accounts**: User wallet/account management
- **transactions**: Complete transaction lifecycle
- **kyc_documents**: Document verification system
- **virtual_cards**: Digital card management
- **vault_files**: Secure file storage
- **vendors**: Service provider management
- **notifications**: User notification system

#### Key Features:
- **Automatic Triggers**: User profile creation on signup
- **Row Level Security (RLS)**: Data isolation and protection
- **Performance Indexes**: Optimized database queries
- **Data Validation**: Comprehensive constraints and checks
- **Audit Logging**: Complete transaction trails

### 4.2 Authentication System
**Integration**: Direct Supabase Auth with JWT tokens

#### Authentication Flow:
1. User signs up/logs in via frontend
2. Supabase generates JWT token
3. Frontend stores token and user session
4. Backend validates JWT for protected operations
5. Database enforces RLS based on authenticated user

#### Security Features:
- JWT token validation
- Session persistence
- Automatic token refresh
- Row-level data isolation
- Multi-tier access control

---

## 5. Backend Services Layer

### 5.1 Architecture
**Location**: `backend/` directory
**Documentation**: `documentations/nodejs_backend/COMPREHENSIVE_BACKEND_DOCUMENTATION.md`

#### Service Structure:
```
backend/
├── middleware/              # Authentication & security
│   └── auth.js             # JWT validation, tier checks
├── routes/                 # API endpoints
│   ├── accounts.routes.js  # Account management
│   ├── kyc.routes.js      # KYC verification
│   └── transactions.routes.js # Payment processing
├── services/              # Business logic
│   ├── kycService.js      # KYC management
│   └── transactionService.js # Transaction processing
└── supabase/             # Database integration
    └── config.js         # Supabase client setup
```

### 5.2 Core Services

#### KYC Management Service
- **Multi-tier verification** (Tier 1-3)
- **Document upload and verification**
- **BVN integration** for Nigerian compliance
- **Phone number verification** with OTP
- **Automatic tier upgrades** based on completion

#### Transaction Processing Service
- **Payment processing** for utilities (airtime, data, electricity, cable)
- **Money transfers** between users
- **Balance management** with atomic operations
- **Transaction limits** based on user tier
- **External API integration** for service providers

#### Account Management Service
- **Balance inquiries** and statements
- **Account lookup** for transfers
- **Virtual card management**
- **Transaction history** with pagination

### 5.3 Security & Compliance
- **JWT token validation** with Supabase
- **Tier-based access control** (Tier 1-3 restrictions)
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization
- **Nigerian fintech compliance** (CBN regulations)
- **Audit logging** for all financial operations

---

## 6. Integration Flow Between Layers

### 6.1 User Authentication Flow
```
Frontend → Supabase Auth → Backend Validation → Database Access
    ↓           ↓              ↓                    ↓
  UI/UX    JWT Generation   Token Validation   RLS Enforcement
```

### 6.2 Transaction Processing Flow
```
Frontend Request → Backend Validation → External APIs → Database Update → Frontend Response
      ↓                   ↓                  ↓              ↓                ↓
  User Input        Tier Limits Check   Payment Provider   Balance Update   UI Update
```

### 6.3 KYC Verification Flow
```
Frontend Upload → Backend Processing → Document Storage → Verification → Tier Upgrade
      ↓                  ↓                   ↓               ↓              ↓
  File Selection    Validation/Security   Supabase Storage   Manual Review   Auto Upgrade
```

---

## 7. EvaultPlatform Component Breakdown

### 7.1 PlatformApp.jsx
- **Main entry for authenticated user flows.**
- Handles view transitions (instant payments, dashboard, onboarding, etc.)
- Uses animated transitions for smooth navigation.
- Manages selected vendor and current view state.

### 7.2 PlatfromRoute.jsx
- **Route protection logic.**
- PrivateRoute, SecurityRoute, PublicRoute components for access control.
- Integrates with Redux store for authentication state.

### 7.3 Account Onboarding & Upgrades
- **account-upgrades/**: Business, shared, tier2, tier3 onboarding flows.
- KYC verification, document upload, and tier upgrades.

### 7.4 Dashboard & Financial Operations
- **Dashboard/**: User dashboard, payment cards, portfolio, vault, settings, sidebar, topbar, trade, virtual card request.
- **Services/**: Service cards and descriptions for all available financial and utility services.

### 7.5 Instant Payments
- **InstantPayments/**: Category grid, vendor list, vendor details, instant payment flows.
- Handles airtime, data, TV, electricity, and other bill payments.

### 7.6 Security & Authentication
- **authentication/security/**: Security configuration, PIN verification modal, sign-in and sign-up flows.

### 7.7 Layout & Common Components
- **layout/**: MainLayout, ContentColumn, InfoColumn for consistent UI structure.
- **common/**: Shared modals and utilities.

---

## 8. Cross-Layer Data Flow

### 8.1 Authentication Data Flow
```
User Login (Frontend) → Supabase Auth → JWT Token → Redux Store → API Calls (Backend)
                                           ↓
                                    Session Storage
                                           ↓
                                    Route Protection
```

### 8.2 Transaction Data Flow
```
Payment Form (Frontend) → Validation → Backend API → External Provider → Database Update
         ↓                    ↓            ↓              ↓                ↓
    User Input          Client Validation  Tier Check   Payment Process   Balance Update
         ↓                    ↓            ↓              ↓                ↓
    Loading State       Error Handling   Security Check  Status Update   UI Refresh
```

### 8.3 KYC Data Flow
```
Document Upload (Frontend) → File Validation → Backend Processing → Supabase Storage
          ↓                       ↓                   ↓                    ↓
    File Selection          Size/Type Check      Security Scan        Secure Storage
          ↓                       ↓                   ↓                    ↓
    Progress Indicator      Error Handling       Verification Queue    Status Update
```

---

## 9. Technology Stack Integration

### 9.1 Frontend Technologies
- **React 18**: Component-based UI with hooks
- **Vite**: Fast build tool and development server
- **Redux Toolkit**: State management with persistence
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations and transitions
- **React Icons**: Comprehensive icon library

### 9.2 Supabase Technologies
- **PostgreSQL**: Robust relational database
- **Supabase Auth**: Built-in authentication system
- **Row Level Security**: Database-level access control
- **Real-time Subscriptions**: Live data updates
- **Storage**: Secure file storage with CDN
- **Edge Functions**: Serverless compute (future use)

### 9.3 Backend Technologies
- **Node.js 18+**: JavaScript runtime
- **Express.js**: Web application framework
- **Supabase Client**: Database and auth integration
- **Multer**: File upload handling
- **Winston**: Structured logging
- **Helmet**: Security headers
- **Express Rate Limit**: API rate limiting

---

## 10. Modular Service Diagram

```plaintext
+-------------------+      +-------------------+      +-------------------+
|   Onboarding      | ---> |   Dashboard       | ---> |   Payments        |
+-------------------+      +-------------------+      +-------------------+
        |                        |                        |
        v                        v                        v
+-------------------+      +-------------------+      +-------------------+
|   Account Types   |      |   Portfolio       |      |   Utility Bills   |
+-------------------+      +-------------------+      +-------------------+
        |                        |                        |
        v                        v                        v
+-------------------+      +-------------------+      +-------------------+
|   Security        |      |   Virtual Cards   |      |   Vendor List     |
+-------------------+      +-------------------+      +-------------------+
```

---

## 11. Key System Flows

### 11.1 Complete User Onboarding Flow
```
Frontend Registration → Supabase Auth → Database Trigger → Profile Creation → Backend Validation → KYC Initiation
         ↓                    ↓              ↓                 ↓                  ↓                 ↓
    Form Validation      JWT Generation   Auto Profile     Account Creation   Tier Assignment   Document Upload
```

### 11.2 Payment Processing Flow
```
Frontend Payment → Backend Validation → External API → Database Transaction → Real-time Update
       ↓                 ↓                   ↓               ↓                      ↓
  User Interface    Security Checks    Provider Call    Balance Adjustment    UI Notification
```

### 11.3 KYC Verification Flow
```
Document Upload → Backend Processing → Verification Queue → Manual/Auto Review → Tier Upgrade
       ↓                 ↓                    ↓                    ↓                ↓
  File Validation   Security Scan      Database Storage      Status Update    Feature Unlock
```

---

## 12. Key Frontend Flows

- **User Onboarding:**
  - Multi-step forms for personal/business accounts
  - KYC document upload and verification
  - Tier upgrades and account type selection

- **Authentication:**
  - Sign-in, sign-up, PIN verification, and security configuration
  - Protected routes for sensitive operations

- **Dashboard:**
  - Overview of balances, cards, transactions, and portfolio
  - Quick access to payments and services

- **Instant Payments:**
  - Select category (airtime, data, TV, electricity, school fees)
  - Choose vendor, enter details, confirm and pay

- **Service Cards:**
  - Display all available services with icons and descriptions
  - Interactive cards for navigation

- **Virtual Cards:**
  - Request, view, and manage virtual cards for online transactions

- **Security:**
  - Configure security settings, PIN, and 2FA

---

## 13. Backend API Integration Points

### 13.1 Authentication Endpoints
- **POST /api/auth/signup**: Account creation with metadata
- **POST /api/auth/login**: User authentication
- **POST /api/auth/logout**: Session termination
- **GET /api/auth/session**: Session validation

### 13.2 Account Management Endpoints
- **GET /api/accounts**: User account information
- **GET /api/accounts/primary/balance**: Current balance
- **GET /api/accounts/summary**: Account overview
- **GET /api/accounts/lookup/:number**: Account verification

### 13.3 Transaction Endpoints
- **POST /api/transactions**: Create new transaction
- **GET /api/transactions**: Transaction history
- **POST /api/transactions/airtime**: Airtime purchase
- **POST /api/transactions/data**: Data bundle purchase
- **POST /api/transactions/electricity**: Electricity payment
- **POST /api/transactions/cable**: Cable TV payment
- **POST /api/transactions/transfer**: Money transfer

### 13.4 KYC Management Endpoints
- **GET /api/kyc/status**: Current KYC status
- **POST /api/kyc/bvn**: BVN verification
- **POST /api/kyc/phone/verify**: Phone verification
- **POST /api/kyc/documents/upload**: Document upload
- **POST /api/kyc/upgrade**: Tier upgrade request

---

## 14. Security Architecture

### 14.1 Multi-Layer Security
```
Frontend Security → Supabase Security → Backend Security → Database Security
       ↓                   ↓                  ↓                 ↓
  Input Validation    JWT Validation    Rate Limiting    Row Level Security
  XSS Protection     Session Management  Input Sanitization  Data Encryption
  CSRF Protection    Token Refresh      Authentication     Audit Logging
```

### 14.2 Tier-Based Access Control
- **Tier 1 (Basic)**: Email verification, ₦50k daily limit
- **Tier 2 (Verified)**: Phone + email, ₦200k daily limit
- **Tier 3 (Premium)**: Full KYC, ₦1M daily limit

### 14.3 Compliance Features
- **Nigerian CBN Regulations**: BVN integration, KYC requirements
- **Data Protection**: GDPR-compliant data handling
- **Financial Compliance**: Transaction monitoring and reporting
- **Security Standards**: Industry-standard encryption and security

---

## 15. Technologies Used

### 15.1 Frontend Stack
- **React 18** (functional components, hooks, concurrent features)
- **Vite** (fast build tool and development server)
- **Redux Toolkit** (state management with RTK Query)
- **Tailwind CSS** (utility-first styling framework)
- **Framer Motion** (animations and transitions)
- **React Icons** (comprehensive icon library)
- **React Router** (client-side routing)

### 15.2 Supabase Stack
- **PostgreSQL 14+** (relational database)
- **Supabase Auth** (authentication and user management)
- **Row Level Security** (database-level access control)
- **Supabase Storage** (file storage with CDN)
- **Real-time** (live data synchronization)
- **PostgREST** (auto-generated REST API)

### 15.3 Backend Stack
- **Node.js 18+** (JavaScript runtime)
- **Express.js** (web application framework)
- **Supabase Client** (database and auth integration)
- **Multer** (multipart/form-data handling)
- **Winston** (logging library)
- **Helmet** (security middleware)
- **Express Rate Limit** (rate limiting)
- **Express Validator** (input validation)

---

## 16. Development & Deployment

### 16.1 Development Environment
- **Frontend**: `npm run dev` (Vite dev server on port 5173)
- **Backend**: `npm run dev` (Express server on port 5000)
- **Database**: Supabase cloud instance with development configuration
- **File Storage**: Local uploads directory with cloud storage integration

### 16.2 Environment Configuration
```env
# Frontend (.env)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BACKEND_URL=http://localhost:5000

# Backend (.env)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-key
PORT=5000
NODE_ENV=development
```

### 16.3 Deployment Architecture
- **Frontend**: Static hosting (Vercel, Netlify, or CDN)
- **Backend**: Container deployment (Docker, AWS ECS, or VPS)
- **Database**: Supabase managed PostgreSQL
- **File Storage**: Supabase Storage or AWS S3
- **Monitoring**: Health checks, logging, and error tracking

---

## 17. Integration Points for Backend

- **Authentication:**
  - Register, login, session, and token management
- **Account Management:**
  - Onboarding, KYC, tier upgrades, account info
- **Payments:**
  - Airtime, data, TV, electricity, school fees, virtual cards
- **Dashboard:**
  - Balances, transaction history, portfolio
- **Security:**
  - PIN, 2FA, password management
- **Vendor & Utility Services:**
  - Fetch vendor lists, process payments, confirm transactions

---

## 18. Data Flow & State Management

### 18.1 Frontend State Management
```
Redux Store Structure:
├── auth/                 # Authentication state
│   ├── user             # User profile and session
│   ├── isAuthenticated  # Authentication status
│   └── loading          # Loading states
├── transactions/        # Transaction history
├── accounts/           # Account information
└── kyc/               # KYC status and documents
```

### 18.2 Database State Management
```
Supabase Tables:
├── auth.users          # Supabase authentication
├── public.users        # Extended user profiles
├── public.accounts     # User accounts/wallets
├── public.transactions # Transaction records
├── public.kyc_documents # KYC verification files
└── public.notifications # User notifications
```

### 18.3 API State Management
```
Backend Services:
├── AuthMiddleware      # JWT validation and user context
├── KYCService         # Document verification logic
├── TransactionService # Payment processing logic
└── AccountService     # Account management logic
```

---

## 19. Recommendations for Backend Team

### 19.1 API Design Principles
- **RESTful APIs** for each modular service (auth, accounts, payments, utilities, notifications)
- **Consistent response format** across all endpoints
- **Comprehensive error handling** with meaningful error codes
- **Input validation** and sanitization for all requests
- **Rate limiting** to prevent abuse and ensure fair usage

### 19.2 Security Implementation
- **JWT token validation** with Supabase for all protected routes
- **Tier-based access control** for different account types and user levels
- **Input sanitization** to prevent injection attacks
- **Audit logging** for all financial transactions
- **Encryption** for sensitive data storage

### 19.3 Integration Requirements
- **Supabase client integration** for database operations
- **External API integration** for payment providers
- **File upload handling** for KYC documents
- **Real-time notifications** for transaction updates
- **Error monitoring** and logging systems

### 19.4 Performance Optimization
- **Database query optimization** with proper indexing
- **Caching strategies** for frequently accessed data
- **Connection pooling** for database connections
- **Asynchronous processing** for long-running operations
- **Load balancing** for high availability

---

## 20. Testing & Quality Assurance

### 20.1 Frontend Testing
- **Unit Tests**: Component testing with Vitest
- **Integration Tests**: API integration testing
- **E2E Tests**: User flow testing with Playwright
- **Authentication Tests**: Complete auth flow validation

### 20.2 Backend Testing
- **Unit Tests**: Service layer testing
- **Integration Tests**: API endpoint testing
- **Security Tests**: Authentication and authorization
- **Performance Tests**: Load and stress testing

### 20.3 Database Testing
- **Schema Validation**: Database structure verification
- **Trigger Testing**: Automatic profile creation validation
- **RLS Testing**: Row-level security policy verification
- **Performance Testing**: Query optimization validation

---

## 21. Monitoring & Observability

### 21.1 Frontend Monitoring
- **Error Tracking**: Client-side error monitoring
- **Performance Metrics**: Core Web Vitals tracking
- **User Analytics**: User behavior and flow analysis
- **Authentication Monitoring**: Login/logout event tracking

### 21.2 Backend Monitoring
- **API Monitoring**: Response times and error rates
- **Database Monitoring**: Query performance and connections
- **Security Monitoring**: Authentication failures and suspicious activity
- **Business Metrics**: Transaction success rates and volumes

### 21.3 Infrastructure Monitoring
- **Health Checks**: System availability monitoring
- **Resource Usage**: CPU, memory, and storage monitoring
- **Network Monitoring**: Latency and throughput tracking
- **Alert Systems**: Automated incident response

---

## 22. Summary

The eVault system represents a modern, production-ready fintech platform built with a strategic three-pronged architecture. This approach provides:

### 22.1 Architectural Benefits
- **Separation of Concerns**: Each layer has distinct responsibilities
- **Scalability**: Independent scaling of frontend, database, and backend
- **Security**: Multi-layer security with proper authentication and authorization
- **Maintainability**: Clear boundaries and modular design
- **Developer Experience**: Modern tooling and comprehensive documentation

### 22.2 Business Value
- **Nigerian Market Focus**: CBN compliance and local payment methods
- **Multi-tier KYC**: Progressive verification for regulatory compliance
- **Comprehensive Services**: Complete fintech solution from onboarding to payments
- **Production Ready**: Security, monitoring, and deployment strategies included
- **Extensible Design**: Easy to add new features and integrations

### 22.3 Technical Excellence
- **Modern Stack**: Latest versions of React, Node.js, and PostgreSQL
- **Security First**: JWT authentication, RLS, input validation, and audit logging
- **Performance Optimized**: Efficient queries, caching, and real-time updates
- **Well Documented**: Comprehensive documentation for all layers
- **Test Coverage**: Unit, integration, and E2E testing strategies

---

## 23. Documentation Structure

### 23.1 Frontend Documentation
- **Component Documentation**: Individual component files in `src/components/EvaultPlatform/`
- **State Management**: Redux store documentation in `src/components/EvaultPlatform/store/`
- **Testing Documentation**: Test files and reports in `src/tests/`
- **Integration Guides**: API integration examples and patterns

### 23.2 Supabase Documentation
- **Schema Documentation**: `documentations/supabase_setup/SUPABASE_SCHEMA_SETUP.md`
- **Database Schema**: `documentations/supabase_setup/complete-evault-schema.sql`
- **Authentication Guide**: Supabase Auth integration documentation
- **Security Policies**: RLS and security configuration guides

### 23.3 Backend Documentation
- **Comprehensive Guide**: `documentations/nodejs_backend/COMPREHENSIVE_BACKEND_DOCUMENTATION.md`
- **API Documentation**: `documentations/nodejs_backend/API_DOCUMENTATION.md`
- **Deployment Guide**: `documentations/nodejs_backend/DEPLOYMENT_GUIDE.md`
- **Service Documentation**: Individual service files in `backend/services/`

---

## 24. Getting Started

### 24.1 Quick Start Guide
1. **Clone Repository**: `git clone <repository-url>`
2. **Setup Frontend**: `npm install && npm run dev`
3. **Setup Supabase**: Run schema from `complete-evault-schema.sql`
4. **Setup Backend**: `cd backend && npm install && npm run dev`
5. **Configure Environment**: Update `.env` files with your credentials

### 24.2 Development Workflow
1. **Frontend Development**: Component development and testing
2. **Database Changes**: Schema updates and migration scripts
3. **Backend Development**: API development and business logic
4. **Integration Testing**: End-to-end flow validation
5. **Deployment**: Production deployment and monitoring

### 24.3 Key Resources
- **Frontend**: React components in `src/components/EvaultPlatform/`
- **Database**: Schema files in `documentations/supabase_setup/`
- **Backend**: Services and routes in `backend/`
- **Documentation**: Comprehensive guides in `documentations/`
- **Testing**: Test suites in `src/tests/` and `backend/tests/`

---

**Architecture Version**: 2.0.0  
**Last Updated**: 28th August, 2025 - 13:32  
**Maintained by**: eVault Development Team  - [Lycan-Xx](https://github.com/Lycan-Xx) Says hi.. 👋🏽 (: 👾

For detailed implementation guides, refer to the specific documentation files in each layer's directory.
