
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiService from './supabase/services/apiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-replit-domain.replit.dev']
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Supabase Backend Server Running',
    timestamp: new Date().toISOString()
  });
});

// Authentication routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const result = await apiService.signup(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const result = await apiService.login(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const result = await apiService.logout();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await apiService.resetPassword(email);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// OTP routes
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    const result = await apiService.sendOTP(phone);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const result = await apiService.verifyOTP(phone, otp);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User routes
app.get('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await apiService.getCurrentUser(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await apiService.updateUser(userId, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Accounts routes
app.get('/api/user/:userId/accounts', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await apiService.getUserAccounts(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Transactions routes
app.post('/api/transactions', async (req, res) => {
  try {
    const result = await apiService.createTransaction(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/user/:userId/transactions', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    const result = await apiService.getUserTransactions(userId, parseInt(limit) || 50);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Virtual cards routes
app.post('/api/user/:userId/virtual-cards', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await apiService.createVirtualCard(userId, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/user/:userId/virtual-cards', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await apiService.getUserVirtualCards(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Supabase Backend Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Server accessible at: https://${process.env.REPL_SLUG || 'your-repl'}.${process.env.REPL_OWNER || 'your-username'}.replit.dev`);
});

export default app;
