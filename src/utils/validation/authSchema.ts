import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username must be at least 1 character'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  username: z.string().min(1, 'Username must be at least 1 characters'),
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
