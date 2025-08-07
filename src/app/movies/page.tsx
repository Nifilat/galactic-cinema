import MoviesPage from '@/components/layout/Movies';
import Providers from '@/components/providers';
export default function Movies() {
  return (
    <div>
      <Providers requireAuth={true} redirectTo="/login">
        <MoviesPage />
      </Providers>
    </div>
  );
}
