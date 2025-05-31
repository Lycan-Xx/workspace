import { createSlice } from '@reduxjs/toolkit';

const users = [
	// Personal Account Users
	{ email: 'green@mail.com', password: 'root', name: 'Green User', role: 'personal' },
	{ email: 'blue@mail.com', password: 'cool', name: 'Blue User', role: 'personal' },
	// Business Account Users
	{ email: 'red@mail.com', password: 'pass', name: 'Red Enterprise', role: 'business' },
	{ email: 'yellow@mail.com', password: 'word', name: 'Yellow Corp', role: 'business' }
];

// Load initial state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (serializedState === null) {
      return {
        user: null,
        isAuthenticated: false,
        securityVerified: false,
        error: null
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      user: null,
      isAuthenticated: false,
      securityVerified: false,
      error: null
    };
  }
};

const initialState = loadState();

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.user = action.payload;
			state.isAuthenticated = true;
			state.error = null;
      // Save to localStorage
      localStorage.setItem('authState', JSON.stringify(state));
		},
		loginFailure: (state, action) => {
			state.user = null;
			state.isAuthenticated = false;
			state.error = action.payload;
      // Clear localStorage
      localStorage.removeItem('authState');
		},
		logout: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.securityVerified = false;
			state.error = null;
      // Clear localStorage
      localStorage.removeItem('authState');
		},
		setSecurityVerified: (state, action) => {
			state.securityVerified = action.payload;
      // Update localStorage
      localStorage.setItem('authState', JSON.stringify(state));
		}
	}
});

export const { loginSuccess, loginFailure, logout, setSecurityVerified } = authSlice.actions;

// Thunk for handling login
export const login = (credentials) => (dispatch) => {
	const user = users.find(
		u => u.email === credentials.email && u.password === credentials.password
	);

	if (user) {
		dispatch(loginSuccess({ email: user.email, name: user.name, role: user.role }));
		return true;
	} else {
		dispatch(loginFailure('Invalid credentials'));
		return false;
	}
};

export default authSlice.reducer;