
import { supabase, supabaseAdmin } from '../config.js';
import AuthService from './authService.js';

class ApiService {
  constructor() {
    this.auth = AuthService;
    this.checkConnection();
  }

  async checkConnection() {
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) throw error;
      console.log('Supabase connection established');
    } catch (error) {
      console.error('Supabase connection failed:', error);
    }
  }

  // Authentication methods (delegate to AuthService)
  async login(credentials) {
    return this.auth.login(credentials);
  }

  async signup(userData) {
    return this.auth.signup(userData);
  }

  async logout() {
    return this.auth.logout();
  }

  async getCurrentUser(userId) {
    return this.auth.getCurrentUser(userId);
  }

  async updateUser(userId, userData) {
    return this.auth.updateUser(userId, userData);
  }

  async resetPassword(email) {
    return this.auth.resetPassword(email);
  }

  async verifyOTP(phone, otp) {
    return this.auth.verifyOTP(phone, otp);
  }

  async sendOTP(phone) {
    return this.auth.sendOTP(phone);
  }

  // Account management
  async getUserAccounts(userId) {
    try {
      const { data: accounts, error } = await supabaseAdmin
        .from('accounts')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      return {
        success: true,
        accounts
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Transaction methods
  async createTransaction(transactionData) {
    try {
      const { data: transaction, error } = await supabaseAdmin
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        transaction
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getUserTransactions(userId, limit = 50) {
    try {
      const { data: transactions, error } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        transactions
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Virtual cards
  async createVirtualCard(userId, cardData) {
    try {
      const { data: card, error } = await supabaseAdmin
        .from('virtual_cards')
        .insert({
          user_id: userId,
          ...cardData
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        card
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getUserVirtualCards(userId) {
    try {
      const { data: cards, error } = await supabaseAdmin
        .from('virtual_cards')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      return {
        success: true,
        cards
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // KYC Document upload
  async uploadKYCDocument(userId, documentData) {
    try {
      const { data: document, error } = await supabaseAdmin
        .from('kyc_documents')
        .insert({
          user_id: userId,
          ...documentData
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        document
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Vault file management
  async uploadVaultFile(userId, fileData) {
    try {
      const { data: file, error } = await supabaseAdmin
        .from('vault_files')
        .insert({
          user_id: userId,
          ...fileData
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        file
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getUserVaultFiles(userId) {
    try {
      const { data: files, error } = await supabaseAdmin
        .from('vault_files')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        files
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const { data: { session } } = supabase.auth.getSession();
    return !!session;
  }

  // Get auth token
  getToken() {
    const { data: { session } } = supabase.auth.getSession();
    return session?.access_token || null;
  }
}

export default new ApiService();
