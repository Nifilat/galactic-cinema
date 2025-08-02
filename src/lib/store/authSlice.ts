import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, RegisterCredentials, User } from './types';
import { mockUsers } from '@/constants/mockUsers';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authenticateLogin = async (credentials: LoginCredentials): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = mockUsers.find(
    u =>
      u.username.toLowerCase() === credentials.username.toLowerCase() &&
      u.password === credentials.password
  );

  if (!user) {
    throw new Error('Invalid username or password');
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
};

const authenticateRegister = async (credentials: RegisterCredentials): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const usernameExists = mockUsers.find(
    u => u.username.toLowerCase() === credentials.username.toLowerCase()
  );
  const emailExists = mockUsers.find(
    u => u.email.toLowerCase() === credentials.email.toLowerCase()
  );

  if (usernameExists) throw new Error('Username is already taken.');
  if (emailExists) throw new Error('This email is already registered.');

  const newUser = {
    id: Date.now().toString(),
    username: credentials.username,
    email: credentials.email,
  };

  mockUsers.push({ ...newUser, password: credentials.password });

  return newUser;
};

export const login = createAsyncThunk('auth/login', async (credentials: LoginCredentials) => {
  const user = await authenticateLogin(credentials);
  return user;
});

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials) => {
    const user = await authenticateRegister(credentials);
    return user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
    loadAuthState: state => {
      if (typeof window !== 'undefined') {
        try {
          const savedAuth = localStorage.getItem('auth');
          if (savedAuth) {
            const parsedAuth = JSON.parse(savedAuth);
            state.user = parsedAuth.user;
            state.isAuthenticated = parsedAuth.isAuthenticated;
          }
        } catch (error) {
          console.error('Failed to load auth state:', error);
        }
      }
    },
  },
  extraReducers: builder => {
    builder

      .addCase(login.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })

      .addCase(register.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      });
  },
});

export const { logout, clearError, loadAuthState } = authSlice.actions;
export default authSlice.reducer;
