import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ErrorStateManager } from '../../../utils/errorHandler';

// Function to get the stored state from localStorage
const getStoredState = () => {
  try {
    const serializedState = localStorage.getItem('auth');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Function to save the state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('auth', serializedState);
    
    // Development-friendly logging
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Auth state saved to localStorage:', {
        isAuthenticated: state.isAuthenticated,
        user: state.user?.email,
        lastLoginTime: state.lastLoginTime ? new Date(state.lastLoginTime).toISOString() : null
      });
    }
  } catch (err) {
    console.error('Failed to save auth state to localStorage:', err);
  }
};

const initialState = getStoredState() || {
	user: null,
	isAuthenticated: false,
	securityVerified: false,
	loading: false,
	error: null,
	errorState: ErrorStateManager.createInitialState(),
	lastLoginTime: null,
	sessionInitialized: false,
	loadingMessage: null,
	successMessage: null,
	sessionRestoredAt: null,
	lastSessionCheck: null
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		// Enhanced loading state management
		setLoading: (state, action) => {
			const { loading, message } = typeof action.payload === 'object' 
				? action.payload 
				: { loading: action.payload, message: null };
			
			state.loading = loading;
			state.loadingMessage = message;
			
			// Clear previous messages when starting new operation
			if (loading) {
				state.error = null;
				state.errorState = ErrorStateManager.clearErrorState(state.errorState);
				state.successMessage = null;
			}
			
			if (process.env.NODE_ENV === 'development') {
				console.log('🔄 Auth loading state changed:', { loading, message });
			}
		},
		
		// Enhanced login success with better state management
		loginSuccess: (state, action) => {
			state.user = action.payload;
			state.isAuthenticated = true;
			state.loading = false;
			state.error = null;
			state.lastLoginTime = Date.now();
			state.sessionInitialized = true;
			state.lastSessionCheck = Date.now();
			
			// Track if this was a session restoration
			if (action.payload?.sessionRestoredAt) {
				state.sessionRestoredAt = action.payload.sessionRestoredAt;
			}
			
			if (process.env.NODE_ENV === 'development') {
				console.log('✅ Login successful:', {
					userId: action.payload?.id,
					email: action.payload?.email,
					accountType: action.payload?.role,
					timestamp: new Date().toISOString(),
					sessionRestored: !!action.payload?.sessionRestoredAt
				});
			}
			
			saveState(state);
		},
		
		// Enhanced login failure with better error handling
		loginFailure: (state, action) => {
			state.user = null;
			state.isAuthenticated = false;
			state.loading = false;
			state.error = {
				message: action.payload,
				type: 'login',
				timestamp: Date.now()
			};
			state.lastLoginTime = null;
			
			if (process.env.NODE_ENV === 'development') {
				console.error('❌ Login failed:', action.payload);
			}
			
			saveState(state);
		},
		
		// Enhanced logout with proper cleanup
		logout: (state) => {
			const wasAuthenticated = state.isAuthenticated;
			
			state.user = null;
			state.isAuthenticated = false;
			state.securityVerified = false;
			state.loading = false;
			state.error = null;
			state.lastLoginTime = null;
			state.sessionInitialized = false;
			state.sessionRestoredAt = null;
			state.lastSessionCheck = null;
			
			if (process.env.NODE_ENV === 'development' && wasAuthenticated) {
				console.log('🚪 User logged out with session cleanup');
			}
			
			localStorage.removeItem('auth');
		},
		
		// Enhanced logout success
		logoutSuccess: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.securityVerified = false;
			state.loading = false;
			state.error = null;
			state.lastLoginTime = null;
			state.sessionInitialized = false;
			
			if (process.env.NODE_ENV === 'development') {
				console.log('✅ Logout successful');
			}
			
			localStorage.removeItem('auth');
		},
		
		// Enhanced logout failure
		logoutFailure: (state, action) => {
			state.loading = false;
			state.error = {
				message: action.payload,
				type: 'logout',
				timestamp: Date.now()
			};
			
			if (process.env.NODE_ENV === 'development') {
				console.error('❌ Logout failed:', action.payload);
			}
		},
		
		// Enhanced security verification
		setSecurityVerified: (state, action) => {
			state.securityVerified = action.payload;
			
			if (process.env.NODE_ENV === 'development') {
				console.log('🔒 Security verification status:', action.payload);
			}
			
			saveState(state);
		},
		
		// Enhanced error clearing
		clearError: (state) => {
			state.error = null;
			
			if (process.env.NODE_ENV === 'development') {
				console.log('🧹 Auth error cleared');
			}
			
			saveState(state);
		},
		
		// Session initialization state
		setSessionInitialized: (state, action) => {
			state.sessionInitialized = action.payload;
			state.loading = false;
			
			if (process.env.NODE_ENV === 'development') {
				console.log('🔄 Session initialization complete:', action.payload);
			}
		},
		
		// Signup specific states
		signupSuccess: (state, action) => {
			// If immediate authentication is enabled, log user in
			if (action.payload.user && action.payload.session) {
				state.user = action.payload.user;
				state.isAuthenticated = true;
				state.lastLoginTime = Date.now();
				state.sessionInitialized = true;
			}
			
			state.loading = false;
			state.error = null;
			
			if (process.env.NODE_ENV === 'development') {
				console.log('✅ Signup successful:', {
					immediateAuth: !!(action.payload.user && action.payload.session),
					email: action.payload.user?.email
				});
			}
			
			saveState(state);
		},
		
		signupFailure: (state, action) => {
			state.loading = false;
			state.error = {
				message: action.payload,
				type: 'signup',
				timestamp: Date.now()
			};
			
			if (process.env.NODE_ENV === 'development') {
				console.error('❌ Signup failed:', action.payload);
			}
			
			saveState(state);
		},
		
		// Session validation tracking
		updateSessionCheck: (state) => {
			state.lastSessionCheck = Date.now();
			saveState(state);
		},
		
		// Handle session expiration
		sessionExpired: (state) => {
			const wasAuthenticated = state.isAuthenticated;
			
			state.user = null;
			state.isAuthenticated = false;
			state.securityVerified = false;
			state.loading = false;
			state.error = {
				message: 'Your session has expired. Please log in again.',
				type: 'session_expired',
				timestamp: Date.now()
			};
			state.lastLoginTime = null;
			state.sessionRestoredAt = null;
			state.lastSessionCheck = null;
			
			if (process.env.NODE_ENV === 'development' && wasAuthenticated) {
				console.log('⚠️ Session expired, user logged out');
			}
			
			localStorage.removeItem('auth');
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(initializeAuth.pending, (state) => {
				state.loading = true;
				if (process.env.NODE_ENV === 'development') {
					console.log('🔄 Auth initialization pending...');
				}
			})
			.addCase(initializeAuth.fulfilled, (state, action) => {
				state.loading = false;
				state.sessionInitialized = true;
				
				if (action.payload.success && action.payload.user) {
					// Session restored successfully
					state.user = action.payload.user;
					state.isAuthenticated = true;
					state.lastLoginTime = Date.now();
					state.sessionRestoredAt = Date.now();
					state.lastSessionCheck = Date.now();
					state.error = null;
					
					if (process.env.NODE_ENV === 'development') {
						console.log('✅ Auth initialization successful - session restored');
					}
				} else {
					// No valid session - clean up state
					state.user = null;
					state.isAuthenticated = false;
					state.lastLoginTime = null;
					state.sessionRestoredAt = null;
					state.lastSessionCheck = null;
					state.error = null;
					localStorage.removeItem('auth');
				}
				
				saveState(state);
			})
			.addCase(initializeAuth.rejected, (state, action) => {
				state.loading = false;
				state.sessionInitialized = true;
				state.user = null;
				state.isAuthenticated = false;
				state.lastLoginTime = null;
				state.sessionRestoredAt = null;
				state.lastSessionCheck = null;
				state.error = {
					message: action.error.message || 'Authentication initialization failed',
					type: 'initialization',
					timestamp: Date.now()
				};
				
				localStorage.removeItem('auth');
				
				if (process.env.NODE_ENV === 'development') {
					console.error('❌ Auth initialization failed:', action.error.message);
				}
			})
			.addCase(validateSession.fulfilled, (state, action) => {
				state.lastSessionCheck = Date.now();
				
				if (action.payload.success) {
					if (process.env.NODE_ENV === 'development') {
						console.log('✅ Session validation successful');
					}
				}
			})
			.addCase(validateSession.rejected, (state, action) => {
				state.lastSessionCheck = Date.now();
				
				if (process.env.NODE_ENV === 'development') {
					console.error('❌ Session validation failed:', action.error.message);
				}
			});
	}
});

