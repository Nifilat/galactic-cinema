import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider,  } from 'react-redux';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import LoginContainer from '@/components/auth/LoginContainer';
import { useRouter } from 'next/navigation';
import { clearError } from '@/lib/store/authSlice';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockStore = configureStore([]);

describe('LoginContainer', () => {
  let store: MockStoreEnhanced<unknown, {}>;
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    store = mockStore({
      auth: {
        isAuthenticated: false,
      },
    });

    store.dispatch = jest.fn();
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
    store = mockStore({
      auth: {
        isAuthenticated: true,
      },
    });

    render(
      <Provider store={store}>
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
});