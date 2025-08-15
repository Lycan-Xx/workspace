import PocketBase from 'pocketbase';

// PocketBase configuration
const getPocketBaseUrl = () => {
  // Check for environment variable first (production)
  if (import.meta.env.VITE_POCKETBASE_URL) {
    return import.meta.env.VITE_POCKETBASE_URL;
  }

  if (typeof window === 'undefined') return 'http://localhost:8090';

  if (window.location.hostname.includes('replit.dev')) {
    // Replit environment - PocketBase is on port 3000 externally
    const hostname = window.location.hostname;
    return `https://${hostname}:3000`;
  }

  // Local development
  return 'http://localhost:8090';
};

const pb = new PocketBase(getPocketBaseUrl());

class ApiService {
  constructor() {
    this.pb = pb;
    this.checkConnection();
  }

  async checkConnection() {
    try {
      await this.pb.health.check();
      console.log('PocketBase connection established');
    } catch (error) {
      console.error('PocketBase connection failed:', error);
      console.log('Make sure PocketBase is running at:', getPocketBaseUrl());
    }
  }

  // Authentication methods
  async login(credentials) {
    try {
      const authData = await this.pb.collection('users').authWithPassword(
        credentials.email, 
        credentials.password
      );
      
      // Correctly map the PocketBase fields to our expected format
      return {
        success: true,
        user: {
          id: authData.record.id,
          email: authData.record.email,
          // Use the correct field names from PocketBase
          name: authData.record.name || `${authData.record.firstName} ${authData.record.lastName}`,
          role: authData.record.accountType, // Changed from account_type
          verified: authData.record.isVerified, // Changed from verified
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
      // Base data that's common to both account types
      let pbUserData = {
        email: userData.email,
        password: userData.password,
        passwordConfirm: userData.confirmPassword,
        phone: userData.phone,
        isVerified: false,
        accountType: userData.accountType?.toLowerCase() || 'personal'
      };

      if (userData.accountType === 'Business') {
        // Business account data only
        Object.assign(pbUserData, {
          businessName: userData.businessName,
          rcNumber: userData.rcNumber,
          nin: userData.nin,
          name: userData.businessName,
          // Set required fields with empty values for business accounts
          firstName: ' ',  // Space instead of empty string
          lastName: ' '    // Space instead of empty string
        });
      } else {
        // Personal account data only
        Object.assign(pbUserData, {
          firstName: userData.firstname,
          lastName: userData.lastname,
          name: `${userData.firstname} ${userData.lastname}`,
          // Set business fields as empty
          businessName: '',
          rcNumber: '',
          nin: ''
        });
      }

      console.log('Sending to PocketBase:', pbUserData);
      const record = await this.pb.collection('users').create(pbUserData);

      return {
        success: true,
        user: {
          id: record.id,
          email: record.email,
          name: record.name,
          role: record.accountType,
          verified: record.isVerified,
          phone: record.phone,
          ...(record.accountType === 'business' ? {
            businessName: record.businessName,
            rcNumber: record.rcNumber,
            nin: record.nin
          } : {
            firstName: record.firstName,
            lastName: record.lastName
          })
        },
        message: 'Account created successfully'
      };
    } catch (error) {
      console.error('PocketBase signup error:', error);
      // Log the full error details for debugging
      console.log('Error details:', JSON.stringify(error, null, 2));
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
          firstname: user.firstName, // <-- add this
          lastname: user.lastName,   // <-- add this
          role: user.accountType, // Changed from account_type
          verified: user.isVerified, // Changed from verified
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          country: user.country
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