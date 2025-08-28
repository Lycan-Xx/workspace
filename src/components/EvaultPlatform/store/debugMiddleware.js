import authDebugger from '../../../utils/authDebugger';

/**
 * Redux middleware for authentication debugging
 * Logs all auth-related actions and state changes
 */
export const authDebugMiddleware = (store) => (next) => (action) => {
  // Only log in development
  if (process.env.NODE_ENV !== 'development') {
    return next(action);
  }

  // Get state before action
  const prevState = store.getState();
  
  // Execute action
  const result = next(action);
  
  // Get state after action
  const nextState = store.getState();
  
  // Only log auth-related actions
  if (action.type.startsWith('auth/')) {
    authDebugger.logReduxStateChange(action, prevState, nextState);
    
    // Log specific auth operations
    switch (action.type) {
      case 'auth/loginSuccess':
        authDebugger.logAuthOperation('state_update', {
          action: 'login_success',
          user: action.payload,
          isAuthenticated: nextState.auth.isAuthenticated
        }, 'success');
        break;
        
      case 'auth/loginFailure':
        authDebugger.logAuthOperation('state_update', {
          action: 'login_failure',
          error: action.payload,
          isAuthenticated: nextState.auth.isAuthenticated
        }, 'error');
        break;
        
      case 'auth/logout':
        authDebugger.logAuthOperation('state_update', {
          action: 'logout',
          wasAuthenticated: prevState.auth.isAuthenticated,
          isAuthenticated: nextState.auth.isAuthenticated
        });
        break;
        
      case 'auth/signupSuccess':
        authDebugger.logAuthOperation('state_update', {
          action: 'signup_success',
          immediateAuth: !!(action.payload.user && action.payload.session),
          isAuthenticated: nextState.auth.isAuthenticated
        }, 'success');
        break;
        
      case 'auth/signupFailure':
        authDebugger.logAuthOperation('state_update', {
          action: 'signup_failure',
          error: action.payload,
          isAuthenticated: nextState.auth.isAuthenticated
        }, 'error');
        break;
        
      case 'auth/initializeAuth/pending':
        authDebugger.logAuthOperation('state_update', {
          action: 'auth_init_pending',
          loading: nextState.auth.loading
        });
        break;
        
      case 'auth/initializeAuth/fulfilled':
        authDebugger.logAuthOperation('state_update', {
          action: 'auth_init_fulfilled',
          success: action.payload.success,
          sessionInitialized: nextState.auth.sessionInitialized,
          isAuthenticated: nextState.auth.isAuthenticated
        }, action.payload.success ? 'success' : 'info');
        break;
        
      case 'auth/initializeAuth/rejected':
        authDebugger.logAuthOperation('state_update', {
          action: 'auth_init_rejected',
          error: action.error.message,
          sessionInitialized: nextState.auth.sessionInitialized
        }, 'error');
        break;
        
      case 'auth/sessionExpired':
        authDebugger.logAuthOperation('session_expire', {
          action: 'session_expired',
          wasAuthenticated: prevState.auth.isAuthenticated,
          error: nextState.auth.error
        }, 'warn');
        break;
        
      case 'auth/updateSessionCheck':
        authDebugger.logAuthOperation('session_validate', {
          action: 'session_check_updated',
          lastSessionCheck: nextState.auth.lastSessionCheck
        });
        break;
    }
  }
  
  return result;
};

/**
 * Enhanced Redux DevTools configuration for development
 */
export const getReduxDevToolsConfig = () => {
  if (process.env.NODE_ENV !== 'development') {
    return false;
  }

  return {
    name: 'eVault Authentication Store',
    trace: true,
    traceLimit: 25,
    actionSanitizer: (action) => {
      // Sanitize sensitive data in actions
      if (action.type === 'auth/login' || action.type === 'auth/signup') {
        return {
          ...action,
          payload: {
            ...action.payload,
            password: '[REDACTED]',
            confirmPassword: '[REDACTED]'
          }
        };
      }
      return action;
    },
    stateSanitizer: (state) => {
      // Sanitize sensitive data in state
      if (state.auth && state.auth.user) {
        return {
          ...state,
          auth: {
            ...state.auth,
            user: {
              ...state.auth.user,
              // Keep only non-sensitive user data for debugging
              id: state.auth.user.id,
              email: state.auth.user.email,
              name: state.auth.user.name,
              role: state.auth.user.role,
              tier: state.auth.user.tier,
              isAuthenticated: state.auth.isAuthenticated,
              loading: state.auth.loading,
              sessionInitialized: state.auth.sessionInitialized
            }
          }
        };
      }
      return state;
    },
    features: {
      pause: true,
      lock: true,
      persist: true,
      export: true,
      import: 'custom',
      jump: true,
      skip: true,
      reorder: true,
      dispatch: true,
      test: true
    }
  };
};

export default authDebugMiddleware;