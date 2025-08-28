/**
 * Centralized Error Handling Utilities
 * Provides error mapping, logging, recovery mechanisms, and state management
 * for the eVault authentication system
 */

// Error categories for better organization
export const ERROR_CATEGORIES = {
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  NETWORK: 'network',
  SESSION: 'session',
  AUTHORIZATION: 'authorization',
  SYSTEM: 'system'
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Comprehensive error mapping for user-friendly messages
 * Maps technical errors to user-friendly messages with context
 */
export const ERROR_MESSAGES = {
  // Authentication errors
  'Invalid login credentials': {
    message: 'Invalid email or password. Please check your credentials and try again.',
    category: ERROR_CATEGORIES.AUTHENTICATION,
    severity: ERROR_SEVERITY.MEDIUM,
    field: 'credentials',
    recoverable: true,
    suggestions: ['Check your email spelling', 'Verify your password', 'Try password reset if needed']
  },
  'User already registered': {
    message: 'An account with this email already exists. Please try logging in instead.',
    category: ERROR_CATEGORIES.AUTHENTICATION,
    severity: ERROR_SEVERITY.MEDIUM,
    field: 'email',
    recoverable: true,
    suggestions: ['Try logging in', 'Use password reset if you forgot your password', 'Use a different email address']
  },
  'Email not confirmed': {
    message: 'Please check your email and confirm your account before logging in.',
    category: ERROR_CATEGORIES.AUTHENTICATION,
    severity: ERROR_SEVERITY.MEDIUM,
    field: 'email',
    recoverable: true,
    suggestions: ['Check your email inbox', 'Check spam folder', 'Request new confirmation email']
  },
  'Too many requests': {
    message: 'Too many attempts. Please wait a few minutes before trying again.',
    category: ERROR_CATEGORIES.NETWORK,
    severity: ERROR_SEVERITY.HIGH,
    recoverable: true,
    retryAfter: 300000, // 5 minutes
    suggestions: ['Wait 5 minutes before retrying', 'Check your internet connection']
  },
  'User not found': {
    message: 'No account found with this email address. Please check your email or sign up.',
    category: ERROR_CATEGORIES.AUTHENTICATION,
    severity: ERROR_SEVERITY.MEDIUM,
    field: 'email',
    recoverable: true,
    suggestions: ['Check email spelling', 'Try signing up instead', 'Use a different email address']
  },
  'Invalid email': {
    message: 'Please enter a valid email address.',
    category: ERROR_CATEGORIES.VALIDATION,
    severity: ERROR_SEVERITY.LOW,
    field: 'email',
    recoverable: true,
    suggestions: ['Check email format', 'Ensure @ symbol is present', 'Include domain extension']
  },
  'Password should be at least 6 characters': {
    message: 'Password must be at least 6 characters long.',
    category: ERROR_CATEGORIES.VALIDATION,
    severity: ERROR_SEVERITY.LOW,
    field: 'password',
    recoverable: true,
    suggestions: ['Use at least 6 characters', 'Include letters and numbers', 'Add special characters for security']
  },
  'Signup is disabled': {
    message: 'Account creation is currently disabled. Please contact support.',
    category: ERROR_CATEGORIES.SYSTEM,
    severity: ERROR_SEVERITY.HIGH,
    recoverable: false,
    suggestions: ['Contact support team', 'Try again later']
  },
  'Email rate limit exceeded': {
    message: 'Too many signup attempts. Please wait a few minutes before trying again.',
    category: ERROR_CATEGORIES.NETWORK,
    severity: ERROR_SEVERITY.HIGH,
    recoverable: true,
    retryAfter: 300000, // 5 minutes
    suggestions: ['Wait 5 minutes before retrying', 'Check your internet connection']
  },
  'Network Error': {
    message: 'Connection failed. Please check your internet connection and try again.',
    category: ERROR_CATEGORIES.NETWORK,
    severity: ERROR_SEVERITY.HIGH,
    recoverable: true,
    suggestions: ['Check internet connection', 'Try again in a moment', 'Contact support if problem persists']
  },
  'Session expired': {
    message: 'Your session has expired. Please log in again.',
    category: ERROR_CATEGORIES.SESSION,
    severity: ERROR_SEVERITY.MEDIUM,
    recoverable: true,
    suggestions: ['Log in again', 'Your data is safe']
  },
  'Unauthorized': {
    message: 'You are not authorized to perform this action.',
    category: ERROR_CATEGORIES.AUTHORIZATION,
    severity: ERROR_SEVERITY.HIGH,
    recoverable: false,
    suggestions: ['Log in with appropriate permissions', 'Contact administrator']
  }
};

/**
 * Development-specific error logging utility
 * Provides detailed logging for debugging purposes
 */
export class ErrorLogger {
  static log(error, context = {}) {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const timestamp = new Date().toISOString();
    const errorInfo = this.extractErrorInfo(error);
    
    console.group(`🚨 Error Log - ${timestamp}`);
    console.error('Error Message:', errorInfo.message);
    console.error('Error Type:', errorInfo.type);
    console.error('Category:', errorInfo.category);
    console.error('Severity:', errorInfo.severity);
    
    if (context.component) {
      console.error('Component:', context.component);
    }
    
    if (context.action) {
      console.error('Action:', context.action);
    }
    
    if (context.userInput) {
      console.error('User Input:', context.userInput);
    }
    
    if (errorInfo.originalError) {
      console.error('Original Error:', errorInfo.originalError);
    }
    
    if (errorInfo.stack) {
      console.error('Stack Trace:', errorInfo.stack);
    }
    
    if (errorInfo.suggestions && errorInfo.suggestions.length > 0) {
      console.info('Suggestions:', errorInfo.suggestions);
    }
    
    console.groupEnd();
  }

  static extractErrorInfo(error) {
    if (typeof error === 'string') {
      const errorConfig = ERROR_MESSAGES[error];
      return {
        message: error,
        type: 'string',
        category: errorConfig?.category || ERROR_CATEGORIES.SYSTEM,
        severity: errorConfig?.severity || ERROR_SEVERITY.MEDIUM,
        suggestions: errorConfig?.suggestions || []
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        type: error.constructor.name,
        category: ERROR_CATEGORIES.SYSTEM,
        severity: ERROR_SEVERITY.HIGH,
        stack: error.stack,
        originalError: error
      };
    }

    if (typeof error === 'object' && error !== null) {
      return {
        message: error.message || 'Unknown error',
        type: 'object',
        category: error.category || ERROR_CATEGORIES.SYSTEM,
        severity: error.severity || ERROR_SEVERITY.MEDIUM,
        originalError: error
      };
    }

    return {
      message: 'Unknown error occurred',
      type: 'unknown',
      category: ERROR_CATEGORIES.SYSTEM,
      severity: ERROR_SEVERITY.HIGH
    };
  }
}

/**
 * Error recovery mechanisms
 * Provides automatic retry logic and recovery strategies
 */
export class ErrorRecovery {
  static retryAttempts = new Map();
  static maxRetries = 3;
  static baseDelay = 1000; // 1 second

  /**
   * Attempt to recover from an error with retry logic
   */
  static async attemptRecovery(operation, errorKey, options = {}) {
    const {
      maxRetries = this.maxRetries,
      baseDelay = this.baseDelay,
      exponentialBackoff = true,
      onRetry = null
    } = options;

    const attempts = this.retryAttempts.get(errorKey) || 0;

    if (attempts >= maxRetries) {
      this.retryAttempts.delete(errorKey);
      throw new Error(`Max retry attempts (${maxRetries}) exceeded for ${errorKey}`);
    }

    try {
      const result = await operation();
      this.retryAttempts.delete(errorKey); // Clear on success
      return result;
    } catch (error) {
      const newAttempts = attempts + 1;
      this.retryAttempts.set(errorKey, newAttempts);

      const errorInfo = ERROR_MESSAGES[error.message] || {};
      
      // Don't retry if error is not recoverable
      if (errorInfo.recoverable === false) {
        this.retryAttempts.delete(errorKey);
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = exponentialBackoff 
        ? baseDelay * Math.pow(2, attempts)
        : baseDelay;

      ErrorLogger.log(error, {
        action: 'retry_attempt',
        attempt: newAttempts,
        maxRetries,
        nextRetryIn: delay
      });

      if (onRetry) {
        onRetry(newAttempts, maxRetries, delay);
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));

      // Recursive retry
      return this.attemptRecovery(operation, errorKey, options);
    }
  }

  /**
   * Check if an error is recoverable
   */
  static isRecoverable(error) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorConfig = ERROR_MESSAGES[errorMessage];
    return errorConfig?.recoverable !== false;
  }

  /**
   * Get retry delay for rate-limited errors
   */
  static getRetryDelay(error) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorConfig = ERROR_MESSAGES[errorMessage];
    return errorConfig?.retryAfter || this.baseDelay;
  }

  /**
   * Clear retry attempts for a specific key
   */
  static clearRetryAttempts(errorKey) {
    this.retryAttempts.delete(errorKey);
  }

  /**
   * Clear all retry attempts
   */
  static clearAllRetryAttempts() {
    this.retryAttempts.clear();
  }
}

