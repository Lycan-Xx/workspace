/**
 * Manual Authentication Testing Script
 * 
 * This script can be run in the browser console to manually test
 * the authentication system functionality.
 * 
 * Usage: Copy and paste sections into browser console while app is running
 */

// Test data
const testData = {
  personal: {
    email: 'test.personal@example.com',
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!',
    account_type: 'personal',
    first_name: 'Test',
    last_name: 'User',
    phone: '+2341234567890'
  },
  business: {
    email: 'test.business@example.com',
    password: 'BusinessPass123!',
    confirmPassword: 'BusinessPass123!',
    account_type: 'business',
    business_name: 'Test Business Corp',
    rc_number: 'RC123456',
    nin: '12345678901',
    phone: '+2349876543210'
  }
};

// Helper function to log test results
const logTestResult = (testName, success, data = null, error = null) => {
  const emoji = success ? '✅' : '❌';
  console.log(`${emoji} ${testName}`);
  if (data) console.log('Data:', data);
  if (error) console.error('Error:', error);
  console.log('---');
};

// Test 1: Personal Account Creation and Login
const testPersonalAccount = async () => {
  console.log('🧪 Starting Personal Account Tests...\n');
  
  try {
    // Import API service
    const { apiService } = await import('../services/api.js');
    
    // Test 1.1: Create personal account
    console.log('Test 1.1: Creating personal account...');
    const signupResult = await apiService.signup(testData.personal);
    
    logTestResult(
      'Personal Account Creation',
      signupResult.success,
      {
        email: signupResult.user?.email,
        name: signupResult.user?.name,
        role: signupResult.user?.role,
        immediateAuth: signupResult.immediateAuth
      },
      signupResult.error
    );
    
    if (!signupResult.success) return;
    
    // Test 1.2: Verify metadata storage
    console.log('Test 1.2: Verifying metadata storage...');
    const { supabase } = await import('../lib/supabase.js');
    const { data: { user } } = await supabase.auth.getUser();
    
    const metadataValid = 
      user.user_metadata.account_type === 'personal' &&
      user.user_metadata.first_name === testData.personal.first_name &&
      user.user_metadata.last_name === testData.personal.last_name &&
      user.user_metadata.display_name === `${testData.personal.first_name} ${testData.personal.last_name}`;
    
    logTestResult(
      'Personal Account Metadata Storage',
      metadataValid,
      {
        account_type: user.user_metadata.account_type,
        first_name: user.user_metadata.first_name,
        last_name: user.user_metadata.last_name,
        display_name: user.user_metadata.display_name,
        tier: user.user_metadata.tier,
        phone_verified: user.user_metadata.phone_verified
      }
    );
    
    // Test 1.3: Test logout and login
    console.log('Test 1.3: Testing logout and login...');
    await supabase.auth.signOut();
    
    const loginResult = await apiService.login({
      email: testData.personal.email,
      password: testData.personal.password
    });
    
    logTestResult(
      'Personal Account Login',
      loginResult.success,
      {
        email: loginResult.user?.email,
        role: loginResult.user?.role,
        hasSession: !!loginResult.session
      },
      loginResult.error
    );
    
    // Test 1.4: Test session persistence
    console.log('Test 1.4: Testing session persistence...');
    const initResult = await apiService.initializeAuth();
    
    logTestResult(
      'Session Persistence',
      initResult.success && initResult.authenticated,
      {
        authenticated: initResult.authenticated,
        email: initResult.user?.email,
        sessionRestored: !!initResult.user?.sessionRestoredAt
      }
    );
    
  } catch (error) {
    logTestResult('Personal Account Tests', false, null, error.message);
  }
};

