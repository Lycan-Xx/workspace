
import { supabase, supabaseAdmin } from '../config.js';
import bcrypt from 'bcrypt';

class AuthService {
  // Sign up new user
  async signup(userData) {
    try {
      const {
        email,
        password,
        accountType,
        phone,
        firstname,
        lastname,
        businessName,
        rcNumber,
        nin,
        referralCode
      } = userData;

      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            account_type: accountType?.toLowerCase() || 'personal',
            display_name: accountType === 'Business' ? businessName : `${firstname} ${lastname}`
          }
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      // Update user profile with additional data
      const profileData = {
        id: authData.user.id,
        email,
        phone,
        account_type: accountType?.toLowerCase() || 'personal',
        display_name: accountType === 'Business' ? businessName : `${firstname} ${lastname}`,
        phone_verified: false,
        email_verified: false
      };

      if (accountType === 'Business') {
        profileData.business_name = businessName;
        profileData.rc_number = rcNumber;
        profileData.nin = nin;
      } else {
        profileData.first_name = firstname;
        profileData.last_name = lastname;
      }

      if (referralCode) {
        // Find referrer
        const { data: referrer } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('referral_code', referralCode)
          .single();
        
        if (referrer) {
          profileData.referred_by = referrer.id;
        }
      }

      // Generate unique referral code for new user
      const newReferralCode = this.generateReferralCode(email);
      profileData.referral_code = newReferralCode;

      const { data: profile, error: profileError } = await supabaseAdmin
        .from('users')
        .upsert(profileData)
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Clean up auth user if profile creation fails
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
          ...(profile.account_type === 'business' ? {
            businessName: profile.business_name,
            rcNumber: profile.rc_number,
            nin: profile.nin
          } : {
            firstName: profile.first_name,
            lastName: profile.last_name
          })
        },
        message: 'Account created successfully. Please check your email for verification.'
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

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Get user profile
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
        throw new Error('Failed to fetch user profile');
      }

      return {
        success: true,
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.display_name,
          firstname: profile.first_name,
          lastname: profile.last_name,
          role: profile.account_type,
          verified: profile.is_verified,
          phone: profile.phone,
          tier: profile.tier,
          accounts: profile.accounts,
          dateOfBirth: profile.date_of_birth,
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
          firstname: profile.first_name,
          lastname: profile.last_name,
          role: profile.account_type,
          verified: profile.is_verified,
          phone: profile.phone,
          tier: profile.tier,
          accounts: profile.accounts,
          dateOfBirth: profile.date_of_birth,
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
      const { data: profile, error } = await supabaseAdmin
        .from('users')
        .update(userData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        user: profile
      };
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
      const { error } = await supabase.auth.resetPasswordForEmail(email);
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
