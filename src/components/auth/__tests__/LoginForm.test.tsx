import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import LoginForm from '../LoginForm';
import authReducer from '@/lib/store/authSlice';
import { mockUsers } from '@/constants/mockUsers';

// Mock sonner
jest.mock('sonner');
const mockToast = toast as jest.MockedFunction<typeof toast>;

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        users: mockUsers,
        ...initialState,
      },
    },
  });
};

const renderWithProvider = (component: React.ReactElement, store = createMockStore()) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders login form by default', () => {
      renderWithProvider(<LoginForm />);
      
      expect(screen.getByText('Authentication')).toBeInTheDocument();
      expect(screen.getByText('Login or create an account to view Star Wars movies')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Register' })).toBeInTheDocument();
    });

    it('renders login form fields', () => {
      renderWithProvider(<LoginForm />);
      
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('switches to register form when register tab is clicked', () => {
      renderWithProvider(<LoginForm />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Register' }));
      
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    });
  });

  describe('Login Functionality', () => {
    it('successfully logs in with valid credentials', async () => {
      renderWithProvider(<LoginForm />);
      
      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const loginButton = screen.getByRole('button', { name: 'Login' });
      
      fireEvent.change(usernameInput, { target: { value: 'luke' } });
      fireEvent.change(passwordInput, { target: { value: 'skywalker' } });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith('Login successful', {
          description: 'Welcome back to the Star Wars universe!',
        });
      });
    });

    it('shows error for invalid credentials', async () => {
      renderWithProvider(<LoginForm />);
      
      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const loginButton = screen.getByRole('button', { name: 'Login' });
      
      fireEvent.change(usernameInput, { target: { value: 'invalid' } });
      fireEvent.change(passwordInput, { target: { value: 'invalid' } });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith('Login failed', {
          description: 'Invalid username or password',
          className: expect.any(String),
        });
      });
    });

    it('validates required fields', async () => {
      renderWithProvider(<LoginForm />);
      
      const loginButton = screen.getByRole('button', { name: 'Login' });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText('Username must be at least 4 characters')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('validates username minimum length', async () => {
      renderWithProvider(<LoginForm />);
      
      const usernameInput = screen.getByLabelText('Username');
      const loginButton = screen.getByRole('button', { name: 'Login' });
      
      fireEvent.change(usernameInput, { target: { value: 'abc' } });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText('Username must be at least 4 characters')).toBeInTheDocument();
      });
    });
  });

  describe('Registration Functionality', () => {
    it('successfully registers a new user', async () => {
      renderWithProvider(<LoginForm />);
      
      // Switch to register tab
      fireEvent.click(screen.getByRole('tab', { name: 'Register' }));
      
      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const registerButton = screen.getByRole('button', { name: 'Create Account' });
      
      fireEvent.change(usernameInput, { target: { value: 'newuser' } });
      fireEvent.change(emailInput, { target: { value: 'newuser@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(registerButton);
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith('Registration successful', {
          description: 'Welcome to the Star Wars universe!',
        });
      });
    });

    it('validates registration form fields', async () => {
      renderWithProvider(<LoginForm />);
      
      // Switch to register tab
      fireEvent.click(screen.getByRole('tab', { name: 'Register' }));
      
      const registerButton = screen.getByRole('button', { name: 'Create Account' });
      fireEvent.click(registerButton);
      
      await waitFor(() => {
        expect(screen.getByText('Username must be at least 4 characters')).toBeInTheDocument();
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      });
    });

    it('validates email format', async () => {
      renderWithProvider(<LoginForm />);
      
      // Switch to register tab
      fireEvent.click(screen.getByRole('tab', { name: 'Register' }));
      
      const emailInput = screen.getByLabelText('Email');
      const registerButton = screen.getByRole('button', { name: 'Create Account' });
      
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(registerButton);
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
      });
    });

    it('validates password minimum length', async () => {
      renderWithProvider(<LoginForm />);
      
      // Switch to register tab
      fireEvent.click(screen.getByRole('tab', { name: 'Register' }));
      
      const passwordInput = screen.getByLabelText('Password');
      const registerButton = screen.getByRole('button', { name: 'Create Account' });
      
      fireEvent.change(passwordInput, { target: { value: '12345' } });
      fireEvent.click(registerButton);
      
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading state during login', () => {
      const store = createMockStore({ isLoading: true });
      renderWithProvider(<LoginForm />, store);
      
      expect(screen.getByRole('button', { name: 'Logging in...' })).toBeInTheDocument();
    });

    it('shows loading state during registration', () => {
      const store = createMockStore({ isLoading: true });
      renderWithProvider(<LoginForm />, store);
      
      // Switch to register tab
      fireEvent.click(screen.getByRole('tab', { name: 'Register' }));
      
      expect(screen.getByRole('button', { name: 'Creating Account...' })).toBeInTheDocument();
    });

    it('disables buttons during loading', () => {
      const store = createMockStore({ isLoading: true });
      renderWithProvider(<LoginForm />, store);
      
      expect(screen.getByRole('button', { name: 'Logging in...' })).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when present', () => {
      const store = createMockStore({ error: 'Authentication failed' });
      renderWithProvider(<LoginForm />, store);
      
      expect(screen.getByText('Authentication failed')).toBeInTheDocument();
    });

    it('applies shake animation to error alert', () => {
      const store = createMockStore({ error: 'Authentication failed' });
      renderWithProvider(<LoginForm />, store);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('animate-shake');
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      renderWithProvider(<LoginForm />);
      
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('has proper ARIA roles', () => {
      renderWithProvider(<LoginForm />);
      
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Register' })).toBeInTheDocument();
    });

    it('has proper form structure', () => {
      renderWithProvider(<LoginForm />);
      
      const form = screen.getByRole('button', { name: 'Login' }).closest('form');
      expect(form).toBeInTheDocument();
    });
  });
});