/**
 * Enhanced error handler that processes errors and returns standardized format
 */
export class ErrorHandler {
  /**
   * Process and standardize error information
   */
  static handleError(error, context = {}) {
    const errorMessage = typeof error === 'string' ? error : error.message || 'Unknown error';
    const errorConfig = ERROR_MESSAGES[errorMessage] || {};
    
    // Log error for development
    ErrorLogger.log(error, context);

    // Create standardized error response
    const standardizedError = {
      success: false,
      message: errorConfig.message || errorMessage,
      originalMessage: errorMessage,
      category: errorConfig.category || ERROR_CATEGORIES.SYSTEM,
      severity: errorConfig.severity || ERROR_SEVERITY.MEDIUM,
      field: errorConfig.field || null,
      recoverable: errorConfig.recoverable !== false,
      suggestions: errorConfig.suggestions || [],
      timestamp: Date.now(),
      context: process.env.NODE_ENV === 'development' ? context : undefined
    };

    // Add development-specific details
    if (process.env.NODE_ENV === 'development') {
      standardizedError.development = {
        originalError: error,
        stack: error instanceof Error ? error.stack : undefined,
        errorConfig
      };
    }

    return standardizedError;
  }

  /**
   * Handle authentication-specific errors
   */
  static handleAuthError(error, context = {}) {
    return this.handleError(error, {
      ...context,
      component: context.component || 'authentication',
      category: ERROR_CATEGORIES.AUTHENTICATION
    });
  }

