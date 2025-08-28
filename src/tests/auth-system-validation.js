/**
 * Authentication System Validation Script
 * 
 * This script validates the authentication system by testing core functionality
 * Requirements covered: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 7.1, 7.2, 7.3
 */

// Test results tracking
const testResults = {
  personal: {
    creation: false,
    immediateAuth: false,
    metadataStorage: false,
    sessionPersistence: false
  },
  business: {
    creation: false,
    rcNinValidation: false,
    displayNameGeneration: false,
    accountTypeDifferentiation: false
  },
  session: {
    persistence: false,
    expiration: false,
    routeProtection: false,
    navigationFlow: false
  },
  summary: {
    total: 0,
    passed: 0,
    failed: 0
  }
};

// Helper functions
const logTest = (category, test, passed, details = '') => {
  const emoji = passed ? '✅' : '❌';
  const status = passed ? 'PASSED' : 'FAILED';
  
  console.log(`${emoji} ${category}.${test}: ${status}`);
  if (details) {
    console.log(`   ${details}`);
  }
  
  testResults.summary.total++;
  if (passed) {
    testResults.summary.passed++;
    if (testResults[category]) {
      testResults[category][test] = true;
    }
  } else {
    testResults.summary.failed++;
  }
};

const generateUniqueEmail = (prefix = 'test') => {
  return `${prefix}.${Date.now()}.${Math.random().toString(36).substr(2, 5)}@example.com`;
};

// Test data generators
const createPersonalAccountData = (overrides = {}) => ({
  email: generateUniqueEmail('personal'),
  password: 'TestPassword123!',
  confirmPassword: 'TestPassword123!',
  account_type: 'personal',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+2341234567890',
  referral_code: 'REF123',
  ...overrides
});

const createBusinessAccountData = (overrides = {}) => ({
  email: generateUniqueEmail('business'),
  password: 'BusinessPass123!',
  confirmPassword: 'BusinessPass123!',
  account_type: 'business',
  business_name: 'Acme Corporation',
  rc_number: 'RC123456',
  nin: '12345678901',
  phone: '+2349876543210',
  referral_code: 'BIZREF456',
  ...overrides
});

// Test 9.1: Personal Account Creation and Login
const testPersonalAccountCreation = async () => {
  console.log('\n🧪 Testing Personal Account Creation and Login...\n');
  
  try {
    // Import services
    const { apiService } = await import('../services/api.js');
    const { supabase } = await import('../lib/supabase.js');
    
    // Clear any existing session
    await supabase.auth.signOut();
    localStorage.clear();
    
    const personalData = createPersonalAccountData();
    
    // Test 1: Create personal account with all required fields
    console.log('Test 1: Creating personal account with required fields...');
    const signupResult = await apiService.signup(personalData);
    
    const creationSuccess = signupResult.success && 
                           signupResult.user &&
                           signupResult.user.email === personalData.email &&
                           signupResult.user.role === 'personal' &&
                           signupResult.user.first_name === personalData.first_name &&
                           signupResult.user.last_name === personalData.last_name;
    
    logTest('personal', 'creation', creationSuccess, 
      creationSuccess ? `Account created for ${signupResult.user.email}` : `Failed: ${signupResult.error}`);
    
    if (!creationSuccess) return;
    
    // Test 2: Verify immediate authentication after account creation
    console.log('Test 2: Verifying immediate authentication...');
    const immediateAuthSuccess = signupResult.immediateAuth && 
                                signupResult.session &&
                                signupResult.user.loginTime;
    
    logTest('personal', 'immediateAuth', immediateAuthSuccess,
      immediateAuthSuccess ? 'User authenticated immediately after signup' : 'Immediate authentication failed');
    
    // Test 3: Validate proper metadata storage in Supabase
    console.log('Test 3: Validating metadata storage...');
    const { data: { user } } = await supabase.auth.getUser();
    
    const metadataValid = user &&
                         user.user_metadata.account_type === 'personal' &&
                         user.user_metadata.first_name === personalData.first_name &&
                         user.user_metadata.last_name === personalData.last_name &&
                         user.user_metadata.display_name === `${personalData.first_name} ${personalData.last_name}` &&
                         user.user_metadata.tier === 1 &&
                         user.user_metadata.phone_verified === false;
    
    logTest('personal', 'metadataStorage', metadataValid,
      metadataValid ? 'All metadata stored correctly in Supabase' : 'Metadata storage validation failed');
    
    // Test 4: Confirm session persistence across browser restarts
    console.log('Test 4: Testing session persistence...');
    
    // Store current session info
    const originalSession = await supabase.auth.getSession();
    const storedAuth = localStorage.getItem('auth');
    
    // Simulate browser restart by reinitializing auth
    const initResult = await apiService.initializeAuth();
    
    const persistenceSuccess = initResult.success &&
                              initResult.authenticated &&
                              initResult.user &&
                              initResult.user.email === personalData.email &&
                              !!storedAuth;
    
    logTest('personal', 'sessionPersistence', persistenceSuccess,
      persistenceSuccess ? 'Session persisted successfully' : 'Session persistence failed');
    
  } catch (error) {
    console.error('❌ Personal account test error:', error);
    logTest('personal', 'creation', false, `Error: ${error.message}`);
  }
};

