import { createSlice } from '@reduxjs/toolkit';

const users = [
	// Personal Account Users
	{ email: 'green@mail.com', password: 'root', name: 'Green User', role: 'personal' },
	{ email: 'blue@mail.com', password: 'cool', name: 'Blue User', role: 'personal' },
	// Business Account Users
	{ email: 'red@mail.com', password: 'pass', name: 'Red Enterprise', role: 'business' },
	{ email: 'yellow@mail.com', password: 'word', name: 'Yellow Corp', role: 'business' }
];

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
			// use loginTime from payload if available for persistence
			state.lastLoginTime = action.payload.loginTime || Date.now();
			saveState(state); // Save state to localStorage on login
		},
		loginFailure: (state, action) => {
			state.user = null;
			state.isAuthenticated = false;
			state.error = action.payload;
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
		}
	}
});

export const { loginSuccess, loginFailure, logout, setSecurityVerified } = authSlice.actions;

// Add token expiration check
export const checkTokenExpiration = () => (dispatch, getState) => {
	const { lastLoginTime } = getState().auth;
	const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
	
	if (lastLoginTime && Date.now() - lastLoginTime > expirationTime) {
		dispatch(logout());
		return false;
	}
	return true;
};

// Thunk for handling login
export const login = (credentials) => async (dispatch) => {
	try {
		// Basic validation
		if (!credentials.email || !credentials.password) {
			dispatch(loginFailure('Email and password are required'));
			return false;
		}

		// Import API service dynamically to avoid circular imports
		const { apiService } = await import('../../../services/api');
		const result = await apiService.login(credentials);

		if (result.success) {
			dispatch(loginSuccess({ 
				...result.user,
				loginTime: Date.now()
			}));
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
		// Import API service dynamically to avoid circular imports
		const { apiService } = await import('../../../services/api');
		const result = await apiService.signup(userData);
		
		return result;
	} catch (error) {
		console.error('Signup error:', error);
		return { success: false, message: 'An error occurred during signup' };
	}
};

export default authSlice.reducer;