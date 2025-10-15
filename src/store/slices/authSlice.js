import { createSlice } from '@reduxjs/toolkit';

const loadAuthFromStorage = () => {
  try {
    const stored = localStorage.getItem('auth');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load auth from storage:', error);
  }
  return { user: null, isAuthenticated: false };
};

const initialState = loadAuthFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('auth', JSON.stringify(state));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth');
    },
    impersonate: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('auth', JSON.stringify(state));
    },
  },
});

export const { login, logout, impersonate } = authSlice.actions;
export default authSlice.reducer;
