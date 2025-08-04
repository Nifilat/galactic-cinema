import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/auth/LoginForm';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { login, updateUsers } from '@/lib/store/authSlice';

jest.mock('sonner', () => ({
  toast: jest.fn(),
}));

const mockStore = configureStore([]);

describe('LoginForm', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: {
        users: [{ username: 'testuser', password: 'password', id: '1' }],
        error: null,
        isLoading: false,
      },
    });
    store.dispatch = jest.fn();
  });

  const renderWithProvider = () =>
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

  it('renders login and register tabs', () => {
    renderWithProvider();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  it('shows validation error if login fields are empty', async () => {
    renderWithProvider();

    // Submit the form without filling any fields to trigger validation
    const loginButton = screen.getByRole('button', { name: /^login$/i });
    await userEvent.click(loginButton);

    // Wait for both validation error messages to appear (checking by class)
    const errorMessages = await screen.findAllByText((content, element) => {
      return element?.className === 'text-red-400 text-sm';
    });

    expect(errorMessages).toHaveLength(2);
  });

  it('logs in successfully with valid credentials', async () => {
    renderWithProvider();

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'password');

    const loginButton = screen.getByRole('button', { name: /^login$/i });
    await userEvent.click(loginButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      login({ username: 'testuser', password: 'password', id: '1' })
    );
  });

  it('shows error on invalid login', async () => {
    renderWithProvider();

    await userEvent.type(screen.getByLabelText(/username/i), 'invalid');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrong');

    const loginButton = screen.getByRole('button', { name: /^login$/i });
    await userEvent.click(loginButton);

    expect(store.dispatch).not.toHaveBeenCalledWith(login(expect.anything()));
    // Use more specific selector to avoid multiple matches
    expect(screen.getByRole('tab', { name: /login/i })).toBeInTheDocument();
  });

  it('registers new user', async () => {
    renderWithProvider();

    await userEvent.click(screen.getByRole('tab', { name: /register/i }));

    await userEvent.type(screen.getByLabelText(/username/i), 'newuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'newuser@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'newpassword');

    const registerButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(registerButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      updateUsers(expect.objectContaining({ username: 'newuser' }))
    );
  });
});