export const { 
	setLoading,
	loginSuccess, 
	loginFailure, 
	logout, 
	logoutSuccess, 
	logoutFailure, 
	setSecurityVerified, 
	clearError,
	setSessionInitialized,
	signupSuccess,
	signupFailure,
	updateSessionCheck,
	sessionExpired
} = authSlice.actions;

// Add token expiration check
export const checkTokenExpiration = () => (dispatch, getState) => {
	const { lastLoginTime } = getState().auth;
	const expirationTime = 7 * 24 * 60 * 60 * 1000; // 7 days (Supabase default)
	
	if (lastLoginTime && Date.now() - lastLoginTime > expirationTime) {
		dispatch(logout());
		return false;
	}
	return true;
};

// Enhanced thunk for handling logout with proper loading states
export const logoutUser = () => async (dispatch) => {
	try {
		dispatch(setLoading(true));
		
		if (process.env.NODE_ENV === 'development') {
			console.log('🚪 Attempting logout...');
		}
		
		// Import API service dynamically to avoid circular imports
		const { apiService } = await import('../../../services/api');
		const result = await apiService.logout();
		
		if (result.success) {
			dispatch(logoutSuccess());
			return { success: true };
		} else {
			dispatch(logoutFailure(result.error));
			return { success: false, error: result.error };
		}
	} catch (error) {
		console.error('Logout error:', error);
		const errorMessage = 'An error occurred during logout';
		dispatch(logoutFailure(errorMessage));
		return { success: false, error: errorMessage };
	}
};

