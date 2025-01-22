import { createSlice } from '@reduxjs/toolkit';

const users = [
  { email: 'green@mail.com', password: 'root', name: 'Green User' },
  { email: 'blue@mail.com', password: 'cool', name: 'Blue User' }
];

const initialState = {
  user: null,
  isAuthenticated: false,
  securityVerified: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.securityVerified = false;
      state.error = null;
    },
    setSecurityVerified: (state, action) => {
      state.securityVerified = action.payload;
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
    dispatch(loginSuccess({ email: user.email, name: user.name }));
    return true;
  } else {
    dispatch(loginFailure('Invalid credentials'));
    return false;
  }
};

export default authSlice.reducer;