// Test 2: Business Account Creation and Login
const testBusinessAccount = async () => {
  console.log('🧪 Starting Business Account Tests...\n');
  
  try {
    // Clear any existing session
    const { supabase } = await import('../lib/supabase.js');
    await supabase.auth.signOut();
    
    const { apiService } = await import('../services/api.js');
    
    // Test 2.1: Create business account
    console.log('Test 2.1: Creating business account...');
    const signupResult = await apiService.signup(testData.business);
    
    logTestResult(
      'Business Account Creation',
      signupResult.success,
      {
        email: signupResult.user?.email,
        businessName: signupResult.user?.business_name,
        role: signupResult.user?.role,
        rcNumber: signupResult.user?.rc_number,
        nin: signupResult.user?.nin
      },
      signupResult.error
    );
    
    if (!signupResult.success) return;
    
    // Test 2.2: Verify business metadata
    console.log('Test 2.2: Verifying business metadata...');
    const { data: { user } } = await supabase.auth.getUser();
    
    const businessMetadataValid = 
      user.user_metadata.account_type === 'business' &&
      user.user_metadata.business_name === testData.business.business_name &&
      user.user_metadata.rc_number === testData.business.rc_number &&
      user.user_metadata.nin === testData.business.nin &&
      user.user_metadata.display_name === testData.business.business_name;
    
    logTestResult(
      'Business Account Metadata Storage',
      businessMetadataValid,
      {
        account_type: user.user_metadata.account_type,
        business_name: user.user_metadata.business_name,
        rc_number: user.user_metadata.rc_number,
        nin: user.user_metadata.nin,
        display_name: user.user_metadata.display_name
      }
    );
    
    // Test 2.3: Test business login
    console.log('Test 2.3: Testing business account login...');
    await supabase.auth.signOut();
    
    const loginResult = await apiService.login({
      email: testData.business.email,
      password: testData.business.password
    });
    
    logTestResult(
      'Business Account Login',
      loginResult.success,
      {
        email: loginResult.user?.email,
        role: loginResult.user?.role,
        businessName: loginResult.user?.business_name
      },
      loginResult.error
    );
    
  } catch (error) {
    logTestResult('Business Account Tests', false, null, error.message);
  }
};

// Test 3: Session Management
const testSessionManagement = async () => {
  console.log('🧪 Starting Session Management Tests...\n');
  
  try {
    const { apiService } = await import('../services/api.js');
    const { supabase } = await import('../lib/supabase.js');
    
    // Ensure we have an active session
    let { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('Creating test session...');
      await apiService.signup({
        ...testData.personal,
        email: 'session.test@example.com'
      });
    }
    
    // Test 3.1: Session validation
    console.log('Test 3.1: Testing session validation...');
    const validationResult = await apiService.validateAndRefreshSession();
    
    logTestResult(
      'Session Validation',
      validationResult.success,
      {
        hasSession: !!validationResult.session,
        sessionValid: validationResult.success
      },
      validationResult.error
    );
    
    // Test 3.2: Session persistence check
    console.log('Test 3.2: Testing session persistence...');
    const storedAuth = localStorage.getItem('auth');
    const hasStoredAuth = !!storedAuth;
    
    logTestResult(
      'Session Storage',
      hasStoredAuth,
      {
        hasStoredAuth,
        storageKey: 'auth'
      }
    );
    
    // Test 3.3: Session restoration
    console.log('Test 3.3: Testing session restoration...');
    const initResult = await apiService.initializeAuth();
    
    logTestResult(
      'Session Restoration',
      initResult.success,
      {
        authenticated: initResult.authenticated,
        hasUser: !!initResult.user,
        email: initResult.user?.email
      }
    );
    
    // Test 3.4: Logout cleanup
    console.log('Test 3.4: Testing logout cleanup...');
    const logoutResult = await apiService.logout();
    
    const { data: { session: afterLogout } } = await supabase.auth.getSession();
    const authCleared = !localStorage.getItem('auth');
    
    logTestResult(
      'Logout Cleanup',
      logoutResult.success && !afterLogout && authCleared,
      {
        logoutSuccess: logoutResult.success,
        sessionCleared: !afterLogout,
        storageCleared: authCleared
      }
    );
    
  } catch (error) {
    logTestResult('Session Management Tests', false, null, error.message);
  }
};

// Test 4: Error Handling
const testErrorHandling = async () => {
  console.log('🧪 Starting Error Handling Tests...\n');
  
  try {
    const { apiService } = await import('../services/api.js');
    
    // Test 4.1: Invalid email format
    console.log('Test 4.1: Testing invalid email format...');
    const invalidEmailResult = await apiService.signup({
      ...testData.personal,
      email: 'invalid-email-format'
    });
    
    logTestResult(
      'Invalid Email Handling',
      !invalidEmailResult.success && invalidEmailResult.error.includes('Invalid email'),
      { error: invalidEmailResult.error }
    );
    
    // Test 4.2: Password mismatch
    console.log('Test 4.2: Testing password mismatch...');
    const passwordMismatchResult = await apiService.signup({
      ...testData.personal,
      email: 'password.test@example.com',
      confirmPassword: 'DifferentPassword'
    });
    
    logTestResult(
      'Password Mismatch Handling',
      !passwordMismatchResult.success && passwordMismatchResult.error.includes('Passwords do not match'),
      { error: passwordMismatchResult.error }
    );
    
    // Test 4.3: Missing required fields
    console.log('Test 4.3: Testing missing required fields...');
    const missingFieldsResult = await apiService.signup({
      email: 'missing.fields@example.com',
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
      account_type: 'personal'
      // Missing first_name and last_name
    });
    
    logTestResult(
      'Missing Fields Handling',
      !missingFieldsResult.success,
      { error: missingFieldsResult.error }
    );
    
    // Test 4.4: Invalid login credentials
    console.log('Test 4.4: Testing invalid login credentials...');
    const invalidLoginResult = await apiService.login({
      email: 'nonexistent@example.com',
      password: 'wrongpassword'
    });
    
    logTestResult(
      'Invalid Login Handling',
      !invalidLoginResult.success,
      { error: invalidLoginResult.error }
    );
    
  } catch (error) {
    logTestResult('Error Handling Tests', false, null, error.message);
  }
};

