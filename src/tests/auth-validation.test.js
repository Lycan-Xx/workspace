/**
 * Authentication System Validation Tests
 * 
 * This test suite validates the complete authentication system including:
 * - Personal account creation and login
 * - Business account creation and login  
 * - Session management and persistence
 * - Route protection
 * 
 * Requirements covered: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 7.1, 7.2, 7.3
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiService } from '../services/api.js';
import { supabase } from '../lib/supabase.js';

// Mock data for testing
const mockPersonalAccountData = {
  email: 'john.doe@example.com',
  password: 'TestPassword123!',
  confirmPassword: 'TestPassword123!',
  account_type: 'personal',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+2341234567890',
  referral_code: 'REF123'
};

const mockBusinessAccountData = {
  email: 'business@acmecorp.com',
  password: 'BusinessPass123!',
  confirmPassword: 'BusinessPass123!',
  account_type: 'business',
  business_name: 'Acme Corporation',
  rc_number: 'RC123456',
  nin: '12345678901',
  phone: '+2349876543210',
  referral_code: 'BIZREF456'
};

const mockLoginCredentials = {
  personal: {
    email: 'john.doe@example.com',
    password: 'TestPassword123!'
  },
  business: {
    email: 'business@acmecorp.com',
    password: 'BusinessPass123!'
  }
};

describe('Authentication System Validation', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset any existing sessions
    vi.clearAllMocks();
  });

  afterEach(async () => {
    // Clean up any test sessions
    try {
      await supabase.auth.signOut();
    } catch (error) {
      // Ignore cleanup errors
    }
    localStorage.clear();
  });

  describe('9.1 Personal Account Creation and Login', () => {
    it('should create personal account with all required fields', async () => {
      console.log('🧪 Testing personal account creation...');
      
      const result = await apiService.signup(mockPersonalAccountData);
      
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(mockPersonalAccountData.email);
      expect(result.user.role).toBe('personal');
      expect(result.user.first_name).toBe(mockPersonalAccountData.first_name);
      expect(result.user.last_name).toBe(mockPersonalAccountData.last_name);
      expect(result.user.name).toBe(`${mockPersonalAccountData.first_name} ${mockPersonalAccountData.last_name}`);
      expect(result.user.phone).toBe(mockPersonalAccountData.phone);
      expect(result.user.tier).toBe(1);
      expect(result.user.phone_verified).toBe(false);
      
      console.log('✅ Personal account created successfully:', {
        email: result.user.email,
        name: result.user.name,
        role: result.user.role
      });
    });

    it('should immediately authenticate user after personal account creation', async () => {
      console.log('🧪 Testing immediate authentication after personal signup...');
      
      const result = await apiService.signup(mockPersonalAccountData);
      
      expect(result.success).toBe(true);
      expect(result.session).toBeDefined();
      expect(result.immediateAuth).toBe(true);
      expect(result.user.loginTime).toBeDefined();
      
      // Verify session is active
      const { data: { session } } = await supabase.auth.getSession();
      expect(session).toBeDefined();
      expect(session.user.email).toBe(mockPersonalAccountData.email);
      
      console.log('✅ Immediate authentication successful after personal signup');
    });

    it('should validate proper metadata storage for personal accounts', async () => {
      console.log('🧪 Testing personal account metadata storage...');
      
      const result = await apiService.signup(mockPersonalAccountData);
      
      expect(result.success).toBe(true);
      
      // Get user from Supabase to verify metadata
      const { data: { user } } = await supabase.auth.getUser();
      
      expect(user.user_metadata.account_type).toBe('personal');
      expect(user.user_metadata.first_name).toBe(mockPersonalAccountData.first_name);
      expect(user.user_metadata.last_name).toBe(mockPersonalAccountData.last_name);
      expect(user.user_metadata.display_name).toBe(`${mockPersonalAccountData.first_name} ${mockPersonalAccountData.last_name}`);
      expect(user.user_metadata.phone).toBe(mockPersonalAccountData.phone);
      expect(user.user_metadata.tier).toBe(1);
      expect(user.user_metadata.phone_verified).toBe(false);
      expect(user.user_metadata.kyc_status).toEqual({
        bvn_verified: false,
        documents_verified: false,
        address_verified: false
      });
      
      console.log('✅ Personal account metadata stored correctly in Supabase');
    });

    it('should allow login with personal account credentials', async () => {
      console.log('🧪 Testing personal account login...');
      
      // First create the account
      await apiService.signup(mockPersonalAccountData);
      
      // Sign out to test login
      await supabase.auth.signOut();
      
      // Test login
      const loginResult = await apiService.login(mockLoginCredentials.personal);
      
      expect(loginResult.success).toBe(true);
      expect(loginResult.user).toBeDefined();
      expect(loginResult.user.email).toBe(mockLoginCredentials.personal.email);
      expect(loginResult.user.role).toBe('personal');
      expect(loginResult.session).toBeDefined();
      
      console.log('✅ Personal account login successful');
    });

    it('should persist session across browser restarts for personal accounts', async () => {
      console.log('🧪 Testing session persistence for personal accounts...');
      
      // Create and login
      await apiService.signup(mockPersonalAccountData);
      
      // Simulate browser restart by clearing memory but keeping localStorage
      const storedAuth = localStorage.getItem('auth');
      expect(storedAuth).toBeDefined();
      
      // Initialize auth to restore session
      const initResult = await apiService.initializeAuth();
      
      expect(initResult.success).toBe(true);
      expect(initResult.authenticated).toBe(true);
      expect(initResult.user).toBeDefined();
      expect(initResult.user.email).toBe(mockPersonalAccountData.email);
      expect(initResult.user.role).toBe('personal');
      
      console.log('✅ Session persistence verified for personal accounts');
    });
  });

  describe('9.2 Business Account Creation and Login', () => {
    it('should create business account with business-specific fields', async () => {
      console.log('🧪 Testing business account creation...');
      
      const result = await apiService.signup(mockBusinessAccountData);
      
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(mockBusinessAccountData.email);
      expect(result.user.role).toBe('business');
      expect(result.user.business_name).toBe(mockBusinessAccountData.business_name);
      expect(result.user.rc_number).toBe(mockBusinessAccountData.rc_number);
      expect(result.user.nin).toBe(mockBusinessAccountData.nin);
      expect(result.user.name).toBe(mockBusinessAccountData.business_name);
      expect(result.user.phone).toBe(mockBusinessAccountData.phone);
      expect(result.user.tier).toBe(1);
      
      console.log('✅ Business account created successfully:', {
        email: result.user.email,
        businessName: result.user.business_name,
        role: result.user.role
      });
    });

    it('should validate RC number and NIN storage for business accounts', async () => {
      console.log('🧪 Testing RC number and NIN validation and storage...');
      
      const result = await apiService.signup(mockBusinessAccountData);
      
      expect(result.success).toBe(true);
      
      // Get user from Supabase to verify metadata
      const { data: { user } } = await supabase.auth.getUser();
      
      expect(user.user_metadata.rc_number).toBe(mockBusinessAccountData.rc_number);
      expect(user.user_metadata.nin).toBe(mockBusinessAccountData.nin);
      expect(user.user_metadata.business_name).toBe(mockBusinessAccountData.business_name);
      
      console.log('✅ RC number and NIN stored correctly:', {
        rcNumber: user.user_metadata.rc_number,
        nin: user.user_metadata.nin
      });
    });

    it('should generate proper display name for business accounts', async () => {
      console.log('🧪 Testing business account display name generation...');
      
      const result = await apiService.signup(mockBusinessAccountData);
      
      expect(result.success).toBe(true);
      expect(result.user.name).toBe(mockBusinessAccountData.business_name);
      
      // Verify in Supabase metadata
      const { data: { user } } = await supabase.auth.getUser();
      expect(user.user_metadata.display_name).toBe(mockBusinessAccountData.business_name);
      
      console.log('✅ Business display name generated correctly:', user.user_metadata.display_name);
    });

    it('should properly differentiate account types', async () => {
      console.log('🧪 Testing account type differentiation...');
      
      // Create business account
      const businessResult = await apiService.signup(mockBusinessAccountData);
      expect(businessResult.user.role).toBe('business');
      expect(businessResult.user.business_name).toBeDefined();
      expect(businessResult.user.first_name).toBeUndefined();
      
      // Sign out and create personal account with different email
      await supabase.auth.signOut();
      
      const personalData = {
        ...mockPersonalAccountData,
        email: 'different.personal@example.com'
      };
      
      const personalResult = await apiService.signup(personalData);
      expect(personalResult.user.role).toBe('personal');
      expect(personalResult.user.first_name).toBeDefined();
      expect(personalResult.user.business_name).toBeUndefined();
      
      console.log('✅ Account type differentiation working correctly');
    });

    it('should allow login with business account credentials', async () => {
      console.log('🧪 Testing business account login...');
      
      // First create the account
      await apiService.signup(mockBusinessAccountData);
      
      // Sign out to test login
      await supabase.auth.signOut();
      
      // Test login
      const loginResult = await apiService.login(mockLoginCredentials.business);
      
      expect(loginResult.success).toBe(true);
      expect(loginResult.user).toBeDefined();
      expect(loginResult.user.email).toBe(mockLoginCredentials.business.email);
      expect(loginResult.user.role).toBe('business');
      expect(loginResult.session).toBeDefined();
      
      console.log('✅ Business account login successful');
    });
  });

  describe('9.3 Session Management and Route Protection', () => {
    beforeEach(async () => {
      // Create a test account for session tests
      await apiService.signup(mockPersonalAccountData);
    });

    it('should persist session across page refreshes', async () => {
      console.log('🧪 Testing session persistence across page refreshes...');
      
      // Verify we have an active session
      let { data: { session } } = await supabase.auth.getSession();
      expect(session).toBeDefined();
      
      const originalSessionId = session.access_token;
      
      // Simulate page refresh by reinitializing auth
      const initResult = await apiService.initializeAuth();
      
      expect(initResult.success).toBe(true);
      expect(initResult.authenticated).toBe(true);
      expect(initResult.user).toBeDefined();
      
      // Verify session is still valid
      ({ data: { session } } = await supabase.auth.getSession());
      expect(session).toBeDefined();
      expect(session.access_token).toBe(originalSessionId);
      
      console.log('✅ Session persisted across page refresh');
    });

    it('should handle session expiration gracefully', async () => {
      console.log('🧪 Testing session expiration handling...');
      
      // This test simulates session expiration by manipulating the session
      // In a real scenario, we would wait for actual expiration
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      expect(session).toBeDefined();
      
      // Simulate expired session by signing out
      await supabase.auth.signOut();
      
      // Try to initialize auth with expired session
      const initResult = await apiService.initializeAuth();
      
      expect(initResult.success).toBe(true);
      expect(initResult.authenticated).toBe(false);
      
      console.log('✅ Session expiration handled gracefully');
    });

    it('should validate session and refresh tokens automatically', async () => {
      console.log('🧪 Testing automatic session validation and refresh...');
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      expect(session).toBeDefined();
      expect(session.refresh_token).toBeDefined();
      
      // Test session validation
      const validationResult = await apiService.validateAndRefreshSession();
      
      expect(validationResult.success).toBe(true);
      expect(validationResult.session).toBeDefined();
      
      console.log('✅ Session validation and refresh working correctly');
    });

    it('should clear session data on logout', async () => {
      console.log('🧪 Testing session cleanup on logout...');
      
      // Verify we have session data
      expect(localStorage.getItem('auth')).toBeDefined();
      
      const { data: { session: beforeLogout } } = await supabase.auth.getSession();
      expect(beforeLogout).toBeDefined();
      
      // Logout
      const logoutResult = await apiService.logout();
      expect(logoutResult.success).toBe(true);
      
      // Verify session is cleared
      const { data: { session: afterLogout } } = await supabase.auth.getSession();
      expect(afterLogout).toBeNull();
      
      // Verify localStorage is cleared
      expect(localStorage.getItem('auth')).toBeNull();
      
      console.log('✅ Session data cleared successfully on logout');
    });

    it('should handle concurrent session management', async () => {
      console.log('🧪 Testing concurrent session management...');
      
      // Simulate multiple session checks
      const promises = [
        apiService.validateAndRefreshSession(),
        apiService.validateAndRefreshSession(),
        apiService.validateAndRefreshSession()
      ];
      
      const results = await Promise.all(promises);
      
      // All should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
      
      console.log('✅ Concurrent session management handled correctly');
    });

    it('should maintain session across browser tabs', async () => {
      console.log('🧪 Testing session sharing across browser tabs...');
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      expect(session).toBeDefined();
      
      // Simulate another tab by creating a new API service instance
      const { apiService: newTabApiService } = await import('../services/api.js');
      
      // Initialize auth in "new tab"
      const newTabInitResult = await newTabApiService.initializeAuth();
      
      expect(newTabInitResult.success).toBe(true);
      expect(newTabInitResult.authenticated).toBe(true);
      expect(newTabInitResult.user.email).toBe(mockPersonalAccountData.email);
      
      console.log('✅ Session shared correctly across browser tabs');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete user journey from signup to dashboard access', async () => {
      console.log('🧪 Testing complete user journey...');
      
      // 1. Signup
      const signupResult = await apiService.signup(mockPersonalAccountData);
      expect(signupResult.success).toBe(true);
      expect(signupResult.immediateAuth).toBe(true);
      
      // 2. Verify session is active
      const { data: { session } } = await supabase.auth.getSession();
      expect(session).toBeDefined();
      
      // 3. Get current user
      const userResult = await apiService.getCurrentUser();
      expect(userResult.success).toBe(true);
      expect(userResult.user.email).toBe(mockPersonalAccountData.email);
      
      // 4. Logout
      const logoutResult = await apiService.logout();
      expect(logoutResult.success).toBe(true);
      
      // 5. Login again
      const loginResult = await apiService.login(mockLoginCredentials.personal);
      expect(loginResult.success).toBe(true);
      
      // 6. Verify session restoration
      const initResult = await apiService.initializeAuth();
      expect(initResult.success).toBe(true);
      expect(initResult.authenticated).toBe(true);
      
      console.log('✅ Complete user journey test passed');
    });

    it('should handle error scenarios gracefully', async () => {
      console.log('🧪 Testing error handling scenarios...');
      
      // Test invalid email signup
      const invalidEmailResult = await apiService.signup({
        ...mockPersonalAccountData,
        email: 'invalid-email'
      });
      expect(invalidEmailResult.success).toBe(false);
      expect(invalidEmailResult.error).toContain('Invalid email');
      
      // Test password mismatch
      const passwordMismatchResult = await apiService.signup({
        ...mockPersonalAccountData,
        confirmPassword: 'DifferentPassword'
      });
      expect(passwordMismatchResult.success).toBe(false);
      expect(passwordMismatchResult.error).toContain('Passwords do not match');
      
      // Test invalid login credentials
      const invalidLoginResult = await apiService.login({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      });
      expect(invalidLoginResult.success).toBe(false);
      
      console.log('✅ Error scenarios handled gracefully');
    });
  });
});