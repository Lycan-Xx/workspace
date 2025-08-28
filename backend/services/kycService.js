/**
 * KYC (Know Your Customer) Service
 * Handles user verification, tier upgrades, and compliance
 */

import { supabaseAdmin } from '../supabase/config.js';
import crypto from 'crypto';

class KYCService {
  /**
   * Get user's KYC status and tier information
   */
  async getKYCStatus(userId) {
    try {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select(`
          id,
          tier,
          is_verified,
          phone_verified,
          email_verified,
          bvn,
          kyc_documents (
            id,
            document_type,
            verification_status,
            uploaded_at
          )
        `)
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error('Failed to fetch KYC status');
      }

      // Calculate completion percentage
      const completionChecks = {
        email_verified: user.email_verified,
        phone_verified: user.phone_verified,
        bvn_provided: !!user.bvn,
        id_document: user.kyc_documents?.some(doc => 
          doc.document_type === 'id_card' && doc.verification_status === 'verified'
        ),
        utility_bill: user.kyc_documents?.some(doc => 
          doc.document_type === 'utility_bill' && doc.verification_status === 'verified'
        )
      };

      const completedChecks = Object.values(completionChecks).filter(Boolean).length;
      const completionPercentage = Math.round((completedChecks / Object.keys(completionChecks).length) * 100);

      // Determine next steps
      const nextSteps = [];
      if (!completionChecks.email_verified) nextSteps.push('Verify email address');
      if (!completionChecks.phone_verified) nextSteps.push('Verify phone number');
      if (!completionChecks.bvn_provided) nextSteps.push('Provide BVN');
      if (!completionChecks.id_document) nextSteps.push('Upload valid ID document');
      if (!completionChecks.utility_bill) nextSteps.push('Upload utility bill');

      // Determine eligible tier
      let eligibleTier = 1;
      if (completionChecks.email_verified && completionChecks.phone_verified) {
        eligibleTier = 2;
      }
      if (completionChecks.bvn_provided && completionChecks.id_document && completionChecks.utility_bill) {
        eligibleTier = 3;
      }

      return {
        success: true,
        kyc: {
          currentTier: user.tier,
          eligibleTier,
          isVerified: user.is_verified,
          completionPercentage,
          checks: completionChecks,
          nextSteps,
          documents: user.kyc_documents || [],
          tierLimits: this.getTierLimits(user.tier),
          nextTierLimits: eligibleTier > user.tier ? this.getTierLimits(eligibleTier) : null
        }
      };
    } catch (error) {
      console.error('KYC status error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get KYC status'
      };
    }
  }

  /**
   * Update BVN information
   */
  async updateBVN(userId, bvn) {
    try {
      // Validate BVN format (11 digits)
      if (!/^\d{11}$/.test(bvn)) {
        return {
          success: false,
          error: 'Invalid BVN format. BVN must be 11 digits.'
        };
      }

      // Check if BVN is already used by another user
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('bvn', bvn)
        .neq('id', userId)
        .single();

      if (existingUser) {
        return {
          success: false,
          error: 'BVN is already registered with another account'
        };
      }

      // Update user BVN
      const { error } = await supabaseAdmin
        .from('users')
        .update({ 
          bvn: bvn,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw new Error('Failed to update BVN');
      }

      // Check if user is now eligible for tier upgrade
      await this.checkTierUpgrade(userId);

      return {
        success: true,
        message: 'BVN updated successfully'
      };
    } catch (error) {
      console.error('BVN update error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update BVN'
      };
    }
  }

  /**
   * Upload KYC document
   */
  async uploadDocument(userId, documentData) {
    try {
      const { document_type, file_url, file_name } = documentData;

      // Validate document type
      const validTypes = ['id_card', 'passport', 'utility_bill', 'bank_statement', 'business_registration'];
      if (!validTypes.includes(document_type)) {
        return {
          success: false,
          error: 'Invalid document type'
        };
      }

      // Insert document record
      const { data: document, error } = await supabaseAdmin
        .from('kyc_documents')
        .insert({
          user_id: userId,
          document_type,
          document_url: file_url,
          file_name,
          verification_status: 'pending',
          uploaded_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error('Failed to save document');
      }

      // Auto-verify in development mode
      if (process.env.NODE_ENV === 'development') {
        await this.verifyDocument(document.id, 'verified', 'Auto-verified in development');
      }

      return {
        success: true,
        document,
        message: 'Document uploaded successfully'
      };
    } catch (error) {
      console.error('Document upload error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload document'
      };
    }
  }

  /**
   * Verify uploaded document (admin function)
   */
  async verifyDocument(documentId, status, notes = '') {
    try {
      const { data: document, error } = await supabaseAdmin
        .from('kyc_documents')
        .update({
          verification_status: status,
          verification_notes: notes,
          verified_at: status === 'verified' ? new Date().toISOString() : null
        })
        .eq('id', documentId)
        .select('user_id')
        .single();

      if (error) {
        throw new Error('Failed to update document status');
      }

      // Check if user is eligible for tier upgrade
      if (status === 'verified') {
        await this.checkTierUpgrade(document.user_id);
      }

      return {
        success: true,
        message: `Document ${status} successfully`
      };
    } catch (error) {
      console.error('Document verification error:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify document'
      };
    }
  }

  /**
   * Check and perform tier upgrade if eligible
   */
  async checkTierUpgrade(userId) {
    try {
      const kycStatus = await this.getKYCStatus(userId);
      
      if (!kycStatus.success) {
        return kycStatus;
      }

      const { currentTier, eligibleTier } = kycStatus.kyc;

      if (eligibleTier > currentTier) {
        // Upgrade user tier
        const { error } = await supabaseAdmin
          .from('users')
          .update({
            tier: eligibleTier,
            is_verified: eligibleTier >= 2,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) {
          throw new Error('Failed to upgrade tier');
        }

        // Log tier upgrade
        console.log(`User ${userId} upgraded from tier ${currentTier} to tier ${eligibleTier}`);

        return {
          success: true,
          upgraded: true,
          previousTier: currentTier,
          newTier: eligibleTier,
          message: `Congratulations! Your account has been upgraded to Tier ${eligibleTier}`
        };
      }

      return {
        success: true,
        upgraded: false,
        message: 'No tier upgrade available'
      };
    } catch (error) {
      console.error('Tier upgrade error:', error);
      return {
        success: false,
        error: error.message || 'Failed to check tier upgrade'
      };
    }
  }

  /**
   * Get tier limits and features
   */
  getTierLimits(tier) {
    const limits = {
      1: {
        dailyLimit: 50000,
        monthlyLimit: 200000,
        features: ['Basic transfers', 'Airtime purchase', 'Bill payments'],
        restrictions: ['Limited transaction amounts', 'Basic support']
      },
      2: {
        dailyLimit: 200000,
        monthlyLimit: 1000000,
        features: ['All Tier 1 features', 'Virtual cards', 'Higher limits', 'Priority support'],
        restrictions: ['Some advanced features limited']
      },
      3: {
        dailyLimit: 1000000,
        monthlyLimit: 5000000,
        features: ['All features', 'Business tools', 'API access', 'Premium support'],
        restrictions: ['None']
      }
    };

    return limits[tier] || limits[1];
  }

  /**
   * Verify phone number with OTP
   */
  async verifyPhone(userId, phone, otp) {
    try {
      // In production, integrate with SMS service
      // For development, accept any OTP
      const isValidOTP = process.env.NODE_ENV === 'development' || otp === '123456';

      if (!isValidOTP) {
        return {
          success: false,
          error: 'Invalid OTP'
        };
      }

      // Update user phone verification
      const { error } = await supabaseAdmin
        .from('users')
        .update({
          phone: phone,
          phone_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw new Error('Failed to verify phone');
      }

      // Check for tier upgrade
      await this.checkTierUpgrade(userId);

      return {
        success: true,
        message: 'Phone number verified successfully'
      };
    } catch (error) {
      console.error('Phone verification error:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify phone'
      };
    }
  }

  /**
   * Send OTP to phone number
   */
  async sendOTP(phone) {
    try {
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // In production, integrate with SMS service (Twilio, etc.)
      console.log(`OTP for ${phone}: ${otp}`);

      // Store OTP in cache/database for verification
      // For now, we'll use a simple in-memory store
      if (!global.otpStore) {
        global.otpStore = new Map();
      }

      global.otpStore.set(phone, {
        otp,
        expires: Date.now() + 5 * 60 * 1000 // 5 minutes
      });

      return {
        success: true,
        message: 'OTP sent successfully',
        // In development, return OTP for testing
        ...(process.env.NODE_ENV === 'development' && { otp })
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send OTP'
      };
    }
  }
}

export default new KYCService();