/**
 * Enhanced Authentication Middleware
 * Integrates with Supabase JWT tokens and provides role-based access control
 */

import { supabaseAdmin } from '../supabase/config.js';
import jwt from 'jsonwebtoken';

class AuthMiddleware {
  /**
   * Verify JWT token and extract user information
   */
  static async verifyToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'No token provided',
          code: 'NO_TOKEN'
        });
      }

      const token = authHeader.substring(7);

      // Verify token with Supabase
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired token',
          code: 'INVALID_TOKEN'
        });
      }

      // Get user profile from database
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('users')
        .select(`
          *,
          accounts (
            id,
            account_number,
            balance,
            currency,
            is_active
          )
        `)
        .eq('id', user.id)
        .single();

      if (profileError) {
        return res.status(401).json({
          success: false,
          error: 'User profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      // Attach user info to request
      req.user = {
        id: user.id,
        email: user.email,
        profile: profile,
        token: token
      };

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        success: false,
        error: 'Authentication failed',
        code: 'AUTH_ERROR'
      });
    }
  }

  /**
   * Check if user has required tier level
   */
  static requireTier(minTier) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const userTier = req.user.profile.tier || 1;
      
      if (userTier < minTier) {
        return res.status(403).json({
          success: false,
          error: `Tier ${minTier} required. Current tier: ${userTier}`,
          code: 'INSUFFICIENT_TIER',
          requiredTier: minTier,
          currentTier: userTier
        });
      }

      next();
    };
  }

  /**
   * Check if user account type matches required type
   */
  static requireAccountType(requiredType) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const userAccountType = req.user.profile.account_type;
      
      if (userAccountType !== requiredType) {
        return res.status(403).json({
          success: false,
          error: `${requiredType} account required`,
          code: 'INVALID_ACCOUNT_TYPE',
          required: requiredType,
          current: userAccountType
        });
      }

      next();
    };
  }

  /**
   * Check if user is verified
   */
  static requireVerification(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!req.user.profile.is_verified) {
      return res.status(403).json({
        success: false,
        error: 'Account verification required',
        code: 'VERIFICATION_REQUIRED'
      });
    }

    next();
  }

  /**
   * Check if user has active account
   */
  static requireActiveAccount(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (req.user.profile.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Account is not active',
        code: 'ACCOUNT_INACTIVE',
        status: req.user.profile.status
      });
    }

    // Check if user has at least one active account
    const activeAccounts = req.user.profile.accounts?.filter(acc => acc.is_active);
    if (!activeAccounts || activeAccounts.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'No active wallet found',
        code: 'NO_ACTIVE_WALLET'
      });
    }

    next();
  }

  /**
   * Optional authentication - doesn't fail if no token
   */
  static async optionalAuth(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
      }

      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

      if (!error && user) {
        const { data: profile } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          req.user = {
            id: user.id,
            email: user.email,
            profile: profile,
            token: token
          };
        }
      }

      next();
    } catch (error) {
      // Don't fail on optional auth errors
      next();
    }
  }
}

export default AuthMiddleware;