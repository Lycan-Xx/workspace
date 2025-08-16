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

export const { loginSuccess, loginFailure, logout, setSecurityVerified, clearError } = authSlice.actions;

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
		
		// Import API service dynamically to avoid circular imports
		const { apiService } = await import('../../../services/api');
		const result = await apiService.signup(userData);
		
		return result;
	} catch (error) {
		console.error('Signup error:', error);
		return { success: false, message: 'An error occurred during signup' };
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