  /**
   * Handle validation errors
   */
  static handleValidationError(error, field, context = {}) {
    return this.handleError(error, {
      ...context,
      component: context.component || 'validation',
      category: ERROR_CATEGORIES.VALIDATION,
      field
    });
  }

  /**
   * Handle network errors
   */
  static handleNetworkError(error, context = {}) {
    return this.handleError(error, {
      ...context,
      component: context.component || 'network',
      category: ERROR_CATEGORIES.NETWORK
    });
  }

  /**
   * Handle session errors
   */
  static handleSessionError(error, context = {}) {
    return this.handleError(error, {
      ...context,
      component: context.component || 'session',
      category: ERROR_CATEGORIES.SESSION
    });
  }
}

/**
 * Error state management utilities
 * Provides consistent error state handling across components
 */
export class ErrorStateManager {
  /**
   * Create initial error state
   */
  static createInitialState() {
    return {
      hasError: false,
      error: null,
      errorHistory: [],
      lastErrorTime: null,
      retryCount: 0
    };
  }

  /**
   * Update error state with new error
   */
  static updateErrorState(currentState, error, context = {}) {
    const processedError = ErrorHandler.handleError(error, context);
    
    return {
      ...currentState,
      hasError: true,
      error: processedError,
      errorHistory: [
        ...currentState.errorHistory.slice(-4), // Keep last 5 errors
        processedError
      ],
      lastErrorTime: Date.now(),
      retryCount: currentState.retryCount + 1
    };
  }

  /**
   * Clear error state
   */
  static clearErrorState(currentState) {
    return {
      ...currentState,
      hasError: false,
      error: null,
      retryCount: 0
    };
  }

  /**
   * Check if error should be displayed to user
   */
  static shouldDisplayError(errorState) {
    if (!errorState.hasError || !errorState.error) {
      return false;
    }

    // Don't display very recent duplicate errors
    const timeSinceLastError = Date.now() - errorState.lastErrorTime;
    if (timeSinceLastError < 1000) { // 1 second
      const recentErrors = errorState.errorHistory.slice(-2);
      if (recentErrors.length === 2 && 
          recentErrors[0].originalMessage === recentErrors[1].originalMessage) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get user-friendly error message
   */
  static getDisplayMessage(errorState) {
    if (!errorState.hasError || !errorState.error) {
      return null;
    }

    return errorState.error.message;
  }

  /**
   * Get error suggestions for user
   */
  static getErrorSuggestions(errorState) {
    if (!errorState.hasError || !errorState.error) {
      return [];
    }

    return errorState.error.suggestions || [];
  }
}

// Export default error handler for convenience
export default ErrorHandler;