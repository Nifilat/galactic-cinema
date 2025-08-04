'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Logo from '../ui/logo';
import type { RootState } from '@/lib/store';
import { logout } from '@/lib/store/authSlice';
import { LogOut, User, Menu, X } from 'lucide-react';

export function Navigation() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-black/80 backdrop-blur-sm border-b border-yellow-500/20 sticky top-0 z-50 animate-slideDown">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo />
          </div>

          <div className="hidden md:flex items-center space-x-4 animate-fadeIn">
            <div className="flex items-center space-x-2 text-gray-300">
              <User className="h-4 w-4" />
              <span className="text-sm lg:text-base">Welcome, {user?.username}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 bg-transparent hover:scale-105"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Logout</span>
              <span className="lg:hidden">Logout</span>
            </Button>
          </div>

          <Button
            onClick={toggleMobileMenu}
            variant="ghost"
            size="sm"
            className="md:hidden text-yellow-400 hover:bg-yellow-400/10"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-700 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2 text-gray-300 px-2">
                <User className="h-4 w-4" />
                <span className="text-sm">Welcome, {user?.username}</span>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full justify-center border-yellow-500/50 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
