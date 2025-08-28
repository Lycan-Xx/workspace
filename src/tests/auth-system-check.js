/**
 * Authentication System Check
 * 
 * This script performs a quick validation of the authentication system
 * using the actual Supabase configuration to verify functionality.
 */

// Test configuration
const testConfig = {
  supabaseConnected: false,
  apiServiceLoaded: false,
  authSliceLoaded: false,
  validationResults: {
    connection: false,
    signup: false,
    login: false,
    session: false,
    logout: false
  }
};

// Helper function to log results
const logResult = (test, passed, details = '') => {
  const emoji = passed ? '✅' : '❌';
  console.log(`${emoji} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  if (details) console.log(`   ${details}`);
};

// Test 1: Check Supabase Connection
const checkSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase Connection...');
    
    const { supabase } = await import('../lib/supabase.js');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      logResult('Supabase Connection', false, `Error: ${error.message}`);
      return false;
    }
    
    logResult('Supabase Connection', true, 'Successfully connected to Supabase');
    testConfig.supabaseConnected = true;
    return true;
  } catch (error) {
    logResult('Supabase Connection', false, `Import Error: ${error.message}`);
    return false;
  }
};

// Test 2: Check API Service Loading
const checkApiService = async () => {
  try {
    console.log('🔍 Testing API Service...');
    
    const { apiService } = await import('../services/api.js');
    
    if (!apiService) {
      logResult('API Service Loading', false, 'API Service not found');
      return false;
    }
    
    // Check if required methods exist
    const requiredMethods = ['signup', 'login', 'logout', 'initializeAuth'];
    const missingMethods = requiredMethods.filter(method => typeof apiService[method] !== 'function');
    
    if (missingMethods.length > 0) {
      logResult('API Service Loading', false, `Missing methods: ${missingMethods.join(', ')}`);
      return false;
    }
    
    logResult('API Service Loading', true, 'All required methods available');
    testConfig.apiServiceLoaded = true;
    return true;
  } catch (error) {
    logResult('API Service Loading', false, `Import Error: ${error.message}`);
    return false;
  }
};// Test 3: Check Auth Slice Loading
const checkAuthSlice = async () => {
  try {
    console.log('🔍 Testing Auth Slice...');
    
    const authSlice = await import('../components/EvaultPlatform/store/authSlice.js');
    
    if (!authSlice.default) {
      logResult('Auth Slice Loading', false, 'Auth slice reducer not found');
      return false;
    }
    
    // Check if required actions exist
    const requiredActions = ['loginSuccess', 'loginFailure', 'logout', 'signupSuccess'];
    const actions = Object.keys(authSlice);
    const missingActions = requiredActions.filter(action => !actions.includes(action));
    
    if (missingActions.length > 0) {
      logResult('Auth Slice Loading', false, `Missing actions: ${missingActions.join(', ')}`);
      return false;
    }
    
    logResult('Auth Slice Loading', true, 'All required actions available');
    testConfig.authSliceLoaded = true;
    return true;
  } catch (error) {
    logResult('Auth Slice Loading', false, `Import Error: ${error.message}`);
    return false;
  }
};

// Test 4: Validate Authentication Flow (Basic)
const validateAuthFlow = async () => {
  if (!testConfig.supabaseConnected || !testConfig.apiServiceLoaded) {
    logResult('Authentication Flow', false, 'Prerequisites not met');
    return false;
  }
  
  try {
    console.log('🔍 Testing Authentication Flow...');
    
    const { apiService } = await import('../services/api.js');
    
    // Test 1: Validate error handling for invalid data
    const invalidSignup = await apiService.signup({
      email: 'invalid-email',
      password: 'test'
    });
    
    if (invalidSignup.success) {
      logResult('Input Validation', false, 'Should reject invalid email');
      return false;
    }
    
    logResult('Input Validation', true, 'Properly validates input data');
    
    // Test 2: Check session initialization
    const initResult = await apiService.initializeAuth();
    
    if (typeof initResult.success !== 'boolean') {
      logResult('Session Initialization', false, 'Invalid response format');
      return false;
    }
    
    logResult('Session Initialization', true, 'Session initialization working');
    
    testConfig.validationResults.signup = true;
    testConfig.validationResults.session = true;
    return true;
    
  } catch (error) {
    logResult('Authentication Flow', false, `Error: ${error.message}`);
    return false;
  }
};

// Main test runner
const runAuthSystemCheck = async () => {
  console.log('🚀 Starting Authentication System Check\n');
  console.log('='.repeat(50));
  
  const results = {
    connection: await checkSupabaseConnection(),
    apiService: await checkApiService(),
    authSlice: await checkAuthSlice(),
    authFlow: false
  };
  
  if (results.connection && results.apiService) {
    results.authFlow = await validateAuthFlow();
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Authentication System Check Results:');
  console.log('='.repeat(50));
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  console.log(`\n📈 Summary:`);
  console.log(`   Total Checks: ${totalTests}`);
  console.log(`   Passed: ${passedTests}`);
  console.log(`   Failed: ${totalTests - passedTests}`);
  console.log(`   Success Rate: ${successRate}%`);
  
  console.log(`\n📋 Component Status:`);
  console.log(`   ✓ Supabase Connection: ${results.connection ? 'WORKING' : 'FAILED'}`);
  console.log(`   ✓ API Service: ${results.apiService ? 'LOADED' : 'FAILED'}`);
  console.log(`   ✓ Auth Slice: ${results.authSlice ? 'LOADED' : 'FAILED'}`);
  console.log(`   ✓ Authentication Flow: ${results.authFlow ? 'WORKING' : 'FAILED'}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All authentication system components are working correctly!');
    console.log('✅ The system is ready for user testing.');
  } else {
    console.log('\n⚠️  Some components need attention:');
    if (!results.connection) console.log('   - Check Supabase configuration and network connectivity');
    if (!results.apiService) console.log('   - Verify API service implementation');
    if (!results.authSlice) console.log('   - Check Redux auth slice configuration');
    if (!results.authFlow) console.log('   - Review authentication flow logic');
  }
  
  console.log('\n📝 Next Steps:');
  console.log('   1. Address any failed components');
  console.log('   2. Test with real user accounts in the browser');
  console.log('   3. Verify session persistence across page refreshes');
  console.log('   4. Test both personal and business account creation');
  
  return results;
};

// Export for use in browser console or other scripts
if (typeof window !== 'undefined') {
  window.runAuthSystemCheck = runAuthSystemCheck;
}

export { runAuthSystemCheck };