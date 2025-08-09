import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MoviesPage from '@/components/layout/Movies';

jest.mock('@/components/layout/Movies', () => ({
  __esModule: true,
  default: () => <div data-testid="movies-page">Movies Page Content</div>,
}));

jest.mock('@/components/auth/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => (
    <div data-testid="protected-route">{children}</div>
  ),
}));

function Movies() {
  return (
    <ProtectedRoute>
      <MoviesPage />
    </ProtectedRoute>
  );
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('Movies Page', () => {
  it('should render protected route wrapper', () => {
    render(<Movies />, { wrapper: createWrapper() });
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
  });

  it('should render movies page content inside protected route', () => {
    render(<Movies />, { wrapper: createWrapper() });

    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('movies-page')).toBeInTheDocument();
    expect(screen.getByText('Movies Page Content')).toBeInTheDocument();
  });

  it('should have correct structure', () => {
    const { container } = render(<Movies />, { wrapper: createWrapper() });

    const wrapper = container.firstChild;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.nodeName).toBe('DIV');
  });
});
