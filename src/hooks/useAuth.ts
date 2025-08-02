import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../lib/store';
import { login, logout } from '../lib/store/authSlice';
import { useCallback } from 'react';
import { LoginCredentials } from '@/lib/store/types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      if (!username || !password) return false;

      const credentials: LoginCredentials = { username, password };
      try {
        const resultAction = await dispatch(login(credentials));

        if (login.fulfilled.match(resultAction)) {
          return true;
        } else {
          // Optionally: inspect resultAction.payload for error details
          return false;
        }
      } catch (err) {
        console.error('Login error:', err);
        return false;
      }
    },
    [dispatch]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    ...auth,
    login: handleLogin,
    logout: handleLogout,
  };
};
