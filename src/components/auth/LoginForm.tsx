'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema } from '@/utils/validation/authSchema';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { login, updateUsers,  } from '@/lib/store/authSlice';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RootState } from '@/lib/store';
import { getToastClass } from '@/utils/toastVariants';

export default function LoginForm() {
  const dispatch = useDispatch();
  const { isLoading, error, users } = useSelector((state: RootState) => state.auth);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
    const user = users.find(
        u =>
          u.username.toLowerCase() === data.username.toLowerCase() &&
          u.password === data.password
      );
    
      if (!user) {
        throw new Error('Invalid username or password');
      }
      dispatch(login(user));
      toast('Login successful', {
        description: 'Welcome back to the Star Wars universe!',
      });
    } catch (err) {
      toast('Login failed', {
        description: (err as Error).message,
        className: getToastClass('destructive'),
      });
    }
  };

  const handleRegister = async (data: z.infer<typeof registerSchema>) => {
    try {

      dispatch(updateUsers({...data, id: Date.now().toString()},))

      toast('Registration successful', {
        description: 'Welcome to the Star Wars universe!',
      });
    } catch (err) {
      toast('Registration failed', {
        description: (err as Error).message,
        className: getToastClass('destructive'),
      });
    }
  };

  return (
    <Card className="bg-gray-900/80 border-yellow-500/30 backdrop-blur-sm animate-slideUp shadow-2xl shadow-yellow-400/10">
      <CardHeader>
        <CardTitle className="text-yellow-400">Authentication</CardTitle>
        <CardDescription className="text-gray-300">
          Login or create an account to view Star Wars movies
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4 animate-shake">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 ">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-yellow-400 text-black cursor-pointer"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-yellow-400 text-black cursor-pointer"
            >
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit(handleLogin)} className="space-y-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" {...registerLogin('username')} />
                {loginErrors.username && (
                  <p className="text-red-400 text-sm">{loginErrors.username.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...registerLogin('password')} />
                {loginErrors.password && (
                  <p className="text-red-400 text-sm">{loginErrors.password.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit(handleRegister)} className="space-y-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="register-username">Username</Label>
                <Input id="register-username" {...registerRegister('username')} />
                {registerErrors.username && (
                  <p className="text-red-400 text-sm">{registerErrors.username.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...registerRegister('email')} />
                {registerErrors.email && (
                  <p className="text-red-400 text-sm">{registerErrors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input id="register-password" type="password" {...registerRegister('password')} />
                {registerErrors.password && (
                  <p className="text-red-400 text-sm">{registerErrors.password.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
