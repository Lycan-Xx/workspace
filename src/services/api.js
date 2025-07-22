
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NODE_ENV === 'production' 
  ? 'https://your-production-url.com' 
  : 'http://localhost:8090');

class ApiService {
  constructor() {
    this.pb = pb;
  }

  // Authentication methods
  async login(credentials) {
    try {
      const authData = await this.pb.collection('users').authWithPassword(
        credentials.email, 
        credentials.password
      );
      return {
        success: true,
        user: {
          id: authData.record.id,
          email: authData.record.email,
          name: authData.record.name || `${authData.record.firstname} ${authData.record.lastname}`,
          role: authData.record.account_type,
          verified: authData.record.verified,
          phone: authData.record.phone
        },
        token: authData.token
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  }

  async signup(userData) {
    try {
      // Prepare user data for PocketBase
      const pbUserData = {
        email: userData.email,
        password: userData.password,
        passwordConfirm: userData.confirmPassword,
        account_type: userData.accountType?.toLowerCase() || 'personal',
        phone: userData.phone,
        verified: false,
        created: new Date().toISOString()
      };

      // Add account-type specific fields
      if (userData.accountType === 'Personal') {
        pbUserData.firstname = userData.firstname;
        pbUserData.lastname = userData.lastname;
        pbUserData.name = `${userData.firstname} ${userData.lastname}`;
      } else if (userData.accountType === 'Business') {
        pbUserData.business_name = userData.businessName;
        pbUserData.rc_number = userData.rcNumber;
        pbUserData.nin = userData.nin;
        pbUserData.name = userData.businessName;
      }

      // Add optional fields
      if (userData.referralCode) {
        pbUserData.referral_code = userData.referralCode;
      }

      const record = await this.pb.collection('users').create(pbUserData);
      
      return {
        success: true,
        message: 'Account created successfully',
        user: record
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Signup failed'
      };
    }
  }

  async logout() {
    try {
      this.pb.authStore.clear();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async resetPassword(phone, newPassword) {
    try {
      // Find user by phone number
      const users = await this.pb.collection('users').getList(1, 1, {
        filter: `phone = "${phone}"`
      });

      if (users.items.length === 0) {
        throw new Error('User not found');
      }

      const user = users.items[0];
      
      // Update password
      await this.pb.collection('users').update(user.id, {
        password: newPassword,
        passwordConfirm: newPassword
      });

      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Password reset failed'
      };
    }
  }

  async verifyOTP(phone, otp) {
    // In a real implementation, you would verify the OTP with an external service
    // For now, we'll simulate verification
    console.log('API: OTP verification', phone, otp);
    
    // Simulate successful verification for testing
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

  async sendOTP(phone) {
    // In a real implementation, you would integrate with an SMS service
    console.log('API: Send OTP to', phone);
    
    // Simulate successful OTP sending
    return {
      success: true,
      message: 'OTP sent successfully'
    };
  }

  // User management
  async getCurrentUser() {
    try {
      if (!this.pb.authStore.isValid) {
        throw new Error('Not authenticated');
      }

      const user = await this.pb.collection('users').getOne(this.pb.authStore.model.id);
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.account_type,
          verified: user.verified,
          phone: user.phone
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get current user'
      };
    }
  }

  async updateUser(userId, userData) {
    try {
      const record = await this.pb.collection('users').update(userId, userData);
      return {
        success: true,
        user: record
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update user'
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.pb.authStore.isValid;
  }

  // Get auth token
  getToken() {
    return this.pb.authStore.token;
  }
}

export const apiService = new ApiService();
export default ApiService;