// Enhanced thunk for handling login with better error handling and loading states
export const login = (credentials) => async (dispatch) => {
	try {
		// Clear any existing errors and set loading state
		dispatch(clearError());
		dispatch(setLoading(true));
		
		// Enhanced validation
		if (!credentials.email || !credentials.password) {
			const errorMessage = 'Email and password are required';
			dispatch(loginFailure(errorMessage));
			return { success: false, error: errorMessage };
		}

		// Validate email format (flexible for development)
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(credentials.email)) {
			const errorMessage = 'Please enter a valid email address';
			dispatch(loginFailure(errorMessage));
			return { success: false, error: errorMessage };
		}

		if (process.env.NODE_ENV === 'development') {
			console.log('🔐 Attempting login for:', credentials.email);
		}

		// Import API service dynamically to avoid circular imports
		const { apiService } = await import('../../../services/api');
		const result = await apiService.login(credentials);

		if (result.success) {
			dispatch(loginSuccess(result.user));
			return { success: true, user: result.user };
		} else {
			dispatch(loginFailure(result.error));
			return { success: false, error: result.error };
		}
	} catch (error) {
		console.error('Login error:', error);
		const errorMessage = error.message || 'An error occurred during login';
		dispatch(loginFailure(errorMessage));
		return { success: false, error: errorMessage };
	}
};

