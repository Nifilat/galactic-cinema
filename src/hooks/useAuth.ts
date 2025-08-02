import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../lib/store';
import { login, logout } from '../lib/store/authSlice';
import { generateToken } from '../lib/utils';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const handleLogin = (username: string, password: string) => {
    // Simulate authentication (in real app, this would be an API call)
    if (username && password) {
      const token = generateToken();
      dispatch(login({ username, token }));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    ...auth,
    login: handleLogin,
    logout: handleLogout,
  };
};
