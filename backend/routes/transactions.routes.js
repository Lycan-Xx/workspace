/**
 * Transaction Routes
 * Handles all transaction operations and payment processing
 */

import express from 'express';
import AuthMiddleware from '../middleware/auth.js';
import TransactionService from '../services/transactionService.js';

const router = express.Router();

/**
 * POST /api/transactions
 * Create a new transaction
 */
router.post('/', 
  AuthMiddleware.verifyToken,
  AuthMiddleware.requireActiveAccount,
  async (req, res) => {
    try {
      const {
        type,
        amount,
        description,
        recipient_phone,
        recipient_name,
        service_provider,
        service_data
      } = req.body;

      // Validate required fields
      if (!type || !amount) {
        return res.status(400).json({
          success: false,
          error: 'Transaction type and amount are required'
        });
      }

      // Validate amount
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid amount'
        });
      }

      // Minimum transaction amount
      if (numAmount < 50) {
        return res.status(400).json({
          success: false,
          error: 'Minimum transaction amount is ₦50'
        });
      }

      const result = await TransactionService.createTransaction(req.user.id, {
        type,
        amount: numAmount,
        description,
        recipient_phone,
        recipient_name,
        service_provider,
        service_data
      });

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Create transaction error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create transaction'
      });
    }
  }
);

/**
 * GET /api/transactions
 * Get user's transactions with pagination and filters
 */
router.get('/', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const {
      limit = 20,
      offset = 0,
      type,
      status,
      start_date,
      end_date
    } = req.query;

    // Validate pagination parameters
    const numLimit = Math.min(parseInt(limit) || 20, 100); // Max 100 per request
    const numOffset = parseInt(offset) || 0;

    const options = {
      limit: numLimit,
      offset: numOffset,
      type: type || null,
      status: status || null,
      startDate: start_date || null,
      endDate: end_date || null
    };

    const result = await TransactionService.getUserTransactions(req.user.id, options);
    res.json(result);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
});

/**
 * GET /api/transactions/stats
 * Get transaction statistics
 */
router.get('/stats', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    const validPeriods = ['7d', '30d', '90d'];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid period. Must be 7d, 30d, or 90d'
      });
    }

    const result = await TransactionService.getTransactionStats(req.user.id, period);
    res.json(result);
  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction statistics'
    });
  }
});

/**
 * GET /api/transactions/:reference
 * Get transaction by reference
 */
router.get('/:reference', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        error: 'Transaction reference is required'
      });
    }

    const result = await TransactionService.getTransactionByReference(reference, req.user.id);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction'
    });
  }
});

/**
 * POST /api/transactions/airtime
 * Purchase airtime
 */
router.post('/airtime',
  AuthMiddleware.verifyToken,
  AuthMiddleware.requireActiveAccount,
  async (req, res) => {
    try {
      const { phone, amount, network } = req.body;

      if (!phone || !amount || !network) {
        return res.status(400).json({
          success: false,
          error: 'Phone number, amount, and network are required'
        });
      }

      // Validate phone format
      const phoneRegex = /^\+?234[789]\d{9}$|^0[789]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid Nigerian phone number'
        });
      }

      // Validate network
      const validNetworks = ['MTN', 'GLO', 'AIRTEL', '9MOBILE'];
      if (!validNetworks.includes(network.toUpperCase())) {
        return res.status(400).json({
          success: false,
          error: 'Invalid network. Must be MTN, GLO, AIRTEL, or 9MOBILE'
        });
      }

      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount < 50 || numAmount > 10000) {
        return res.status(400).json({
          success: false,
          error: 'Airtime amount must be between ₦50 and ₦10,000'
        });
      }

      const result = await TransactionService.createTransaction(req.user.id, {
        type: 'airtime',
        amount: numAmount,
        description: `Airtime purchase for ${phone}`,
        recipient_phone: phone,
        service_provider: network.toUpperCase(),
        service_data: {
          phone,
          network: network.toUpperCase(),
          amount: numAmount
        }
      });

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Airtime purchase error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to purchase airtime'
      });
    }
  }
);

/**
 * POST /api/transactions/data
 * Purchase data bundle
 */
