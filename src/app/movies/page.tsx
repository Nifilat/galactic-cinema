import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MoviesPage from '@/components/layout/Movies';
export default function Movies() {
  return (
    <div>
      <ProtectedRoute>
        <MoviesPage />
      </ProtectedRoute>
    </div>
  );
}
