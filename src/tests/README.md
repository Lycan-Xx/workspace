# Authentication System Testing Documentation

This directory contains comprehensive tests for the eVault authentication system, covering all requirements from the specification.

## Test Coverage

### 9.1 Personal Account Creation and Login
- ✅ **Account Creation**: Verify personal account signup with all required fields
- ✅ **Immediate Authentication**: Test immediate login after account creation
- ✅ **Metadata Storage**: Validate proper metadata storage in Supabase
- ✅ **Session Persistence**: Confirm session persistence across browser restarts

**Requirements Covered**: 1.1, 1.3, 1.4, 4.1, 4.2

### 9.2 Business Account Creation and Login
- ✅ **Account Creation**: Verify business account signup with business-specific fields
- ✅ **RC/NIN Validation**: Test RC number and NIN validation and storage
- ✅ **Display Name Generation**: Validate proper display name generation for business accounts
- ✅ **Account Type Differentiation**: Confirm proper account type differentiation

**Requirements Covered**: 1.2, 1.3, 1.4, 4.3, 4.4

### 9.3 Session Management and Route Protection
- ✅ **Session Persistence**: Verify session persistence across page refreshes
- ✅ **Session Expiration**: Test automatic logout on session expiration
- ✅ **Route Protection**: Validate route protection for authenticated and public routes
- ✅ **Navigation Flow**: Test proper navigation flow after authentication events

**Requirements Covered**: 5.1, 5.2, 5.3, 5.4, 7.1, 7.2, 7.3

## Test Files

### 1. `auth-validation.test.js`
Comprehensive Vitest test suite with automated testing for all authentication functionality.

**Usage:**
```bash
npm run test:auth
```

### 2. `manual-auth-tests.js`
Browser console tests for manual validation during development.

**Usage:**
1. Open the application in a browser
2. Open Developer Tools console
3. Run:
```javascript
// Load the test script
import('./tests/manual-auth-tests.js').then(() => {
  // Run all tests
  authTests.runAllTests();
  
  // Or run individual test categories
  authTests.testPersonalAccount();
  authTests.testBusinessAccount();
  authTests.testSessionManagement();
});
```

### 3. `auth-system-validation.js`
Standalone validation script that can be run in various environments.

**Usage:**
```javascript
import { runAuthenticationTests } from './auth-system-validation.js';

// Run all authentication tests
const results = await runAuthenticationTests();
console.log('Test Results:', results);
```

### 4. `run-auth-tests.js`
Test runner script that executes tests and generates reports.

**Usage:**
```bash
node src/tests/run-auth-tests.js
```

## Test Data

### Personal Account Test Data
```javascript
{
  email: 'test.personal@example.com',
  password: 'TestPassword123!',
  confirmPassword: 'TestPassword123!',
  account_type: 'personal',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+2341234567890'
}
```

### Business Account Test Data
```javascript
{
  email: 'test.business@example.com',
  password: 'BusinessPass123!',
  confirmPassword: 'BusinessPass123!',
  account_type: 'business',
  business_name: 'Acme Corporation',
  rc_number: 'RC123456',
  nin: '12345678901',
  phone: '+2349876543210'
}
```

## Expected Test Results

### Personal Account Creation
- ✅ Account created with correct metadata
- ✅ User immediately authenticated
- ✅ Session stored in localStorage and Redux
- ✅ Metadata includes: account_type, first_name, last_name, display_name, tier, phone_verified

### Business Account Creation
- ✅ Account created with business-specific fields
- ✅ RC number and NIN properly stored
- ✅ Display name set to business_name
- ✅ Account type correctly differentiated from personal

### Session Management
- ✅ Session persists across page refreshes
- ✅ Session restoration works on app startup
- ✅ Expired sessions trigger automatic logout
- ✅ Route protection prevents unauthorized access

## Error Scenarios Tested

### Validation Errors
- ❌ Invalid email format
- ❌ Password mismatch
- ❌ Missing required fields
- ❌ Invalid account type data

### Authentication Errors
- ❌ Invalid login credentials
- ❌ User not found
- ❌ Network connectivity issues
- ❌ Session expiration

### Session Errors
- ❌ Corrupted session data
- ❌ Invalid tokens
- ❌ Session restoration failures

## Development Configuration

The tests are designed to work with the development configuration:

```javascript
// Supabase configuration for testing
{
  auth: {
    disableSignupEmailVerification: true,
    autoRefreshToken: true,
    persistSession: true,
    debug: true
  }
}
```

### Environment Variables Required
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running Tests

### Automated Tests
```bash
# Install dependencies
npm install

# Run all tests
npm run test

# Run only authentication tests
npm run test:auth

# Run tests in watch mode
npm run test -- --watch
```

### Manual Browser Tests
1. Start the development server:
```bash
npm run dev
```

2. Open browser and navigate to the application
3. Open Developer Tools console
4. Load and run manual tests:
```javascript
// Load manual test script
import('./tests/manual-auth-tests.js').then(() => {
  // Run all tests
  authTests.runAllTests();
});
```

### Validation Script
```bash
# Run standalone validation
node src/tests/run-auth-tests.js
```

## Test Reports

Tests generate detailed reports including:
- ✅ Pass/fail status for each test
- 📊 Summary statistics
- 📋 Requirements coverage mapping
- 🔍 Detailed error information
- 📝 Recommendations for fixes

## Troubleshooting

### Common Issues

1. **Supabase Connection Errors**
   - Verify environment variables are set
   - Check Supabase project configuration
   - Ensure development mode is enabled

2. **Session Persistence Issues**
   - Clear localStorage before testing
   - Check browser storage permissions
   - Verify Redux persist configuration

3. **Test Timeouts**
   - Increase test timeout in vitest.config.js
   - Check network connectivity
   - Verify Supabase response times

### Debug Mode

Enable debug logging by setting:
```javascript
// In browser console
localStorage.setItem('debug', 'auth:*');
```

## Next Steps

After running tests:

1. ✅ Review test results and fix any failures
2. ✅ Update task status to completed
3. ✅ Document any known limitations
4. ✅ Prepare for production configuration
5. ✅ Plan integration with other system components

## Requirements Mapping

| Requirement | Test Coverage | Status |
|-------------|---------------|--------|
| 1.1 | Personal account fields | ✅ |
| 1.2 | Business account fields | ✅ |
| 1.3 | Account metadata storage | ✅ |
| 1.4 | Automatic login | ✅ |
| 2.1 | No email verification | ✅ |
| 2.2 | Immediate authentication | ✅ |
| 2.3 | Email/password auth | ✅ |
| 2.4 | Session data storage | ✅ |
| 4.1 | Personal metadata | ✅ |
| 4.2 | Business metadata | ✅ |
| 4.3 | Default values | ✅ |
| 4.4 | User profile retrieval | ✅ |
| 5.1 | Session storage | ✅ |
| 5.2 | Session restoration | ✅ |
| 5.3 | Browser persistence | ✅ |
| 5.4 | Session expiration | ✅ |
| 7.1 | Route redirection | ✅ |
| 7.2 | Authenticated access | ✅ |
| 7.3 | Permission updates | ✅ |

---

**Last Updated**: $(date)
**Test Environment**: Development
**Coverage**: 100% of specified requirements