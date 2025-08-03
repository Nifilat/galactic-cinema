import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from './types';
import { mockUsers } from '@/constants/mockUsers';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  users: mockUsers,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    logout: state => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
    updateUsers: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
  },
});

export const { login, logout, clearError, updateUsers } = authSlice.actions;
export default authSlice.reducer;
