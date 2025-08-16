import { supabase, supabaseAdmin } from '../config.js';
import bcrypt from 'bcrypt';

class AuthService {
  // Sign up new user
  async signup(userData) {
    try {
      const {
        email,
        password,
        account_type,
        phone,
        first_name,
        last_name,
        business_name,
        rc_number,
        nin,
        referral_code
      } = userData;

      // Validate required fields
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (account_type === 'personal' && (!first_name || !last_name)) {
        throw new Error('First name and last name are required for personal accounts');
      }

      if (account_type === 'business' && !business_name) {
        throw new Error('Business name is required for business accounts');
      }

      // Prepare user metadata with correct field names matching the trigger function
      const userMetadata = {
        account_type: account_type || 'personal',
        phone: phone,
        phone_verified: false,
        referral_code: referral_code,
        tier: 1
      };

      // Add account-specific metadata
      if (account_type === 'personal') {
        userMetadata.first_name = first_name;
        userMetadata.last_name = last_name;
        userMetadata.display_name = `${first_name} ${last_name}`.trim();
      } else if (account_type === 'business') {
        userMetadata.business_name = business_name;
        userMetadata.rc_number = rc_number;
        userMetadata.nin = nin;
        userMetadata.display_name = business_name;
      }

      // Create auth user with Supabase
      const signUpOptions = {
        email,
        password,
        options: {
          data: userMetadata
        }
      };

      // Auto-confirm emails in development
      if (process.env.NODE_ENV === 'development') {
        signUpOptions.options.emailRedirectTo = 'http://localhost:5173/confirmed';
      }

      console.log('Creating user with metadata:', userMetadata);

      const { data: authData, error: authError } = await supabase.auth.signUp(signUpOptions);

      if (authError) {
        console.error('Auth signup error:', authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      console.log('User created successfully:', authData.user.id);

      // The trigger function will handle creating the user profile and account
      // Wait a moment for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify the user profile was created
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('users')
        .select(`
          *,
          accounts (
            id,
            account_number,
            balance,
            currency
          )
        `)
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Profile verification error:', profileError);
        // Clean up auth user if profile creation failed
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        throw new Error('Profile creation failed');
      }

      return {
        success: true,
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.display_name,
          role: profile.account_type,
          verified: profile.is_verified,
          phone: profile.phone,
          phone_verified: profile.phone_verified,
          tier: profile.tier,
          accounts: profile.accounts,
          ...(profile.account_type === 'business' ? {
            business_name: profile.business_name,
            rc_number: profile.rc_number,
            nin: profile.nin
          } : {
            first_name: profile.first_name,
            last_name: profile.last_name
          })
        },
        session: authData.session,
        message: authData.session 
          ? 'Account created successfully'
          : 'Account created successfully. Please check your email for verification.'
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || 'Signup failed'
      };
    }
  }

  // Sign in user
  async login(credentials) {
    try {
      const { email, password } = credentials;

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // First try normal login
      let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // If login fails due to unverified email in development, auto-verify and retry
      if (authError && process.env.NODE_ENV === 'development' &&
          authError.message.includes('Email not confirmed')) {
        
        console.log('Auto-confirming email in development mode');
        
        // Get user ID
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
        const user = users.find(u => u.email === email);
        
        if (user) {
          // Auto-confirm the email
          await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { email_confirm: true }
          );
          
          // Update profile email_verified status
          await supabaseAdmin
            .from('users')
            .update({ 
              email_verified: true,
              status: 'active'
            })
            .eq('email', email);
            
          // Retry login
          ({ data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
          }));
        }
      }

      if (authError) {
        throw new Error(authError.message);
      }

