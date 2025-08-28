import { supabase } from '../lib/supabase.js';
import { ErrorHandler, ErrorRecovery, ErrorLogger } from '../utils/errorHandler.js';
import authDebugger from '../utils/authDebugger.js';
import devNotifications from '../utils/devNotifications.js';

class ApiService {
  constructor() {
    this.supabase = supabase;
    this.sessionMonitorInterval = null;
    this.initializeAuthListener();
    this.startSessionMonitoring();
  }

  // Initialize auth state listener with enhanced session management
  initializeAuthListener() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Auth state changed:', event, {
          userEmail: session?.user?.email,
          hasSession: !!session,
          expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null
        });
      }
      
      if (event === 'SIGNED_IN') {
        console.log('✅ User signed in:', {
          userId: session.user?.id,
          email: session.user?.email
        });
        // Start session monitoring when user signs in
        this.startSessionMonitoring();
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 User signed out');
        // Stop session monitoring when user signs out
        this.stopSessionMonitoring();
        // Clear session data
        this.clearSessionData();
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed:', {
          expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null
        });
      }
    });
  }

  // Session monitoring for automatic refresh
  startSessionMonitoring() {
    // Clear any existing interval
    this.stopSessionMonitoring();
    
    // Check session every 2 minutes
    this.sessionMonitorInterval = setInterval(async () => {
      try {
        const result = await this.validateAndRefreshSession();
        
        if (!result.success) {
          console.warn('⚠️ Session validation failed during monitoring:', result.error);
          
          // If session is invalid, trigger logout
          if (result.error.includes('No session') || result.error.includes('expired')) {
            console.log('🚪 Session expired during monitoring, logging out...');
            await this.logout();
            
            // Dispatch logout event for Redux store
            window.dispatchEvent(new CustomEvent('session-expired'));
          }
        }
      } catch (error) {
        console.error('❌ Session monitoring error:', error);
      }
    }, 2 * 60 * 1000); // 2 minutes
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Session monitoring started');
    }
  }

  // Stop session monitoring
  stopSessionMonitoring() {
    if (this.sessionMonitorInterval) {
      clearInterval(this.sessionMonitorInterval);
      this.sessionMonitorInterval = null;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('⏹️ Session monitoring stopped');
      }
    }
  }

  // Authentication methods
  async signup(userData) {
    try {
      authDebugger.logAuthOperation('signup', {
        userInput: userData,
        component: 'api_service',
        action: 'signup_start'
      });

      console.log('🚀 Starting enhanced Supabase signup with data:', JSON.stringify(userData, null, 2));

      // Enhanced flexible email validation (basic @ check only)
      if (!userData.email || !userData.password) {
        const error = 'Email and password are required';
        return ErrorHandler.handleValidationError(error, !userData.email ? 'email' : 'password', {
          component: 'signup',
          action: 'validation'
        });
      }

      // Flexible email validation - only check for @ symbol and basic format
      const emailRegex = /^[^\s@]+@[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        const error = 'Invalid email';
        return ErrorHandler.handleValidationError(error, 'email', {
          component: 'signup',
          action: 'email_validation',
          userInput: { email: userData.email }
        });
      }

      if (userData.password !== userData.confirmPassword) {
        const error = 'Passwords do not match';
        return ErrorHandler.handleValidationError(error, 'confirmPassword', {
          component: 'signup',
          action: 'password_confirmation'
        });
      }

      // Enhanced account type specific validation with detailed error messages
      if (userData.account_type === 'personal') {
        if (!userData.first_name || !userData.last_name) {
          const missingField = !userData.first_name ? 'first_name' : 'last_name';
          const error = `${missingField === 'first_name' ? 'First name' : 'Last name'} is required for personal accounts`;
          return ErrorHandler.handleValidationError(error, missingField, {
            component: 'signup',
            action: 'personal_account_validation',
            userInput: { account_type: userData.account_type }
          });
        }
      } else if (userData.account_type === 'business') {
        if (!userData.business_name) {
          const error = 'Business name is required for business accounts';
          return ErrorHandler.handleValidationError(error, 'business_name', {
            component: 'signup',
            action: 'business_account_validation',
            userInput: { account_type: userData.account_type }
          });
        }
      }

      // Prepare comprehensive user metadata with account-type specific handling
      const userMetadata = {
        account_type: userData.account_type,
        phone: userData.phone || null,
        phone_verified: false,
        referral_code: userData.referral_code || null,
        tier: 1, // Default tier
        kyc_status: {
          bvn_verified: false,
          documents_verified: false,
          address_verified: false
        },
        created_at: new Date().toISOString()
      };

      // Add account-specific metadata with proper handling
      if (userData.account_type === 'personal') {
        userMetadata.first_name = userData.first_name.trim();
        userMetadata.last_name = userData.last_name.trim();
        userMetadata.display_name = `${userData.first_name.trim()} ${userData.last_name.trim()}`.trim();
        console.log('👤 Personal account metadata prepared:', {
          first_name: userMetadata.first_name,
          last_name: userMetadata.last_name,
          display_name: userMetadata.display_name
        });
      } else if (userData.account_type === 'business') {
        userMetadata.business_name = userData.business_name.trim();
        userMetadata.rc_number = userData.rc_number?.trim() || null;
        userMetadata.nin = userData.nin?.trim() || null;
        userMetadata.display_name = userData.business_name.trim();
        console.log('🏢 Business account metadata prepared:', {
          business_name: userMetadata.business_name,
          rc_number: userMetadata.rc_number,
          nin: userMetadata.nin,
          display_name: userMetadata.display_name
        });
      }

      // Enhanced Supabase signup with development-optimized configuration
      console.log('📡 Calling Supabase auth.signUp with enhanced metadata:', userMetadata);
      
      const { data, error } = await this.supabase.auth.signUp({
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        options: {
          data: userMetadata,
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        authDebugger.logAuthOperation('signup', {
          userInput: { email: userData.email, account_type: userData.account_type },
          error: error,
          supabaseError: {
            code: error.code,
            status: error.status,
            message: error.message
          }
        }, 'error');

        // Show development notification
        devNotifications.showAuthDebug({
          operation: 'signup',
          data: { email: userData.email, error: error.message },
          level: 'error'
        });

        return ErrorHandler.handleAuthError(error.message, {
          component: 'signup',
          action: 'supabase_signup',
          userInput: { email: userData.email, account_type: userData.account_type },
          originalError: error,
          details: {
            code: error.code,
            status: error.status
          }
        });
      }

      authDebugger.logAuthOperation('signup', {
        userId: data.user?.id,
        email: data.user?.email,
        hasSession: !!data.session,
        emailConfirmed: data.user?.email_confirmed_at ? true : false,
        userMetadata: data.user?.user_metadata,
        accountType: userData.account_type
      }, 'success');

      console.log('✅ Supabase signup successful:', {
        userId: data.user?.id,
        email: data.user?.email,
        hasSession: !!data.session,
        emailConfirmed: data.user?.email_confirmed_at ? true : false
      });

      // Enhanced session handling - immediate session creation without email verification
      if (data.user && data.session) {
        authDebugger.logAuthOperation('signup', {
          immediateAuth: true,
          sessionCreated: true,
          userId: data.user.id,
          email: data.user.email
        }, 'success');

        // Show development notification
        devNotifications.showAuthDebug({
          operation: 'signup',
          data: { email: data.user.email, immediateAuth: true },
          level: 'success'
        });

        console.log('🎉 Immediate session created - user authenticated successfully');
        
        // Transform user data for Redux store
        const transformedUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.display_name || data.user.email,
          role: data.user.user_metadata?.account_type || 'personal',
          tier: data.user.user_metadata?.tier || 1,
          phone: data.user.user_metadata?.phone,
          first_name: data.user.user_metadata?.first_name,
          last_name: data.user.user_metadata?.last_name,
          business_name: data.user.user_metadata?.business_name,
          rc_number: data.user.user_metadata?.rc_number,
          nin: data.user.user_metadata?.nin,
          phone_verified: data.user.user_metadata?.phone_verified || false,
          loginTime: Date.now()
        };

        return {
          success: true,
          user: transformedUser,
          session: data.session,
          message: 'Account created and authenticated successfully!',
          immediateAuth: true
        };
      }

      // Fallback for cases where email verification might still be required
      if (data.user && !data.session) {
        console.log('⚠️ Email verification required - this should not happen in development mode');
        return {
          success: true,
          message: 'Account created. Please check your email to confirm your account.',
          user: data.user,
          requiresEmailConfirmation: true
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
        message: 'Account created successfully'
      };

    } catch (error) {
      return ErrorHandler.handleError(error, {
        component: 'signup',
        action: 'unexpected_error',
        userInput: { email: userData.email, account_type: userData.account_type }
      });
    }
  }

  async login(credentials) {
    try {
      authDebugger.logAuthOperation('login', {
        userInput: { email: credentials.email },
        component: 'api_service',
        action: 'login_start'
      });

      console.log('🔐 Starting enhanced Supabase login for:', credentials.email);

      // Enhanced validation with detailed error messages
      if (!credentials.email || !credentials.password) {
        const missingField = !credentials.email ? 'email' : 'password';
        const error = `${missingField === 'email' ? 'Email' : 'Password'} is required`;
        return ErrorHandler.handleValidationError(error, missingField, {
          component: 'login',
          action: 'validation'
        });
      }

      // Flexible email validation for login
      const emailRegex = /^[^\s@]+@[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        const error = 'Invalid email';
        return ErrorHandler.handleValidationError(error, 'email', {
          component: 'login',
          action: 'email_validation',
          userInput: { email: credentials.email }
        });
      }

      console.log('📡 Attempting Supabase authentication...');

      // Streamlined authentication process
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email.toLowerCase().trim(),
        password: credentials.password
      });

      if (error) {
        authDebugger.logAuthOperation('login', {
          userInput: { email: credentials.email },
          error: error,
          supabaseError: {
            code: error.code,
            status: error.status,
            message: error.message
          }
        }, 'error');

        // Show development notification
        devNotifications.showAuthDebug({
          operation: 'login',
          data: { email: credentials.email, error: error.message },
          level: 'error'
        });

        return ErrorHandler.handleAuthError(error.message, {
          component: 'login',
          action: 'supabase_login',
          userInput: { email: credentials.email },
          originalError: error,
          details: {
            code: error.code,
            status: error.status
          }
        });
      }

      authDebugger.logAuthOperation('login', {
        userId: data.user?.id,
        email: data.user?.email,
        hasSession: !!data.session,
        accountType: data.user?.user_metadata?.account_type,
        userMetadata: data.user?.user_metadata,
        session: data.session
      }, 'success');

      console.log('✅ Supabase login successful:', {
        userId: data.user?.id,
        email: data.user?.email,
        hasSession: !!data.session,
        accountType: data.user?.user_metadata?.account_type
      });

      // Detailed logging for development debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Development Debug - User Metadata:', {
          account_type: data.user.user_metadata?.account_type,
          display_name: data.user.user_metadata?.display_name,
          tier: data.user.user_metadata?.tier,
          phone: data.user.user_metadata?.phone,
          phone_verified: data.user.user_metadata?.phone_verified,
          kyc_status: data.user.user_metadata?.kyc_status,
          created_at: data.user.user_metadata?.created_at
        });

        console.log('🔍 Development Debug - Session Info:', {
          access_token: data.session?.access_token ? 'Present' : 'Missing',
          refresh_token: data.session?.refresh_token ? 'Present' : 'Missing',
          expires_at: data.session?.expires_at,
          expires_in: data.session?.expires_in
        });
      }

      // Improved user data transformation for Redux store
      const transformedUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.display_name || data.user.email,
        role: data.user.user_metadata?.account_type || 'personal',
        tier: data.user.user_metadata?.tier || 1,
        phone: data.user.user_metadata?.phone || null,
        phone_verified: data.user.user_metadata?.phone_verified || false,
        loginTime: Date.now(),
        // Account-specific fields
        ...(data.user.user_metadata?.account_type === 'personal' && {
          first_name: data.user.user_metadata?.first_name,
          last_name: data.user.user_metadata?.last_name
        }),
        ...(data.user.user_metadata?.account_type === 'business' && {
          business_name: data.user.user_metadata?.business_name,
          rc_number: data.user.user_metadata?.rc_number,
          nin: data.user.user_metadata?.nin
        }),
        // Additional metadata
        kyc_status: data.user.user_metadata?.kyc_status || {
          bvn_verified: false,
          documents_verified: false,
          address_verified: false
        },
        referral_code: data.user.user_metadata?.referral_code
      };

      console.log('🎉 User data transformed for Redux store:', {
        id: transformedUser.id,
        email: transformedUser.email,
        name: transformedUser.name,
        role: transformedUser.role,
        tier: transformedUser.tier
      });

      // Enhanced session handling
      if (!data.session) {
        console.warn('⚠️ Login successful but no session created');
        return {
          success: false,
          error: 'Authentication successful but session creation failed. Please try again.'
        };
      }

      return {
        success: true,
        user: transformedUser,
        session: data.session,
        message: 'Login successful!'
      };

    } catch (error) {
      return ErrorHandler.handleError(error, {
        component: 'login',
        action: 'unexpected_error',
        userInput: { email: credentials.email }
      });
    }
  }

  async logout() {
    try {
      const { error } = await this.supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  async resetPassword(email) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Password reset failed'
      };
    }
  }

  async updatePassword(newPassword) {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Password update failed'
      };
    }
  }

  // User profile management
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      if (!user) {
        return {
          success: false,
          error: 'No authenticated user'
        };
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.display_name || user.email,
          role: user.user_metadata?.account_type || 'personal',
          tier: user.user_metadata?.tier || 1,
          phone: user.user_metadata?.phone,
          first_name: user.user_metadata?.first_name,
          last_name: user.user_metadata?.last_name,
          business_name: user.user_metadata?.business_name,
          rc_number: user.user_metadata?.rc_number,
          nin: user.user_metadata?.nin,
          phone_verified: user.user_metadata?.phone_verified,
          kyc_status: user.user_metadata?.kyc_status
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get current user'
      };
    }
  }

  async updateUserProfile(updates) {
    try {
      const { data, error } = await this.supabase.auth.updateUser({
        data: updates
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        user: data.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update profile'
      };
    }
  }

  // Enhanced session initialization method with automatic restoration
  async initializeAuth() {
    try {
      authDebugger.logAuthOperation('session_init', {
        component: 'api_service',
        action: 'session_init_start'
      });

      console.log('🔄 Initializing authentication session...');

      // Get current session from Supabase
      const { data: { session: initialSession }, error: sessionError } = await this.supabase.auth.getSession();
      
      if (sessionError) {
        return ErrorHandler.handleSessionError(sessionError.message, {
          component: 'session_initialization',
          action: 'session_retrieval'
        });
      }

      // No session found
      if (!initialSession) {
        authDebugger.logAuthOperation('session_init', {
          result: 'no_session_found',
          action: 'cleanup_stale_data'
        });

        console.log('ℹ️ No existing session found');
        // Clear any stale localStorage data
        this.clearSessionData();
        return {
          success: true,
          authenticated: false,
          message: 'No existing session'
        };
      }

      // Use let for session variable since we might need to reassign it
      let session = initialSession;

      authDebugger.logAuthOperation('session_init', {
        sessionFound: true,
        userId: session.user?.id,
        email: session.user?.email,
        expiresAt: session.expires_at,
        isExpired: session.expires_at ? new Date(session.expires_at * 1000) < new Date() : false,
        hasRefreshToken: !!session.refresh_token
      });

      console.log('✅ Session found:', {
        userId: session.user?.id,
        email: session.user?.email,
        expiresAt: session.expires_at,
        isExpired: session.expires_at ? new Date(session.expires_at * 1000) < new Date() : false
      });

      // Enhanced session expiration handling with automatic refresh attempt
      if (session.expires_at && new Date(session.expires_at * 1000) < new Date()) {
        authDebugger.logAuthOperation('token_refresh', {
          reason: 'session_expired',
          expiresAt: session.expires_at,
          currentTime: new Date().toISOString()
        });

        console.warn('⚠️ Session expired, attempting automatic token refresh...');
        
        try {
          // Attempt to refresh the session
          const { data: refreshData, error: refreshError } = await this.supabase.auth.refreshSession();
          
          if (refreshError || !refreshData.session) {
            authDebugger.logAuthOperation('token_refresh', {
              result: 'failed',
              error: refreshError,
              action: 'logout_user'
            }, 'error');

            console.warn('❌ Token refresh failed, logging out user');
            await this.logout();
            return {
              success: true,
              authenticated: false,
              message: 'Session expired and refresh failed - logged out automatically'
            };
          }
          
          authDebugger.logAuthOperation('token_refresh', {
            result: 'success',
            newExpiresAt: refreshData.session.expires_at,
            userId: refreshData.session.user?.id
          }, 'success');

          console.log('✅ Token refreshed successfully');
          // Continue with the refreshed session
          session = refreshData.session;
        } catch (refreshError) {
          authDebugger.logAuthOperation('token_refresh', {
            result: 'error',
            error: refreshError,
            action: 'logout_user'
          }, 'error');

          console.error('❌ Token refresh error:', refreshError);
          await this.logout();
          return {
            success: true,
            authenticated: false,
            message: 'Session expired - logged out automatically'
          };
        }
      }

      // Validate session by getting current user
      const { data: { user }, error: userError } = await this.supabase.auth.getUser();
      
      if (userError) {
        // Session exists but user validation failed - clean up
        console.warn('⚠️ User validation failed, cleaning up session');
        await this.logout();
        return ErrorHandler.handleSessionError('Session validation failed', {
          component: 'session_initialization',
          action: 'user_validation',
          originalError: userError
        });
      }

      if (!user) {
        console.warn('⚠️ Session exists but no user found - cleaning up');
        await this.logout();
        return {
          success: true,
          authenticated: false,
          message: 'Invalid session - logged out automatically'
        };
      }

      // Session is valid - transform user data for Redux store
      const transformedUser = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.display_name || user.email,
        role: user.user_metadata?.account_type || 'personal',
        tier: user.user_metadata?.tier || 1,
        phone: user.user_metadata?.phone || null,
        phone_verified: user.user_metadata?.phone_verified || false,
        loginTime: Date.now(), // Update login time for session restoration
        sessionRestoredAt: Date.now(), // Track when session was restored
        // Account-specific fields
        ...(user.user_metadata?.account_type === 'personal' && {
          first_name: user.user_metadata?.first_name,
          last_name: user.user_metadata?.last_name
        }),
        ...(user.user_metadata?.account_type === 'business' && {
          business_name: user.user_metadata?.business_name,
          rc_number: user.user_metadata?.rc_number,
          nin: user.user_metadata?.nin
        }),
        // Additional metadata
        kyc_status: user.user_metadata?.kyc_status || {
          bvn_verified: false,
          documents_verified: false,
          address_verified: false
        },
        referral_code: user.user_metadata?.referral_code
      };

      authDebugger.logAuthOperation('session_restore', {
        userId: transformedUser.id,
        email: transformedUser.email,
        name: transformedUser.name,
        role: transformedUser.role,
        sessionExpiresAt: new Date(session.expires_at * 1000).toISOString(),
        user: transformedUser,
        session: session
      }, 'success');

      // Show development notification
      devNotifications.showAuthDebug({
        operation: 'session_restore',
        data: { email: transformedUser.email },
        level: 'success'
      });

      console.log('🎉 Session restored successfully:', {
        userId: transformedUser.id,
        email: transformedUser.email,
        name: transformedUser.name,
        role: transformedUser.role,
        sessionExpiresAt: new Date(session.expires_at * 1000).toISOString()
      });

      // Development debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Development Debug - Session Restoration:', {
          sessionValid: true,
          userMetadata: user.user_metadata,
          sessionExpiresAt: new Date(session.expires_at * 1000).toISOString(),
          tokenRefreshed: session.refresh_token ? 'Available' : 'Missing'
        });
      }

      return {
        success: true,
        authenticated: true,
        user: transformedUser,
        session: session,
        message: 'Session restored successfully'
      };

    } catch (error) {
      console.error('❌ Session initialization error:', error);
      
      // Clean up any potentially corrupted session
      try {
        await this.logout();
      } catch (logoutError) {
        ErrorLogger.log(logoutError, {
          component: 'session_initialization',
          action: 'cleanup_failed'
        });
      }

      return ErrorHandler.handleSessionError(error, {
        component: 'session_initialization',
        action: 'unexpected_error'
      });
    }
  }

  // Enhanced session cleanup method
  clearSessionData() {
    try {
      // Clear localStorage auth data
      localStorage.removeItem('auth');
      localStorage.removeItem('evault-auth-token');
      
      // Clear any other session-related data
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('supabase.') || key.includes('auth'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🧹 Session data cleared from localStorage');
      }
    } catch (error) {
      console.error('❌ Error clearing session data:', error);
    }
  }

  // Enhanced logout with proper cleanup
  async logout() {
    try {
      authDebugger.logAuthOperation('logout', {
        component: 'api_service',
        action: 'logout_start'
      });

      console.log('🚪 Starting enhanced logout process...');
      
      // Sign out from Supabase
      const { error } = await this.supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Supabase logout error:', error);
        // Continue with cleanup even if Supabase logout fails
      }

      // Clear all session data
      this.clearSessionData();
      
      authDebugger.logAuthOperation('logout', {
        result: 'success',
        sessionDataCleared: true
      }, 'success');
      
      console.log('✅ Logout completed successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Ensure cleanup happens even if there's an error
      this.clearSessionData();
      
      return { success: false, error: error.message };
    }
  }

  // Automatic token refresh method
  async refreshToken() {
    try {
      console.log('🔄 Attempting token refresh...');
      
      const { data, error } = await this.supabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ Token refresh failed:', error);
        return { success: false, error: error.message };
      }

      if (!data.session) {
        console.error('❌ Token refresh returned no session');
        return { success: false, error: 'No session returned from refresh' };
      }

      console.log('✅ Token refreshed successfully:', {
        expiresAt: new Date(data.session.expires_at * 1000).toISOString()
      });

      return { 
        success: true, 
        session: data.session,
        user: data.user 
      };
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check session validity and refresh if needed
  async validateAndRefreshSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (!session) {
        return { success: false, error: 'No session found' };
      }

      // Check if session is close to expiring (within 5 minutes)
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

      if (expiresAt <= fiveMinutesFromNow) {
        console.log('🔄 Session expiring soon, refreshing token...');
        return await this.refreshToken();
      }

      return { success: true, session, valid: true };
    } catch (error) {
      console.error('❌ Session validation error:', error);
      return { success: false, error: error.message };
    }
  }

  // Session management
  async getSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, session };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    const { data: { session } } = await this.supabase.auth.getSession();
    return !!session;
  }

  // Get auth token
  async getToken() {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session?.access_token || null;
  }

  // Listen to auth changes
  onAuthStateChange(callback) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  // OTP methods (for phone verification if needed)
  async sendOTP(phone) {
    try {
      // Note: Supabase doesn't have built-in SMS OTP for phone verification
      // You would need to integrate with a third-party service like Twilio
      // For now, we'll simulate this
      console.log('OTP simulation for phone:', phone);
      
      return {
        success: true,
        message: 'OTP sent successfully (simulated)'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to send OTP'
      };
    }
  }

  async verifyOTP(phone, otp) {
    try {
      // Simulate OTP verification
      // In a real implementation, you'd verify against your OTP service
      console.log('OTP verification simulation for:', phone, otp);
      
      if (otp === '111111') { // Accept any 6-digit OTP for demo
        return {
          success: true,
          message: 'OTP verified successfully'
        };
      }

      return {
        success: false,
        error: 'Invalid OTP'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'OTP verification failed'
      };
    }
  }
}

export const apiService = new ApiService();
export default ApiService;