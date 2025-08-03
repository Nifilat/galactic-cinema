'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { clearError } from '@/lib/store/authSlice';
import type { RootState } from '@/lib/store';
import LoginForm from '@/components/auth/LoginForm';
import Logo from '@/components/ui/logo';

export default function LoginContainer() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/movies');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-slideUp">
          <Logo />
          <p className="text-gray-300">Enter the galaxy far, far away...</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
