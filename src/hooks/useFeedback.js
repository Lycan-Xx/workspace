import { useState, useCallback, useRef, useEffect } from 'react';
import { ErrorStateManager } from '../utils/errorHandler';

/**
 * Custom hook for managing loading states and user feedback
 * Provides consistent feedback management across authentication flows
 */
export const useFeedback = (initialState = {}) => {
  const [state, setState] = useState({
    loading: false,
    success: null,
    error: null,
    errorState: ErrorStateManager.createInitialState(),
    ...initialState
  });

  const timeoutRef = useRef(null);

  // Clear any pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Set loading state
  const setLoading = useCallback((loading, loadingMessage = null) => {
    setState(prev => ({
      ...prev,
      loading,
      loadingMessage,
      // Clear previous messages when starting new operation
      ...(loading && {
        success: null,
        error: null,
        errorState: ErrorStateManager.clearErrorState(prev.errorState)
      })
    }));
  }, []);

  // Set success message
  const setSuccess = useCallback((message, autoHide = true, duration = 3000) => {
    setState(prev => ({
      ...prev,
      loading: false,
      success: message,
      error: null,
      errorState: ErrorStateManager.clearErrorState(prev.errorState)
    }));

    if (autoHide && duration > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setState(prev => ({
          ...prev,
          success: null
        }));
      }, duration);
    }
  }, []);

  // Set error message with enhanced error handling
  const setError = useCallback((error, context = {}) => {
    const newErrorState = ErrorStateManager.updateErrorState(
      state.errorState,
      error,
      context
    );

    setState(prev => ({
      ...prev,
      loading: false,
      success: null,
      error: ErrorStateManager.getDisplayMessage(newErrorState),
      errorState: newErrorState,
      errorSuggestions: ErrorStateManager.getErrorSuggestions(newErrorState)
    }));
  }, [state.errorState]);

  // Clear all feedback
  const clearFeedback = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState(prev => ({
      ...prev,
      loading: false,
      success: null,
      error: null,
      errorState: ErrorStateManager.clearErrorState(prev.errorState),
      errorSuggestions: []
    }));
  }, []);

  // Clear only error
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      errorState: ErrorStateManager.clearErrorState(prev.errorState),
      errorSuggestions: []
    }));
  }, []);

  // Clear only success
  const clearSuccess = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState(prev => ({
      ...prev,
      success: null
    }));
  }, []);

  // Handle async operations with automatic feedback management
  const handleAsync = useCallback(async (
    operation,
    {
      loadingMessage = 'Processing...',
      successMessage = 'Operation completed successfully',
      errorContext = {},
      autoHideSuccess = true,
      successDuration = 3000
    } = {}
  ) => {
    try {
      setLoading(true, loadingMessage);
      
      const result = await operation();
      
      if (result && result.success === false) {
        // Handle API errors
        setError(result.error || result.message || 'Operation failed', {
          ...errorContext,
          apiResult: result
        });
        return result;
      }
      
      // Success
      if (successMessage) {
        setSuccess(successMessage, autoHideSuccess, successDuration);
      } else {
        setLoading(false);
      }
      
      return result;
    } catch (error) {
      setError(error, errorContext);
      throw error;
    }
  }, [setLoading, setSuccess, setError]);

  // Get current feedback state for display
  const getFeedbackProps = useCallback(() => {
    return {
      loading: state.loading,
      loadingMessage: state.loadingMessage,
      success: state.success,
      error: state.error,
      errorSuggestions: state.errorSuggestions || [],
      hasError: !!state.error,
      hasSuccess: !!state.success,
      shouldDisplayError: ErrorStateManager.shouldDisplayError(state.errorState)
    };
  }, [state]);

  // Get loading button props
  const getLoadingButtonProps = useCallback((baseProps = {}) => {
    return {
      ...baseProps,
      loading: state.loading,
      disabled: baseProps.disabled || state.loading,
      loadingText: state.loadingMessage || baseProps.loadingText || 'Loading...'
    };
  }, [state.loading, state.loadingMessage]);

  return {
    // State
    ...state,
    
    // Actions
    setLoading,
    setSuccess,
    setError,
    clearFeedback,
    clearError,
    clearSuccess,
    handleAsync,
    
    // Helpers
    getFeedbackProps,
    getLoadingButtonProps,
    
    // Computed properties
    isLoading: state.loading,
    hasError: !!state.error,
    hasSuccess: !!state.success,
    shouldDisplayError: ErrorStateManager.shouldDisplayError(state.errorState)
  };
};

export default useFeedback;