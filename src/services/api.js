import { supabase } from '../lib/supabase.js';

class ApiService {
  constructor() {
    this.supabase = supabase;
    this.initializeAuthListener();
  }

  // Initialize auth state listener
  initializeAuthListener() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    });
  }

  // Authentication methods
  async signup(userData) {
    try {
      console.log('Starting Supabase signup with data:', JSON.stringify(userData, null, 2));

      // Validate required fields
      if (!userData.email || !userData.password) {
        const error = 'Email and password are required';
        console.error('Validation error:', error);
        return {
          success: false,
          error
        };
      }

      if (userData.password !== userData.confirmPassword) {
        const error = 'Passwords do not match';
        console.error('Validation error:', error);
        return {
          success: false,
          error
        };
      }

      // Validate account type specific fields
      if (userData.account_type === 'personal') {
        if (!userData.first_name || !userData.last_name) {
          const error = 'First name and last name are required for personal accounts';
          console.error('Validation error:', error);
          return {
            success: false,
            error
          };
        }
      } else if (userData.account_type === 'business') {
        if (!userData.business_name) {
          const error = 'Business name is required for business accounts';
          console.error('Validation error:', error);
          return {
            success: false,
            error
          };
        }
      }

      // Prepare user metadata with correct field names matching database schema
      const userMetadata = {
        account_type: userData.account_type,
        phone: userData.phone,
        phone_verified: userData.phone_verified || false,
        referral_code: userData.referral_code,
        tier: 1, // Default tier
        kyc_status: {
          bvn_verified: false,
          documents_verified: false,
          address_verified: false
        }
      };

      // Add account-specific metadata with correct field names
      if (userData.account_type === 'personal') {
        userMetadata.first_name = userData.first_name;
        userMetadata.last_name = userData.last_name;
        userMetadata.display_name = `${userData.first_name} ${userData.last_name}`.trim();
      } else if (userData.account_type === 'business') {
        userMetadata.business_name = userData.business_name;
        userMetadata.rc_number = userData.rc_number;
        userMetadata.nin = userData.nin;
        userMetadata.display_name = userData.business_name;
      }

      // Sign up user with Supabase
      console.log('Calling Supabase auth.signUp with metadata:', userMetadata);
      
      const { data, error } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: userMetadata,
          emailRedirectTo: window.location.origin // Add redirect URL
        }
      });

      if (error) {
        console.error('Supabase signup error:', {
          message: error.message,
          code: error.code,
          status: error.status,
          originalError: error
        });
        return {
          success: false,
          error: error.message,
          details: {
            code: error.code,
            status: error.status
          }
        };
      }

      console.log('Supabase signup successful:', data);

      // Check if email confirmation is required
      if (data.user && !data.session) {
        return {
          success: true,
          message: 'Please check your email to confirm your account',
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
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || 'Signup failed'
      };
    }
  }

  async login(credentials) {
    try {
      console.log('Starting Supabase login for:', credentials.email);

      // Validate required fields
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          error: 'Email and password are required'
        };
      }

      // Sign in with Supabase
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        console.error('Supabase login error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('Supabase login successful:', data);

      // Return user data in the format expected by your Redux store
      return {
        success: true,
        user: {
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
          phone_verified: data.user.user_metadata?.phone_verified,
          loginTime: Date.now()
        },
        session: data.session
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed'
      };
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