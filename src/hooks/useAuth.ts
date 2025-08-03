import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../lib/store';
import { logout } from '@/lib/store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    ...auth,
    logoutUser,
  };
};