router.post('/data',
  AuthMiddleware.verifyToken,
  AuthMiddleware.requireActiveAccount,
  async (req, res) => {
    try {
      const { phone, amount, network, plan } = req.body;

      if (!phone || !amount || !network || !plan) {
        return res.status(400).json({
          success: false,
          error: 'Phone number, amount, network, and plan are required'
        });
      }

      // Validate phone format
      const phoneRegex = /^\+?234[789]\d{9}$|^0[789]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid Nigerian phone number'
        });
      }

      const validNetworks = ['MTN', 'GLO', 'AIRTEL', '9MOBILE'];
      if (!validNetworks.includes(network.toUpperCase())) {
        return res.status(400).json({
          success: false,
          error: 'Invalid network'
        });
      }

      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount < 100) {
        return res.status(400).json({
          success: false,
          error: 'Invalid data bundle amount'
        });
      }

      const result = await TransactionService.createTransaction(req.user.id, {
        type: 'data',
        amount: numAmount,
        description: `Data bundle purchase for ${phone}`,
        recipient_phone: phone,
        service_provider: network.toUpperCase(),
        service_data: {
          phone,
          network: network.toUpperCase(),
          plan,
          amount: numAmount
        }
      });

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Data purchase error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to purchase data bundle'
      });
    }
  }
);

/**
 * POST /api/transactions/electricity
 * Pay electricity bill
 */
router.post('/electricity',
  AuthMiddleware.verifyToken,
  AuthMiddleware.requireActiveAccount,
  AuthMiddleware.requireTier(2), // Tier 2 required for bill payments
  async (req, res) => {
    try {
      const { meter_number, amount, disco, customer_name } = req.body;

      if (!meter_number || !amount || !disco) {
        return res.status(400).json({
          success: false,
          error: 'Meter number, amount, and distribution company are required'
        });
      }

      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount < 500) {
        return res.status(400).json({
          success: false,
          error: 'Minimum electricity bill payment is ₦500'
        });
      }

      const result = await TransactionService.createTransaction(req.user.id, {
        type: 'electricity',
        amount: numAmount,
        description: `Electricity bill payment for ${meter_number}`,
        service_provider: disco.toUpperCase(),
        service_data: {
          meter_number,
          disco: disco.toUpperCase(),
          customer_name,
          amount: numAmount
        }
      });

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Electricity payment error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to pay electricity bill'
      });
    }
  }
);

/**
 * POST /api/transactions/cable
 * Pay cable TV subscription
 */
router.post('/cable',
  AuthMiddleware.verifyToken,
  AuthMiddleware.requireActiveAccount,
  AuthMiddleware.requireTier(2),
  async (req, res) => {
    try {
      const { smartcard_number, amount, provider, package_name, customer_name } = req.body;

      if (!smartcard_number || !amount || !provider || !package_name) {
        return res.status(400).json({
          success: false,
          error: 'Smartcard number, amount, provider, and package are required'
        });
      }

      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount < 1000) {
        return res.status(400).json({
          success: false,
          error: 'Minimum cable TV payment is ₦1,000'
        });
      }

      const result = await TransactionService.createTransaction(req.user.id, {
        type: 'cable',
        amount: numAmount,
        description: `Cable TV subscription for ${smartcard_number}`,
        service_provider: provider.toUpperCase(),
        service_data: {
          smartcard_number,
          provider: provider.toUpperCase(),
          package_name,
          customer_name,
          amount: numAmount
        }
      });

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Cable payment error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to pay cable TV subscription'
      });
    }
  }
);

/**
 * POST /api/transactions/transfer
 * Transfer money to another user
 */
router.post('/transfer',
  AuthMiddleware.verifyToken,
  AuthMiddleware.requireActiveAccount,
  AuthMiddleware.requireTier(2), // Tier 2 required for transfers
  async (req, res) => {
    try {
      const { recipient_account, amount, description, recipient_name } = req.body;

      if (!recipient_account || !amount) {
        return res.status(400).json({
          success: false,
          error: 'Recipient account and amount are required'
        });
      }

      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount < 100) {
        return res.status(400).json({
          success: false,
          error: 'Minimum transfer amount is ₦100'
        });
      }

      // Validate recipient account exists
      const { data: recipientAccount, error: recipientError } = await supabaseAdmin
        .from('accounts')
        .select(`
          id,
          user_id,
          users (
            display_name,
            email
          )
        `)
        .eq('account_number', recipient_account)
        .eq('is_active', true)
        .single();

      if (recipientError || !recipientAccount) {
        return res.status(400).json({
          success: false,
          error: 'Recipient account not found'
        });
      }

      // Prevent self-transfer
      if (recipientAccount.user_id === req.user.id) {
        return res.status(400).json({
          success: false,
          error: 'Cannot transfer to your own account'
        });
      }

      const result = await TransactionService.createTransaction(req.user.id, {
        type: 'transfer',
        amount: numAmount,
        description: description || `Transfer to ${recipient_account}`,
        recipient_name: recipient_name || recipientAccount.users.display_name,
        service_data: {
          recipient_account,
          recipient_user_id: recipientAccount.user_id,
          recipient_name: recipient_name || recipientAccount.users.display_name
        }
      });

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Transfer error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process transfer'
      });
    }
  }
);

export default router;