'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema } from '@/utils/validation/authSchema';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { login, updateUsers } from '@/lib/store/authSlice';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RootState } from '@/lib/store';
import { getToastClass } from '@/utils/toastVariants';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
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
    reset: resetRegisterForm,
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      const user = users.find(
        u =>
          u.username.toLowerCase() === data.username.toLowerCase() && u.password === data.password
      );

      if (!user) {
        throw new Error('Invalid username or password');
      }

      dispatch(login(user));
      toast('Login successful', {
        description: 'Welcome back to the Star Wars universe!',
      });

      router.push('/movies');
    } catch (err) {
      toast('Login failed', {
        description: (err as Error).message,
        className: getToastClass('destructive'),
      });
    }
  };

  const handleRegister = async (data: z.infer<typeof registerSchema>) => {
    try {
      const existingUser = users.find(
        u => u.username.toLowerCase() === data.username.toLowerCase()
      );

      if (existingUser) {
        throw new Error('Username already exists');
      }

      const newUser = { ...data, id: Date.now().toString() };

      dispatch(updateUsers(newUser));

      dispatch(login(newUser));

      toast('Registration successful', {
        description: 'Welcome to the Star Wars universe!',
      });

      resetRegisterForm();

      router.push('/movies');
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
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black transition-all duration-300 cursor-pointer"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black transition-all duration-300 cursor-pointer"
            >
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit(handleLogin)} className="space-y-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="login-username">Username</Label>
                <Input id="login-username" {...registerLogin('username')} />
                {loginErrors.username && (
                  <p className="text-red-400 text-sm">{loginErrors.username.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" {...registerLogin('password')} />
                {loginErrors.password && (
                  <p className="text-red-400 text-sm">{loginErrors.password.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25"
                disabled={isLoading}
              >
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
                <Label htmlFor="register-email">Email</Label>
                <Input id="register-email" type="email" {...registerRegister('email')} />
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
              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
