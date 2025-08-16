import { createSlice } from '@reduxjs/toolkit';

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
  } catch (err) {
    // Handle errors here
  }
};

const initialState = getStoredState() || {
	user: null,
	isAuthenticated: false,
	securityVerified: false,
	error: null,
	lastLoginTime: null
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.user = action.payload;
			state.isAuthenticated = true;
			state.error = null;
			state.lastLoginTime = Date.now();
			saveState(state); // Save state to localStorage on login
		},
		loginFailure: (state, action) => {
			state.user = null;
			state.isAuthenticated = false;
			state.error = action.payload;
			state.lastLoginTime = null;
			saveState(state); // Save state to localStorage on login failure
		},
		logout: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.securityVerified = false;
			state.error = null;
			state.lastLoginTime = null;
			localStorage.removeItem('auth'); // Remove state from localStorage on logout
		},
		logoutSuccess: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.securityVerified = false;
			state.error = null;
			state.lastLoginTime = null;
			localStorage.removeItem('auth');
		},
		logoutFailure: (state, action) => {
			state.error = action.payload;
		},
		setSecurityVerified: (state, action) => {
			state.securityVerified = action.payload;
			saveState(state); // Save state to localStorage on security verification
		},
		clearError: (state) => {
			state.error = null;
			saveState(state);
		}
	}
});

export const { loginSuccess, loginFailure, logout, logoutSuccess, logoutFailure, setSecurityVerified, clearError } = authSlice.actions;

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

// Thunk for handling logout
export const logoutUser = () => async (dispatch) => {
	try {
		// Import API service dynamically to avoid circular imports
		const { apiService } = await import('../../../services/api');
		const result = await apiService.logout();
		
		if (result.success) {
			dispatch(logoutSuccess());
			return true;
		} else {
			dispatch(logoutFailure(result.error));
			return false;
		}
	} catch (error) {
		console.error('Logout error:', error);
		dispatch(logoutFailure('An error occurred during logout'));
		return false;
	}
};

// Thunk for handling login
export const login = (credentials) => async (dispatch) => {
	try {
		dispatch(clearError());
		
		// Basic validation
		if (!credentials.email || !credentials.password) {
			dispatch(loginFailure('Email and password are required'));
			return false;
		}

		// Import API service dynamically to avoid circular imports
		const { apiService } = await import('../../../services/api');
		const result = await apiService.login(credentials);

		if (result.success) {
			dispatch(loginSuccess(result.user));
			return true;
		} else {
			dispatch(loginFailure(result.error));
			return false;
		}
	} catch (error) {
		console.error('Login error:', error);
		dispatch(loginFailure('An error occurred during login'));
		return false;
	}
};

// Thunk for handling signup
export const signup = (userData) => async (dispatch) => {
	try {
		dispatch(clearError());
		
		// Validate required fields
		if (!userData.email || !userData.password) {
			return { 
				success: false, 
				error: 'Email and password are required' 
			};
		}

		if (userData.password !== userData.confirmPassword) {
			return { 
				success: false, 
				error: 'Passwords do not match' 
			};
		}

		// Validate account type specific fields
		if (userData.account_type === 'personal') {
			if (!userData.first_name || !userData.last_name) {
				return { 
					success: false, 
					error: 'First name and last name are required for personal accounts' 
				};
			}
		} else if (userData.account_type === 'business') {
			if (!userData.business_name) {
				return { 
					success: false, 
					error: 'Business name is required for business accounts' 
				};
			}
		}
		
		// Import API service dynamically to avoid circular imports
		const { apiService } = await import('../../../services/api');
		const result = await apiService.signup(userData);
		
		if (result.success) {
			console.log('Signup successful:', result);
			
			// If user is created but needs email confirmation, don't log them in yet
			if (result.requiresEmailConfirmation) {
				return {
					success: true,
					message: result.message,
					requiresEmailConfirmation: true
				};
			}
			
			// If user is fully created and has a session, log them in
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
					phone_verified: result.user.user_metadata?.phone_verified,
					loginTime: Date.now()
				};
				
				dispatch(loginSuccess(userForStore));
			}
			
			return result;
		} else {
			return result;
		}
		
	} catch (error) {
		console.error('Signup error:', error);
		return { 
			success: false, 
			error: error.message || 'An error occurred during signup' 
		};
	}
};

// Thunk for initializing auth state from Supabase session
export const initializeAuth = () => async (dispatch) => {
	try {
		const { apiService } = await import('../../../services/api');
		const sessionResult = await apiService.getSession();
		
		if (sessionResult.success && sessionResult.session) {
			const userResult = await apiService.getCurrentUser();
			
			if (userResult.success) {
				dispatch(loginSuccess(userResult.user));
				return true;
			}
		}
		
		// No valid session found
		dispatch(logout());
		return false;
	} catch (error) {
		console.error('Auth initialization error:', error);
		dispatch(logout());
		return false;
	}
};

export default authSlice.reducer;