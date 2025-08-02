import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../lib/store';
import { login, logout } from '../lib/store/authSlice';
import { useCallback } from 'react';
import { LoginCredentials } from '@/lib/store/types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  
};