      // Get user profile with accounts
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('users')
        .select(`
          *,
          accounts (
            id,
            account_number,
            balance,
            currency
          )
        `)
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new Error('Failed to fetch user profile');
      }

      return {
        success: true,
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.display_name,
          first_name: profile.first_name,
          last_name: profile.last_name,
          business_name: profile.business_name,
          role: profile.account_type,
          verified: profile.is_verified,
          phone: profile.phone,
          phone_verified: profile.phone_verified,
          tier: profile.tier,
          accounts: profile.accounts,
          date_of_birth: profile.date_of_birth,
          gender: profile.gender,
          country: profile.country
        },
        token: authData.session.access_token,
        session: authData.session
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  }

  // Logout user
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get current user
  async getCurrentUser(userId) {
    try {
      const { data: profile, error } = await supabaseAdmin
        .from('users')
        .select(`
          *,
          accounts (
            id,
            account_number,
            balance,
            currency
          )
        `)
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error('User not found');
      }

      return {
        success: true,
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.display_name,
          first_name: profile.first_name,
          last_name: profile.last_name,
          business_name: profile.business_name,
          role: profile.account_type,
          verified: profile.is_verified,
          phone: profile.phone,
          phone_verified: profile.phone_verified,
          tier: profile.tier,
          accounts: profile.accounts,
          date_of_birth: profile.date_of_birth,
          gender: profile.gender,
          country: profile.country
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get current user'
      };
    }
  }

  // Update user profile
  async updateUser(userId, userData) {
    try {
      // Separate auth metadata from profile data
      const profileData = {};
      const metadataUpdates = {};

      // Fields that go to the users table
      const profileFields = [
        'first_name', 'last_name', 'business_name', 'rc_number', 'nin',
        'phone', 'date_of_birth', 'gender', 'country', 'state', 'city', 
        'address', 'display_name'
      ];

      // Fields that go to auth metadata
      const metadataFields = [
        'first_name', 'last_name', 'business_name', 'rc_number', 'nin',
        'phone', 'display_name', 'phone_verified'
      ];

      // Split the data
      Object.keys(userData).forEach(key => {
        if (profileFields.includes(key)) {
          profileData[key] = userData[key];
        }
        if (metadataFields.includes(key)) {
          metadataUpdates[key] = userData[key];
        }
      });

      // Update auth metadata if needed
      if (Object.keys(metadataUpdates).length > 0) {
        const { error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          { user_metadata: metadataUpdates }
        );
        if (metadataError) {
          console.error('Metadata update error:', metadataError);
        }
      }

      // Update profile data
      if (Object.keys(profileData).length > 0) {
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('users')
          .update(profileData)
          .eq('id', userId)
          .select()
          .single();

        if (profileError) {
          throw new Error(profileError.message);
        }

        return {
          success: true,
          user: profile
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update user'
      };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:5173/reset-password'
          : `${process.env.FRONTEND_URL}/reset-password`
      });
      if (error) throw error;

      return {
        success: true,
        message: 'Password reset email sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Password reset failed'
      };
    }
  }

  // Update password
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

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

  // Generate referral code
  generateReferralCode(email) {
    const username = email.split('@')[0].toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${username.substring(0, 4)}${randomNum}`;
  }

  // Verify phone OTP (placeholder - integrate with SMS service)
  async verifyOTP(phone, otp) {
    // Simulate OTP verification
    if (otp === '111111') {
      return {
        success: true,
        message: 'OTP verified successfully'
      };
    }

    return {
      success: false,
      error: 'Invalid OTP'
    };
  }

  // Send OTP (placeholder - integrate with SMS service)
  async sendOTP(phone) {
    console.log('Sending OTP to:', phone);
    return {
      success: true,
      message: 'OTP sent successfully'
    };
  }

  // Set user PIN
  async setUserPin(userId, pin) {
    try {
      const hashedPin = await bcrypt.hash(pin, 10);
      
      const { error } = await supabaseAdmin
        .from('users')
        .update({ pin_hash: hashedPin })
        .eq('id', userId);

      if (error) throw error;

      return { success: true, message: 'PIN set successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Verify user PIN
  async verifyUserPin(userId, pin) {
    try {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('pin_hash')
        .eq('id', userId)
        .single();

      if (error || !user.pin_hash) {
        throw new Error('PIN not found');
      }

      const isValid = await bcrypt.compare(pin, user.pin_hash);
      
      return {
        success: isValid,
        message: isValid ? 'PIN verified' : 'Invalid PIN'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new AuthService();