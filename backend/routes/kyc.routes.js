/**
 * KYC Routes
 * Handles user verification, tier upgrades, and document management
 */

import express from 'express';
import AuthMiddleware from '../middleware/auth.js';
import KYCService from '../services/kycService.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/kyc/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${req.user.id}-${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
    }
  }
});

/**
 * GET /api/kyc/status
 * Get user's KYC status and tier information
 */
router.get('/status', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const result = await KYCService.getKYCStatus(req.user.id);
    res.json(result);
  } catch (error) {
    console.error('KYC status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch KYC status'
    });
  }
});

/**
 * POST /api/kyc/bvn
 * Update user's BVN
 */
router.post('/bvn', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const { bvn } = req.body;

    if (!bvn) {
      return res.status(400).json({
        success: false,
        error: 'BVN is required'
      });
    }

    const result = await KYCService.updateBVN(req.user.id, bvn);
    res.json(result);
  } catch (error) {
    console.error('BVN update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update BVN'
    });
  }
});

/**
 * POST /api/kyc/phone/send-otp
 * Send OTP to phone number
 */
router.post('/phone/send-otp', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }

    // Validate phone format (Nigerian numbers)
    const phoneRegex = /^\+234[789]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Nigerian phone number format. Use +234XXXXXXXXX'
      });
    }

    const result = await KYCService.sendOTP(phone);
    res.json(result);
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send OTP'
    });
  }
});

/**
 * POST /api/kyc/phone/verify
 * Verify phone number with OTP
 */
router.post('/phone/verify', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and OTP are required'
      });
    }

    const result = await KYCService.verifyPhone(req.user.id, phone, otp);
    res.json(result);
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify phone number'
    });
  }
});

/**
 * POST /api/kyc/documents/upload
 * Upload KYC document
 */
router.post('/documents/upload', 
  AuthMiddleware.verifyToken,
  upload.single('document'),
  async (req, res) => {
    try {
      const { document_type } = req.body;

      if (!document_type) {
        return res.status(400).json({
          success: false,
          error: 'Document type is required'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Document file is required'
        });
      }

      // In production, upload to cloud storage (AWS S3, Cloudinary, etc.)
      const file_url = `/uploads/kyc/${req.file.filename}`;

      const result = await KYCService.uploadDocument(req.user.id, {
        document_type,
        file_url,
        file_name: req.file.originalname
      });

      res.json(result);
    } catch (error) {
      console.error('Document upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload document'
      });
    }
  }
);

/**
 * GET /api/kyc/documents
 * Get user's uploaded documents
 */
router.get('/documents', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const { data: documents, error } = await supabaseAdmin
      .from('kyc_documents')
      .select('*')
      .eq('user_id', req.user.id)
      .order('uploaded_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch documents');
    }

    res.json({
      success: true,
      documents: documents || []
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch documents'
    });
  }
});

/**
 * POST /api/kyc/upgrade
 * Request tier upgrade
 */
router.post('/upgrade', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const result = await KYCService.checkTierUpgrade(req.user.id);
    res.json(result);
  } catch (error) {
    console.error('Tier upgrade error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process tier upgrade'
    });
  }
});

/**
 * GET /api/kyc/tier-limits/:tier
 * Get tier limits and features
 */
router.get('/tier-limits/:tier', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const tier = parseInt(req.params.tier);

    if (!tier || tier < 1 || tier > 3) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tier. Must be 1, 2, or 3'
      });
    }

    const limits = KYCService.getTierLimits(tier);

    res.json({
      success: true,
      tier,
      limits
    });
  } catch (error) {
    console.error('Get tier limits error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tier limits'
    });
  }
});

// Admin routes (for document verification)
/**
 * PUT /api/kyc/admin/documents/:documentId/verify
 * Verify uploaded document (admin only)
 */
router.put('/admin/documents/:documentId/verify',
  AuthMiddleware.verifyToken,
  // Add admin role check here
  async (req, res) => {
    try {
      const { documentId } = req.params;
      const { status, notes } = req.body;

      if (!['verified', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Status must be either "verified" or "rejected"'
        });
      }

      const result = await KYCService.verifyDocument(documentId, status, notes);
      res.json(result);
    } catch (error) {
      console.error('Document verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to verify document'
      });
    }
  }
);

export default router;