// Test 5: Complete User Journey
const testCompleteUserJourney = async () => {
  console.log('🧪 Starting Complete User Journey Test...\n');
  
  try {
    const { apiService } = await import('../services/api.js');
    const { supabase } = await import('../lib/supabase.js');
    
    // Clear any existing session
    await supabase.auth.signOut();
    localStorage.clear();
    
    const journeyEmail = 'journey.test@example.com';
    const journeyData = {
      ...testData.personal,
      email: journeyEmail
    };
    
    // Step 1: Signup
    console.log('Journey Step 1: Signup...');
    const signupResult = await apiService.signup(journeyData);
    const signupSuccess = signupResult.success && signupResult.immediateAuth;
    
    // Step 2: Verify session
    console.log('Journey Step 2: Verify active session...');
    const { data: { session } } = await supabase.auth.getSession();
    const hasActiveSession = !!session;
    
    // Step 3: Get user profile
    console.log('Journey Step 3: Get user profile...');
    const profileResult = await apiService.getCurrentUser();
    const profileSuccess = profileResult.success && profileResult.user.email === journeyEmail;
    
    // Step 4: Logout
    console.log('Journey Step 4: Logout...');
    const logoutResult = await apiService.logout();
    const logoutSuccess = logoutResult.success;
    
    // Step 5: Login again
    console.log('Journey Step 5: Login again...');
    const loginResult = await apiService.login({
      email: journeyEmail,
      password: journeyData.password
    });
    const loginSuccess = loginResult.success;
    
    // Step 6: Session restoration
    console.log('Journey Step 6: Test session restoration...');
    const initResult = await apiService.initializeAuth();
    const restorationSuccess = initResult.success && initResult.authenticated;
    
    const journeySuccess = signupSuccess && hasActiveSession && profileSuccess && 
                          logoutSuccess && loginSuccess && restorationSuccess;
    
    logTestResult(
      'Complete User Journey',
      journeySuccess,
      {
        signup: signupSuccess,
        activeSession: hasActiveSession,
        profile: profileSuccess,
        logout: logoutSuccess,
        login: loginSuccess,
        restoration: restorationSuccess
      }
    );
    
  } catch (error) {
    logTestResult('Complete User Journey', false, null, error.message);
  }
};

// Main test runner
const runAllTests = async () => {
  console.log('🚀 Starting Authentication System Validation Tests\n');
  console.log('='.repeat(50));
  
  await testPersonalAccount();
  console.log('\n' + '='.repeat(50));
  
  await testBusinessAccount();
  console.log('\n' + '='.repeat(50));
  
  await testSessionManagement();
  console.log('\n' + '='.repeat(50));
  
  await testErrorHandling();
  console.log('\n' + '='.repeat(50));
  
  await testCompleteUserJourney();
  console.log('\n' + '='.repeat(50));
  
  console.log('✅ All authentication tests completed!');
  console.log('Check the console output above for detailed results.');
};

// Export functions for individual testing
window.authTests = {
  runAllTests,
  testPersonalAccount,
  testBusinessAccount,
  testSessionManagement,
  testErrorHandling,
  testCompleteUserJourney,
  testData
};

// Instructions
console.log(`
🧪 Authentication Testing Script Loaded!

Available test functions:
- authTests.runAllTests() - Run all tests
- authTests.testPersonalAccount() - Test personal account creation and login
- authTests.testBusinessAccount() - Test business account creation and login  
- authTests.testSessionManagement() - Test session persistence and management
- authTests.testErrorHandling() - Test error scenarios
- authTests.testCompleteUserJourney() - Test complete user flow

Usage:
1. Open browser console
2. Run: authTests.runAllTests()
3. Or run individual tests as needed

Test data is available at: authTests.testData
`);

export { runAllTests, testPersonalAccount, testBusinessAccount, testSessionManagement, testErrorHandling, testCompleteUserJourney };