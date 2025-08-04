import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import LoginContainer from '@/components/auth/LoginContainer';
import { useRouter } from 'next/navigation';
import { clearError } from '@/lib/store/authSlice';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

interface MockState {
  auth: {
    isAuthenticated: boolean;
    username?: string;
    token?: string | null;
    error?: string | null;
    loading?: boolean;
  };
}

const mockStore = configureStore<MockState>([]);

describe('LoginContainer', () => {
  let store: MockStoreEnhanced<MockState, object>;
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });

    store = mockStore({
      auth: {
        isAuthenticated: false,
        username: '',
        token: null,
        error: null,
        loading: false,
      },
    });

    store.dispatch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo and login form', () => {
    render(
      <Provider store={store}>
        <LoginContainer />
      </Provider>
    );

    expect(screen.getByText(/enter the galaxy/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('redirects if authenticated', () => {
    const authenticatedStore = mockStore({
      auth: {
        isAuthenticated: true,
        username: 'testuser',
        token: 'mock-token',
        error: null,
        loading: false,
      },
    });

    render(
      <Provider store={authenticatedStore}>
        <LoginContainer />
      </Provider>
    );

    expect(push).toHaveBeenCalledWith('/movies');
  });

  it('dispatches clearError on mount', () => {
    render(
      <Provider store={store}>
        <LoginContainer />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(clearError());
  });

  it('displays error message when auth has error', () => {
    const errorStore = mockStore({
      auth: {
        isAuthenticated: false,
        username: '',
        token: null,
        error: 'Invalid credentials',
        loading: false,
      },
    });

    render(
      <Provider store={errorStore}>
        <LoginContainer />
      </Provider>
    );

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});

// ✅ Alternative approach: Create a properly typed helper function
export const createMockStore = (
  overrides: Partial<MockState> = {}
): MockStoreEnhanced<MockState, object> => {
  const defaultState: MockState = {
    auth: {
      isAuthenticated: false,
      username: '',
      token: null,
      error: null,
      loading: false,
    },
  };

  const finalState = {
    ...defaultState,
    ...overrides,
    auth: {
      ...defaultState.auth,
      ...overrides.auth,
    },
  };

  return mockStore(finalState);
};

// Usage example with helper:
describe('LoginContainer (with helper)', () => {
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it('works with helper function', () => {
    const store = createMockStore();
    store.dispatch = jest.fn();

    render(
      <Provider store={store}>
        <LoginContainer />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(clearError());
  });

  it('handles authenticated state with helper', () => {
    const store = createMockStore({
      auth: { isAuthenticated: true, username: 'testuser' },
    });

    render(
      <Provider store={store}>
        <LoginContainer />
      </Provider>
    );

    expect(push).toHaveBeenCalledWith('/movies');
  });
});
