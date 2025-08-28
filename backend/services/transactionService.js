/**
 * Transaction Service
 * Handles all transaction operations, balance management, and payment processing
 */

import { supabaseAdmin } from '../supabase/config.js';
import crypto from 'crypto';

class TransactionService {
  /**
   * Create a new transaction
   */
  async createTransaction(userId, transactionData) {
    try {
      const {
        type,
        amount,
        description,
        recipient_phone,
        recipient_name,
        service_provider,
        service_data
      } = transactionData;

      // Validate transaction type
      const validTypes = ['deposit', 'withdrawal', 'transfer', 'payment', 'airtime', 'data', 'electricity', 'cable', 'school_fees'];
      if (!validTypes.includes(type)) {
        return {
          success: false,
          error: 'Invalid transaction type'
        };
      }

      // Validate amount
      if (!amount || amount <= 0) {
        return {
          success: false,
          error: 'Invalid transaction amount'
        };
      }

      // Get user's primary account
      const { data: account, error: accountError } = await supabaseAdmin
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (accountError || !account) {
        return {
          success: false,
          error: 'No active account found'
        };
      }

      // Check user tier limits
      const tierCheckResult = await this.checkTierLimits(userId, amount, type);
      if (!tierCheckResult.success) {
        return tierCheckResult;
      }

      // For debit transactions, check balance
      const debitTypes = ['withdrawal', 'transfer', 'payment', 'airtime', 'data', 'electricity', 'cable', 'school_fees'];
      if (debitTypes.includes(type)) {
        if (parseFloat(account.balance) < amount) {
          return {
            success: false,
            error: 'Insufficient balance',
            code: 'INSUFFICIENT_BALANCE',
            currentBalance: parseFloat(account.balance),
            requiredAmount: amount
          };
        }
      }

      // Generate transaction reference
      const reference = this.generateTransactionReference(type);

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabaseAdmin
        .from('transactions')
        .insert({
          user_id: userId,
          account_id: account.id,
          transaction_type: type,
          amount: amount,
          currency: 'NGN',
          status: 'pending',
          reference: reference,
          description: description || `${type.charAt(0).toUpperCase() + type.slice(1)} transaction`,
          recipient_phone,
          recipient_name,
          service_provider,
          service_data: service_data ? JSON.stringify(service_data) : null,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (transactionError) {
        throw new Error('Failed to create transaction');
      }

      // Process the transaction based on type
      const processResult = await this.processTransaction(transaction);

      return {
        success: true,
        transaction: {
          ...transaction,
          status: processResult.status
        },
        message: processResult.message
      };

    } catch (error) {
      console.error('Create transaction error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create transaction'
      };
    }
  }

  /**
   * Process transaction based on type
   */
  async processTransaction(transaction) {
    try {
      const { id, transaction_type, amount, account_id, service_provider, service_data } = transaction;

      let status = 'completed';
      let message = 'Transaction completed successfully';

      switch (transaction_type) {
        case 'deposit':
          await this.updateAccountBalance(account_id, amount, 'credit');
          break;

        case 'withdrawal':
        case 'transfer':
          await this.updateAccountBalance(account_id, amount, 'debit');
          break;

        case 'airtime':
        case 'data':
          const utilityResult = await this.processUtilityPayment(transaction);
          status = utilityResult.status;
          message = utilityResult.message;
          if (status === 'completed') {
            await this.updateAccountBalance(account_id, amount, 'debit');
          }
          break;

        case 'electricity':
        case 'cable':
        case 'school_fees':
          const billResult = await this.processBillPayment(transaction);
          status = billResult.status;
          message = billResult.message;
          if (status === 'completed') {
            await this.updateAccountBalance(account_id, amount, 'debit');
          }
          break;

        default:
          status = 'failed';
          message = 'Unsupported transaction type';
      }

      // Update transaction status
      await supabaseAdmin
        .from('transactions')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      return { status, message };

    } catch (error) {
      console.error('Process transaction error:', error);
      
      // Mark transaction as failed
      await supabaseAdmin
        .from('transactions')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      return {
        status: 'failed',
        message: error.message || 'Transaction processing failed'
      };
    }
  }

  /**
   * Update account balance
   */
  async updateAccountBalance(accountId, amount, operation) {
    try {
      const { data: account, error: fetchError } = await supabaseAdmin
        .from('accounts')
        .select('balance')
        .eq('id', accountId)
        .single();

      if (fetchError) {
        throw new Error('Failed to fetch account balance');
      }

      const currentBalance = parseFloat(account.balance);
      const newBalance = operation === 'credit' 
        ? currentBalance + amount 
        : currentBalance - amount;

      if (newBalance < 0) {
        throw new Error('Insufficient balance');
      }

      const { error: updateError } = await supabaseAdmin
        .from('accounts')
        .update({
          balance: newBalance.toFixed(2),
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId);

      if (updateError) {
        throw new Error('Failed to update account balance');
      }

      return {
        success: true,
        previousBalance: currentBalance,
        newBalance: newBalance
      };

    } catch (error) {
      console.error('Update balance error:', error);
      throw error;
    }
  }

  /**
   * Process utility payments (airtime, data)
   */
  async processUtilityPayment(transaction) {
    try {
      // In production, integrate with utility providers
      // For development, simulate successful payment
      
      const { service_provider, service_data, amount } = transaction;
      const parsedServiceData = typeof service_data === 'string' 
        ? JSON.parse(service_data) 
        : service_data;

      console.log(`Processing ${transaction.transaction_type} payment:`, {
        provider: service_provider,
        amount: amount,
        data: parsedServiceData
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In development, randomly succeed/fail for testing
      const shouldSucceed = process.env.NODE_ENV === 'development' ? Math.random() > 0.1 : true;

      if (shouldSucceed) {
        return {
          status: 'completed',
          message: `${transaction.transaction_type} purchase successful`,
          external_reference: `EXT_${Date.now()}`
        };
      } else {
        return {
          status: 'failed',
          message: 'Payment failed at provider'
        };
      }

    } catch (error) {
      console.error('Utility payment error:', error);
      return {
        status: 'failed',
        message: 'Payment processing failed'
      };
    }
  }

  /**
   * Process bill payments (electricity, cable, school fees)
   */
  async processBillPayment(transaction) {
    try {
      // In production, integrate with bill payment providers
      // For development, simulate successful payment
      
      const { service_provider, service_data, amount } = transaction;
      const parsedServiceData = typeof service_data === 'string' 
        ? JSON.parse(service_data) 
        : service_data;

      console.log(`Processing ${transaction.transaction_type} payment:`, {
        provider: service_provider,
        amount: amount,
        data: parsedServiceData
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In development, randomly succeed/fail for testing
      const shouldSucceed = process.env.NODE_ENV === 'development' ? Math.random() > 0.05 : true;

      if (shouldSucceed) {
        return {
          status: 'completed',
          message: `${transaction.transaction_type} payment successful`,
          external_reference: `BILL_${Date.now()}`
        };
      } else {
        return {
          status: 'failed',
          message: 'Bill payment failed'
        };
      }

    } catch (error) {
      console.error('Bill payment error:', error);
      return {
        status: 'failed',
        message: 'Bill payment processing failed'
      };
    }
  }

  /**
   * Get user transactions with pagination
   */
  async getUserTransactions(userId, options = {}) {
    try {
      const {
        limit = 50,
        offset = 0,
        type = null,
        status = null,
        startDate = null,
        endDate = null
      } = options;

      let query = supabaseAdmin
        .from('transactions')
        .select(`
          *,
          accounts (
            account_number
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (type) {
        query = query.eq('transaction_type', type);
      }

      if (status) {
        query = query.eq('status', status);
      }

      if (startDate) {
        query = query.gte('created_at', startDate);
      }

      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data: transactions, error } = await query;

      if (error) {
        throw new Error('Failed to fetch transactions');
      }

      // Get total count for pagination
      let countQuery = supabaseAdmin
        .from('transactions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (type) countQuery = countQuery.eq('transaction_type', type);
      if (status) countQuery = countQuery.eq('status', status);
      if (startDate) countQuery = countQuery.gte('created_at', startDate);
      if (endDate) countQuery = countQuery.lte('created_at', endDate);

      const { count, error: countError } = await countQuery;

      if (countError) {
        console.warn('Failed to get transaction count:', countError);
      }

      return {
        success: true,
        transactions: transactions || [],
        pagination: {
          total: count || 0,
          limit,
          offset,
          hasMore: (count || 0) > offset + limit
        }
      };

    } catch (error) {
      console.error('Get transactions error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch transactions'
      };
    }
  }

  /**
   * Get transaction by reference
   */
  async getTransactionByReference(reference, userId = null) {
    try {
      let query = supabaseAdmin
        .from('transactions')
        .select(`
          *,
          accounts (
            account_number,
            users (
              display_name,
              email
            )
          )
        `)
        .eq('reference', reference);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: transaction, error } = await query.single();

      if (error) {
        return {
          success: false,
          error: 'Transaction not found'
        };
      }

      return {
        success: true,
        transaction
      };

    } catch (error) {
      console.error('Get transaction error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch transaction'
      };
    }
  }

  /**
   * Check tier limits for transaction
   */
  async checkTierLimits(userId, amount, transactionType) {
    try {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('tier')
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error('Failed to fetch user tier');
      }

      const tier = user.tier || 1;
      const limits = this.getTierLimits(tier);

      // Check daily limit
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: dailyTransactions, error: dailyError } = await supabaseAdmin
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .gte('created_at', today.toISOString())
        .in('transaction_type', ['withdrawal', 'transfer', 'payment', 'airtime', 'data', 'electricity', 'cable', 'school_fees'])
        .eq('status', 'completed');

      if (dailyError) {
        console.warn('Failed to check daily limits:', dailyError);
      }

      const dailyTotal = (dailyTransactions || []).reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

      if (dailyTotal + amount > limits.dailyLimit) {
        return {
          success: false,
          error: `Daily limit exceeded. Limit: ₦${limits.dailyLimit.toLocaleString()}, Used: ₦${dailyTotal.toLocaleString()}`,
          code: 'DAILY_LIMIT_EXCEEDED',
          limit: limits.dailyLimit,
          used: dailyTotal,
          available: limits.dailyLimit - dailyTotal
        };
      }

      return { success: true };

    } catch (error) {
      console.error('Tier limit check error:', error);
      return {
        success: false,
        error: 'Failed to check transaction limits'
      };
    }
  }

  /**
   * Get tier limits
   */
  getTierLimits(tier) {
    const limits = {
      1: { dailyLimit: 50000, monthlyLimit: 200000 },
      2: { dailyLimit: 200000, monthlyLimit: 1000000 },
      3: { dailyLimit: 1000000, monthlyLimit: 5000000 }
    };

    return limits[tier] || limits[1];
  }

  /**
   * Generate transaction reference
   */
  generateTransactionReference(type) {
    const prefix = {
      deposit: 'DEP',
      withdrawal: 'WTH',
      transfer: 'TRF',
      payment: 'PAY',
      airtime: 'AIR',
      data: 'DAT',
      electricity: 'ELC',
      cable: 'CAB',
      school_fees: 'SCH'
    };

    const typePrefix = prefix[type] || 'TXN';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `${typePrefix}_${timestamp}_${random}`;
  }

  /**
   * Get transaction statistics
   */
  async getTransactionStats(userId, period = '30d') {
    try {
      const startDate = new Date();
      
      switch (period) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
        default:
          startDate.setDate(startDate.getDate() - 30);
      }

      const { data: transactions, error } = await supabaseAdmin
        .from('transactions')
        .select('transaction_type, amount, status, created_at')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString());

      if (error) {
        throw new Error('Failed to fetch transaction stats');
      }

      const stats = {
        totalTransactions: transactions.length,
        completedTransactions: transactions.filter(tx => tx.status === 'completed').length,
        failedTransactions: transactions.filter(tx => tx.status === 'failed').length,
        totalAmount: transactions
          .filter(tx => tx.status === 'completed')
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0),
        byType: {},
        byStatus: {
          completed: 0,
          pending: 0,
          failed: 0
        }
      };

      // Group by type
      transactions.forEach(tx => {
        if (!stats.byType[tx.transaction_type]) {
          stats.byType[tx.transaction_type] = {
            count: 0,
            amount: 0
          };
        }
        stats.byType[tx.transaction_type].count++;
        if (tx.status === 'completed') {
          stats.byType[tx.transaction_type].amount += parseFloat(tx.amount);
        }

        stats.byStatus[tx.status]++;
      });

      return {
        success: true,
        stats,
        period
      };

    } catch (error) {
      console.error('Transaction stats error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch transaction statistics'
      };
    }
  }
}

export default new TransactionService();