// Enhanced thunk for handling signup with immediate authentication
export const signup = (userData) => async (dispatch) => {
	try {
		// Clear any existing errors and set loading state
		dispatch(clearError());
		dispatch(setLoading(true));
		
		// Enhanced validation
		if (!userData.email || !userData.password) {
			const errorMessage = 'Email and password are required';
			dispatch(signupFailure(errorMessage));
			return { success: false, error: errorMessage };
		}

		// Flexible email validation for development
		const emailRegex = /^[^\s@]+@[^\s@]+/; // Basic @ check only
		if (!emailRegex.test(userData.email)) {
			const errorMessage = 'Please enter a valid email address';
			dispatch(signupFailure(errorMessage));
			return { success: false, error: errorMessage };
		}

		if (userData.password !== userData.confirmPassword) {
			const errorMessage = 'Passwords do not match';
			dispatch(signupFailure(errorMessage));
			return { success: false, error: errorMessage };
		}

		// Validate account type specific fields
		if (userData.account_type === 'personal') {
			if (!userData.first_name || !userData.last_name) {
				const errorMessage = 'First name and last name are required for personal accounts';
				dispatch(signupFailure(errorMessage));
				return { success: false, error: errorMessage };
			}
		} else if (userData.account_type === 'business') {
			if (!userData.business_name) {
				const errorMessage = 'Business name is required for business accounts';
				dispatch(signupFailure(errorMessage));
				return { success: false, error: errorMessage };
			}
		}

		if (process.env.NODE_ENV === 'development') {
			console.log('📝 Attempting signup for:', {
				email: userData.email,
				accountType: userData.account_type
			});
		}
		
		// Import API service dynamically to avoid circular imports
		const { apiService } = await import('../../../services/api');
		const result = await apiService.signup(userData);
		
		if (result.success) {
			// Handle immediate authentication (development mode)
			if (result.session && result.user) {
				const userForStore = {
					id: result.user.id,
					email: result.user.email,
					name: result.user.user_metadata?.display_name || result.user.email,
					role: result.user.user_metadata?.account_type || 'personal',
					tier: result.user.user_metadata?.tier || 1,
					phone: result.user.user_metadata?.phone,
					first_name: result.user.user_metadata?.first_name,
					last_name: result.user.user_metadata?.last_name,
					business_name: result.user.user_metadata?.business_name,
					rc_number: result.user.user_metadata?.rc_number,
					nin: result.user.user_metadata?.nin,
					phone_verified: result.user.user_metadata?.phone_verified || false,
					loginTime: Date.now()
				};
				
				dispatch(signupSuccess({ user: userForStore, session: result.session }));
				return { 
					success: true, 
					user: userForStore, 
					immediateAuth: true 
				};
			}
			
			// Handle email confirmation required (production mode)
			if (result.requiresEmailConfirmation) {
				dispatch(signupSuccess({ requiresEmailConfirmation: true }));
				return {
					success: true,
					message: result.message,
					requiresEmailConfirmation: true
				};
			}
			
			dispatch(signupSuccess({}));
			return result;
		} else {
			dispatch(signupFailure(result.error));
			return { success: false, error: result.error };
		}
		
	} catch (error) {
		console.error('Signup error:', error);
		const errorMessage = error.message || 'An error occurred during signup';
		dispatch(signupFailure(errorMessage));
		return { success: false, error: errorMessage };
	}
};

// Enhanced async thunk for initializing auth state on app startup
export const initializeAuth = createAsyncThunk(
	'auth/initializeAuth',
	async (_, { dispatch, getState }) => {
		try {
			const { sessionInitialized } = getState().auth;
			
			// Prevent multiple initialization attempts
			if (sessionInitialized) {
				if (process.env.NODE_ENV === 'development') {
					console.log('🔄 Auth already initialized, skipping');
				}
				return { success: true, alreadyInitialized: true };
			}

			if (process.env.NODE_ENV === 'development') {
				console.log('🚀 Initializing authentication with enhanced session management...');
			}

			const { apiService } = await import('../../../services/api');
			
			// Use enhanced session initialization
			const result = await apiService.initializeAuth();
			
			if (result.success && result.authenticated && result.user) {
				if (process.env.NODE_ENV === 'development') {
					console.log('✅ Session restored for user:', result.user.email);
				}
				
				return { success: true, user: result.user, session: result.session };
			}
			
			// No valid session found or session expired
			if (process.env.NODE_ENV === 'development') {
				console.log('🔄 No valid session found or session expired');
			}
			
			return { success: false, message: result.message || 'No valid session' };
			
		} catch (error) {
			console.error('❌ Auth initialization error:', error);
			throw error;
		}
	}
);

// Session expiration handler
export const handleSessionExpiration = () => (dispatch) => {
	if (process.env.NODE_ENV === 'development') {
		console.log('⚠️ Handling session expiration');
	}
	
	// Clear auth state and redirect to login
	dispatch(logout());
	
	// Show notification to user
	window.dispatchEvent(new CustomEvent('show-notification', {
		detail: {
			type: 'warning',
			message: 'Your session has expired. Please log in again.',
			duration: 5000
		}
	}));
};

// Enhanced session validation thunk
export const validateSession = createAsyncThunk(
	'auth/validateSession',
	async (_, { dispatch, getState }) => {
		try {
			const { isAuthenticated } = getState().auth;
			
			if (!isAuthenticated) {
				return { success: false, message: 'Not authenticated' };
			}

			const { apiService } = await import('../../../services/api');
			const result = await apiService.validateAndRefreshSession();
			
			if (!result.success) {
				// Session is invalid, trigger logout
				dispatch(handleSessionExpiration());
				return { success: false, message: result.error };
			}
			
			return { success: true, session: result.session };
		} catch (error) {
			console.error('❌ Session validation error:', error);
			dispatch(handleSessionExpiration());
			throw error;
		}
	}
);

export default authSlice.reducer;