// Test 9.2: Business Account Creation and Login
const testBusinessAccountCreation = async () => {
  console.log('\n🧪 Testing Business Account Creation and Login...\n');
  
  try {
    const { apiService } = await import('../services/api.js');
    const { supabase } = await import('../lib/supabase.js');
    
    // Clear any existing session
    await supabase.auth.signOut();
    localStorage.clear();
    
    const businessData = createBusinessAccountData();
    
    // Test 1: Create business account with business-specific fields
    console.log('Test 1: Creating business account with business fields...');
    const signupResult = await apiService.signup(businessData);
    
    const creationSuccess = signupResult.success &&
                           signupResult.user &&
                           signupResult.user.email === businessData.email &&
                           signupResult.user.role === 'business' &&
                           signupResult.user.business_name === businessData.business_name;
    
    logTest('business', 'creation', creationSuccess,
      creationSuccess ? `Business account created for ${signupResult.user.business_name}` : `Failed: ${signupResult.error}`);
    
    if (!creationSuccess) return;
    
    // Test 2: Verify RC number and NIN validation and storage
    console.log('Test 2: Validating RC number and NIN storage...');
    const { data: { user } } = await supabase.auth.getUser();
    
    const rcNinValid = user &&
                      user.user_metadata.rc_number === businessData.rc_number &&
                      user.user_metadata.nin === businessData.nin &&
                      user.user_metadata.business_name === businessData.business_name;
    
    logTest('business', 'rcNinValidation', rcNinValid,
      rcNinValid ? `RC: ${user.user_metadata.rc_number}, NIN: ${user.user_metadata.nin}` : 'RC/NIN validation failed');
    
    // Test 3: Validate proper display name generation for business accounts
    console.log('Test 3: Validating display name generation...');
    const displayNameValid = user &&
                             user.user_metadata.display_name === businessData.business_name &&
                             signupResult.user.name === businessData.business_name;
    
    logTest('business', 'displayNameGeneration', displayNameValid,
      displayNameValid ? `Display name: ${user.user_metadata.display_name}` : 'Display name generation failed');
    
    // Test 4: Confirm proper account type differentiation
    console.log('Test 4: Testing account type differentiation...');
    
    // Create a personal account to compare
    await supabase.auth.signOut();
    const personalData = createPersonalAccountData();
    const personalResult = await apiService.signup(personalData);
    
    const differentiationValid = personalResult.success &&
                                personalResult.user.role === 'personal' &&
                                personalResult.user.first_name &&
                                !personalResult.user.business_name;
    
    logTest('business', 'accountTypeDifferentiation', differentiationValid,
      differentiationValid ? 'Account types properly differentiated' : 'Account type differentiation failed');
    
  } catch (error) {
    console.error('❌ Business account test error:', error);
    logTest('business', 'creation', false, `Error: ${error.message}`);
  }
};

// Test 9.3: Session Management and Route Protection
const testSessionManagement = async () => {
  console.log('\n🧪 Testing Session Management and Route Protection...\n');
  
  try {
    const { apiService } = await import('../services/api.js');
    const { supabase } = await import('../lib/supabase.js');
    
    // Ensure we have an active session
    await supabase.auth.signOut();
    const testData = createPersonalAccountData();
    await apiService.signup(testData);
    
    // Test 1: Verify session persistence across page refreshes
    console.log('Test 1: Testing session persistence across page refreshes...');
    
    const { data: { session: originalSession } } = await supabase.auth.getSession();
    const originalToken = originalSession?.access_token;
    
    // Simulate page refresh by reinitializing
    const initResult = await apiService.initializeAuth();
    
    const { data: { session: restoredSession } } = await supabase.auth.getSession();
    
    const persistenceSuccess = initResult.success &&
                              initResult.authenticated &&
                              restoredSession &&
                              restoredSession.access_token === originalToken;
    
    logTest('session', 'persistence', persistenceSuccess,
      persistenceSuccess ? 'Session persisted across page refresh' : 'Session persistence failed');
    
    // Test 2: Test automatic logout on session expiration
    console.log('Test 2: Testing session expiration handling...');
    
    // Simulate session expiration by signing out
    await supabase.auth.signOut();
    
    const expiredInitResult = await apiService.initializeAuth();
    
    const expirationSuccess = expiredInitResult.success &&
                             !expiredInitResult.authenticated;
    
    logTest('session', 'expiration', expirationSuccess,
      expirationSuccess ? 'Session expiration handled correctly' : 'Session expiration handling failed');
    
    // Test 3: Validate route protection (simulated)
    console.log('Test 3: Testing route protection logic...');
    
    // Create new session for route protection test
    await apiService.signup(createPersonalAccountData());
    
    const { data: { session } } = await supabase.auth.getSession();
    const hasValidSession = !!session;
    
    // Test session validation
    const validationResult = await apiService.validateAndRefreshSession();
    
    const routeProtectionSuccess = hasValidSession && validationResult.success;
    
    logTest('session', 'routeProtection', routeProtectionSuccess,
      routeProtectionSuccess ? 'Route protection logic working' : 'Route protection failed');
    
    // Test 4: Test proper navigation flow after authentication events
    console.log('Test 4: Testing navigation flow...');
    
    // Test logout and cleanup
    const logoutResult = await apiService.logout();
    const { data: { session: afterLogout } } = await supabase.auth.getSession();
    const authCleared = !localStorage.getItem('auth');
    
    const navigationSuccess = logoutResult.success &&
                             !afterLogout &&
                             authCleared;
    
    logTest('session', 'navigationFlow', navigationSuccess,
      navigationSuccess ? 'Navigation flow working correctly' : 'Navigation flow failed');
    
  } catch (error) {
    console.error('❌ Session management test error:', error);
    logTest('session', 'persistence', false, `Error: ${error.message}`);
  }
};

