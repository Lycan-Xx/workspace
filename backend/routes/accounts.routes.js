/**
 * Account Routes
 * Handles account management, balance inquiries, and account operations
 */

import express from 'express';
import AuthMiddleware from '../middleware/auth.js';
import { supabaseAdmin } from '../supabase/config.js';

const router = express.Router();

/**
 * GET /api/accounts
 * Get user's accounts/wallets
 */
router.get('/', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const { data: accounts, error } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch accounts');
    }

    // Format balance for display
    const formattedAccounts = accounts.map(account => ({
      ...account,
      balance: parseFloat(account.balance),
      formatted_balance: `₦${parseFloat(account.balance).toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
    }));

    res.json({
      success: true,
      accounts: formattedAccounts
    });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch accounts'
    });
  }
});

/**
 * GET /api/accounts/:accountId
 * Get specific account details
 */
router.get('/:accountId', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const { accountId } = req.params;

    const { data: account, error } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .eq('user_id', req.user.id)
      .single();

    if (error || !account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    res.json({
      success: true,
      account: {
        ...account,
        balance: parseFloat(account.balance),
        formatted_balance: `₦${parseFloat(account.balance).toLocaleString('en-NG', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`
      }
    });
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch account'
    });
  }
});

/**
 * GET /api/accounts/:accountId/balance
 * Get account balance
 */
router.get('/:accountId/balance', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const { accountId } = req.params;

    const { data: account, error } = await supabaseAdmin
      .from('accounts')
      .select('balance, currency, account_number')
      .eq('id', accountId)
      .eq('user_id', req.user.id)
      .eq('is_active', true)
      .single();

    if (error || !account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    const balance = parseFloat(account.balance);

    res.json({
      success: true,
      balance: {
        amount: balance,
        currency: account.currency,
        formatted: `₦${balance.toLocaleString('en-NG', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`,
        account_number: account.account_number
      }
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch account balance'
    });
  }
});

/**
 * GET /api/accounts/primary/balance
 * Get primary account balance (convenience endpoint)
 */
router.get('/primary/balance', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const { data: account, error } = await supabaseAdmin
      .from('accounts')
      .select('balance, currency, account_number')
      .eq('user_id', req.user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (error || !account) {
      return res.status(404).json({
        success: false,
        error: 'No active account found'
      });
    }

    const balance = parseFloat(account.balance);

    res.json({
      success: true,
      balance: {
        amount: balance,
        currency: account.currency,
        formatted: `₦${balance.toLocaleString('en-NG', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`,
        account_number: account.account_number
      }
    });
  } catch (error) {
    console.error('Get primary balance error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch account balance'
    });
  }
});

/**
 * POST /api/accounts/:accountId/freeze
 * Freeze/unfreeze account
 */
router.post('/:accountId/freeze', 
  AuthMiddleware.verifyToken,
  AuthMiddleware.requireTier(2),
  async (req, res) => {
    try {
      const { accountId } = req.params;
      const { freeze = true, reason } = req.body;

      // Check if account belongs to user
      const { data: account, error: fetchError } = await supabaseAdmin
        .from('accounts')
        .select('id, is_active')
        .eq('id', accountId)
        .eq('user_id', req.user.id)
        .single();

      if (fetchError || !account) {
        return res.status(404).json({
          success: false,
          error: 'Account not found'
        });
      }

      // Update account status
      const { error: updateError } = await supabaseAdmin
        .from('accounts')
        .update({
          is_active: !freeze,
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId);

      if (updateError) {
        throw new Error('Failed to update account status');
      }

      res.json({
        success: true,
        message: freeze ? 'Account frozen successfully' : 'Account unfrozen successfully',
        account: {
          id: accountId,
          is_active: !freeze
        }
      });
    } catch (error) {
      console.error('Freeze account error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update account status'
      });
    }
  }
);

/**
 * GET /api/accounts/:accountId/statement
 * Get account statement
 */
router.get('/:accountId/statement', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const { accountId } = req.params;
    const { 
      start_date, 
      end_date, 
      limit = 50,
      offset = 0 
    } = req.query;

    // Verify account ownership
    const { data: account, error: accountError } = await supabaseAdmin
      .from('accounts')
      .select('id, account_number, balance')
      .eq('id', accountId)
      .eq('user_id', req.user.id)
      .single();

    if (accountError || !account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    // Build query for transactions
    let query = supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('account_id', accountId)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (start_date) {
      query = query.gte('created_at', start_date);
    }

    if (end_date) {
      query = query.lte('created_at', end_date);
    }

    const { data: transactions, error: transactionError } = await query;

    if (transactionError) {
      throw new Error('Failed to fetch transactions');
    }

    // Calculate running balance for each transaction
    let runningBalance = parseFloat(account.balance);
    const transactionsWithBalance = transactions.map(tx => {
      const txAmount = parseFloat(tx.amount);
      const isCredit = ['deposit'].includes(tx.transaction_type);
      const isDebit = ['withdrawal', 'transfer', 'payment', 'airtime', 'data', 'electricity', 'cable', 'school_fees'].includes(tx.transaction_type);

      if (isCredit && tx.status === 'completed') {
        runningBalance -= txAmount; // Subtract because we're going backwards
      } else if (isDebit && tx.status === 'completed') {
        runningBalance += txAmount; // Add because we're going backwards
      }

      return {
        ...tx,
        balance_after: runningBalance + (isCredit && tx.status === 'completed' ? txAmount : 0) - (isDebit && tx.status === 'completed' ? txAmount : 0),
        formatted_amount: `₦${txAmount.toLocaleString('en-NG', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`,
        transaction_direction: isCredit ? 'credit' : 'debit'
      };
    });

    // Reverse to show correct running balance
    transactionsWithBalance.reverse();

    res.json({
      success: true,
      statement: {
        account: {
          id: account.id,
          account_number: account.account_number,
          current_balance: parseFloat(account.balance),
          formatted_balance: `₦${parseFloat(account.balance).toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`
        },
        transactions: transactionsWithBalance,
        period: {
          start_date: start_date || null,
          end_date: end_date || null
        },
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          count: transactions.length
        }
      }
    });
  } catch (error) {
    console.error('Get statement error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch account statement'
    });
  }
});

/**
 * GET /api/accounts/lookup/:accountNumber
 * Lookup account by account number (for transfers)
 */
router.get('/lookup/:accountNumber', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const { accountNumber } = req.params;

    if (!accountNumber || accountNumber.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Invalid account number'
      });
    }

    const { data: account, error } = await supabaseAdmin
      .from('accounts')
      .select(`
        id,
        account_number,
        users (
          display_name,
          account_type
        )
      `)
      .eq('account_number', accountNumber)
      .eq('is_active', true)
      .single();

    if (error || !account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    // Don't return full details for security
    res.json({
      success: true,
      account: {
        account_number: account.account_number,
        account_name: account.users.display_name,
        account_type: account.users.account_type
      }
    });
  } catch (error) {
    console.error('Account lookup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to lookup account'
    });
  }
});

/**
 * GET /api/accounts/summary
 * Get account summary with totals
 */
router.get('/summary', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    // Get all user accounts
    const { data: accounts, error: accountsError } = await supabaseAdmin
      .from('accounts')
      .select('id, account_number, balance, currency, is_active')
      .eq('user_id', req.user.id);

    if (accountsError) {
      throw new Error('Failed to fetch accounts');
    }

    // Get recent transactions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentTransactions, error: transactionsError } = await supabaseAdmin
      .from('transactions')
      .select('transaction_type, amount, status')
      .eq('user_id', req.user.id)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .eq('status', 'completed');

    if (transactionsError) {
      console.warn('Failed to fetch recent transactions:', transactionsError);
    }

    // Calculate totals
    const totalBalance = accounts.reduce((sum, account) => {
      return sum + (account.is_active ? parseFloat(account.balance) : 0);
    }, 0);

    const activeAccounts = accounts.filter(account => account.is_active);

    // Calculate transaction totals
    const transactionTotals = (recentTransactions || []).reduce((totals, tx) => {
      const amount = parseFloat(tx.amount);
      
      if (['deposit'].includes(tx.transaction_type)) {
        totals.totalCredits += amount;
      } else if (['withdrawal', 'transfer', 'payment', 'airtime', 'data', 'electricity', 'cable', 'school_fees'].includes(tx.transaction_type)) {
        totals.totalDebits += amount;
      }
      
      return totals;
    }, { totalCredits: 0, totalDebits: 0 });

    res.json({
      success: true,
      summary: {
        total_balance: totalBalance,
        formatted_total_balance: `₦${totalBalance.toLocaleString('en-NG', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`,
        active_accounts: activeAccounts.length,
        total_accounts: accounts.length,
        last_30_days: {
          total_credits: transactionTotals.totalCredits,
          total_debits: transactionTotals.totalDebits,
          net_flow: transactionTotals.totalCredits - transactionTotals.totalDebits,
          transaction_count: (recentTransactions || []).length
        },
        accounts: accounts.map(account => ({
          id: account.id,
          account_number: account.account_number,
          balance: parseFloat(account.balance),
          formatted_balance: `₦${parseFloat(account.balance).toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`,
          currency: account.currency,
          is_active: account.is_active
        }))
      }
    });
  } catch (error) {
    console.error('Get account summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch account summary'
    });
  }
});

export default router;