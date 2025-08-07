'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { formConfig } from '@/constants/authForm';

type Mode = 'login' | 'register';

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error, users } = useSelector((state: RootState) => state.auth);
  const [tab, setTab] = useState<Mode>('login');
  const getError = (field: string) => errors?.[field as keyof typeof errors]?.message;

  const config = formConfig[tab];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof config.schema>>({
    resolver: zodResolver(config.schema),
  });

  const onSubmit = async (data: any) => {
    try {
      if (tab === 'login') {
        const user = users.find(
          u =>
            u.username.toLowerCase() === data.username.toLowerCase() && u.password === data.password
        );

        if (!user) throw new Error('Invalid username or password');

        dispatch(login(user));
      } else {
        const existingUser = users.find(
          u => u.username.toLowerCase() === data.username.toLowerCase()
        );

        if (existingUser) throw new Error('Username already exists');

        const newUser = { ...data, id: Date.now().toString() };
        dispatch(updateUsers(newUser));
        dispatch(login(newUser));
      }

      toast(config.successMsg, {
        description: config.description,
      });

      reset();
      router.push('/movies');
    } catch (err) {
      toast(`${tab === 'login' ? 'Login' : 'Registration'} failed`, {
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
        <Tabs defaultValue={tab} onValueChange={val => setTab(val as Mode)} className="w-full">
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

          {(['login', 'register'] as const).map(mode => (
            <TabsContent key={mode} value={mode}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
                {formConfig[mode].fields.map(field => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={`${mode}-${field}`}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Label>
                    <Input
                      id={`${mode}-${field}`}
                      type={field === 'password' ? 'password' : 'text'}
                      {...register(field)}
                    />
                    {getError(field) && (
                      <p className="text-red-400 text-sm">{getError(field) as string}</p>
                    )}
                  </div>
                ))}

                <Button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25"
                  disabled={isLoading}
                >
                  {isLoading
                    ? mode === 'login'
                      ? 'Logging in...'
                      : 'Creating Account...'
                    : formConfig[mode].buttonLabel}
                </Button>
              </form>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
