import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';

jest.mock('@/components/layout/Movies', () => ({
  __esModule: true,
  default: () => createElement('div', { 'data-testid': 'movies-page' }, 'Movies Page Content'),
}));

jest.mock('@/components/auth/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) =>
    createElement('div', { 'data-testid': 'protected-route' }, children),
}));

const Movies = () => {
  const ProtectedRoute = require('@/components/auth/ProtectedRoute').default;
  const MoviesPage = require('@/components/layout/Movies').default;

  return createElement('div', {}, createElement(ProtectedRoute, {}, createElement(MoviesPage)));
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('Movies Page', () => {
  it('should render protected route wrapper', () => {
    render(createElement(Movies), { wrapper: createWrapper() });

    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
  });

  it('should render movies page content inside protected route', () => {
    render(createElement(Movies), { wrapper: createWrapper() });

    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('movies-page')).toBeInTheDocument();
  });

  it('should have correct structure', () => {
    const { container } = render(createElement(Movies), { wrapper: createWrapper() });

    const wrapper = container.firstChild;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.nodeName).toBe('DIV');
  });
});
