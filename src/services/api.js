import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const getSupabaseUrl = () => {
  if (import.meta.env.VITE_SUPABASE_URL) {
    return import.meta.env.VITE_SUPABASE_URL;
  }
  // Fallback for development
  return 'https://your-project-id.supabase.co';
};

const getSupabaseAnonKey = () => {
  if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return import.meta.env.VITE_SUPABASE_ANON_KEY;
  }
  return 'your-anon-key-here';
};

// Backend API URL
const getBackendUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }

  if (typeof window === 'undefined') return 'http://localhost:5000';

  if (window.location.hostname.includes('replit.dev')) {
    // Replit environment - Backend is on port 5000
    const hostname = window.location.hostname;
    return `https://${hostname.replace('-00-', '-01-')}`;
  }

  // Local development - explicitly use localhost
  return 'http://localhost:5000';
};

const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());
const BACKEND_URL = getBackendUrl();

class ApiService {
  constructor() {
    this.supabase = supabase;
    this.backendUrl = BACKEND_URL;
    this.checkConnection();
  }

  async checkConnection() {
    try {
      const response = await fetch(`${this.backendUrl}/api/health`);
      if (response.ok) {
        console.log('Backend connection established');
      } else {
        console.error('Backend connection failed');
      }
    } catch (error) {
      console.error('Backend connection failed:', error);
      console.log('Make sure backend is running at:', this.backendUrl);
    }
  }

  // Authentication methods
  async login(credentials) {
    try {
      const response = await fetch(`${this.backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const result = await response.json();
      
      if (result.success && result.session) {
        // Set the session in Supabase client
        await this.supabase.auth.setSession(result.session);
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  }

  async signup(userData) {
    try {
      const response = await fetch(`${this.backendUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();
      console.log('Signup result:', result);
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || 'Signup failed'
      };
    }
  }

  async logout() {
    try {
      // Logout from Supabase
      await this.supabase.auth.signOut();
      
      // Also notify backend
      await fetch(`${this.backendUrl}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async resetPassword(email) {
    try {
      const response = await fetch(`${this.backendUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Password reset failed'
      };
    }
  }

  async verifyOTP(phone, otp) {
    try {
      const response = await fetch(`${this.backendUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp })
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error.message || 'OTP verification failed'
      };
    }
  }

  async sendOTP(phone) {
    try {
      const response = await fetch(`${this.backendUrl}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone })
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to send OTP'
      };
    }
  }

  // User management
  async getCurrentUser() {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${this.backendUrl}/api/user/${session.user.id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        }
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get current user'
      };
    }
  }

  async updateUser(userId, userData) {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      
      const response = await fetch(`${this.backendUrl}/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update user'
      };
    }
  }

  // Get user accounts
  async getUserAccounts(userId) {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      
      const response = await fetch(`${this.backendUrl}/api/user/${userId}/accounts`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        }
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get user accounts'
      };
    }
  }

  // Get user transactions
  async getUserTransactions(userId, limit = 50) {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      
      const response = await fetch(`${this.backendUrl}/api/user/${userId}/transactions?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        }
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get transactions'
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const { data: { session } } = this.supabase.auth.getSession();
    return !!session;
  }

  // Get auth token
  getToken() {
    const { data: { session } } = this.supabase.auth.getSession();
    return session?.access_token || null;
  }

  // Get current session
  async getSession() {
    return await this.supabase.auth.getSession();
  }

  // Listen to auth changes
  onAuthStateChange(callback) {
    return this.supabase.auth.onAuthStateChange(callback);
  }
}

export const apiService = new ApiService();
export default ApiService;