// Generate test report
const generateTestReport = () => {
  console.log('\n' + '='.repeat(60));
  console.log('📊 AUTHENTICATION SYSTEM VALIDATION REPORT');
  console.log('='.repeat(60));
  
  console.log(`\n📈 Summary:`);
  console.log(`   Total Tests: ${testResults.summary.total}`);
  console.log(`   Passed: ${testResults.summary.passed}`);
  console.log(`   Failed: ${testResults.summary.failed}`);
  console.log(`   Success Rate: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%`);
  
  console.log(`\n📋 Detailed Results:`);
  
  console.log(`\n9.1 Personal Account Creation and Login:`);
  console.log(`   ✓ Account Creation: ${testResults.personal.creation ? 'PASSED' : 'FAILED'}`);
  console.log(`   ✓ Immediate Authentication: ${testResults.personal.immediateAuth ? 'PASSED' : 'FAILED'}`);
  console.log(`   ✓ Metadata Storage: ${testResults.personal.metadataStorage ? 'PASSED' : 'FAILED'}`);
  console.log(`   ✓ Session Persistence: ${testResults.personal.sessionPersistence ? 'PASSED' : 'FAILED'}`);
  
  console.log(`\n9.2 Business Account Creation and Login:`);
  console.log(`   ✓ Account Creation: ${testResults.business.creation ? 'PASSED' : 'FAILED'}`);
  console.log(`   ✓ RC/NIN Validation: ${testResults.business.rcNinValidation ? 'PASSED' : 'FAILED'}`);
  console.log(`   ✓ Display Name Generation: ${testResults.business.displayNameGeneration ? 'PASSED' : 'FAILED'}`);
  console.log(`   ✓ Account Type Differentiation: ${testResults.business.accountTypeDifferentiation ? 'PASSED' : 'FAILED'}`);
  
  console.log(`\n9.3 Session Management and Route Protection:`);
  console.log(`   ✓ Session Persistence: ${testResults.session.persistence ? 'PASSED' : 'FAILED'}`);
  console.log(`   ✓ Session Expiration: ${testResults.session.expiration ? 'PASSED' : 'FAILED'}`);
  console.log(`   ✓ Route Protection: ${testResults.session.routeProtection ? 'PASSED' : 'FAILED'}`);
  console.log(`   ✓ Navigation Flow: ${testResults.session.navigationFlow ? 'PASSED' : 'FAILED'}`);
  
  console.log('\n' + '='.repeat(60));
  
  const allPassed = testResults.summary.failed === 0;
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! Authentication system is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please review the results above.');
  }
  
  console.log('\n📝 Requirements Coverage:');
  console.log('   ✓ 1.1, 1.3, 1.4: Personal account creation and metadata');
  console.log('   ✓ 1.2, 1.3, 1.4: Business account creation and metadata');
  console.log('   ✓ 2.1, 2.2: Immediate authentication without email verification');
  console.log('   ✓ 4.1, 4.2: Personal and business account data management');
  console.log('   ✓ 4.3, 4.4: Account type differentiation and validation');
  console.log('   ✓ 5.1, 5.2, 5.3, 5.4: Session management and persistence');
  console.log('   ✓ 7.1, 7.2, 7.3: Route protection and navigation');
  
  return testResults;
};

// Main test runner
const runAuthenticationTests = async () => {
  console.log('🚀 Starting Authentication System Validation');
  console.log('Testing Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 7.1, 7.2, 7.3');
  console.log('='.repeat(60));
  
  try {
    await testPersonalAccountCreation();
    await testBusinessAccountCreation();
    await testSessionManagement();
    
    const results = generateTestReport();
    
    return results;
  } catch (error) {
    console.error('❌ Test runner error:', error);
    return testResults;
  }
};

// Export for use in other contexts
if (typeof window !== 'undefined') {
  window.runAuthenticationTests = runAuthenticationTests;
  window.authTestResults = testResults;
}

export { runAuthenticationTests, testResults };