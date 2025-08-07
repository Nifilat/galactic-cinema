'use client';

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { clearError } from '@/lib/store/authSlice';
import LoginForm from '@/components/auth/LoginForm';
import Logo from '@/components/ui/logo';

export default function LoginContainer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8 animate-slideUp">
          <Logo />
          <h1 className="text-xl font-semibold text-gray-300">Enter the galaxy far, far away...</h1>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
