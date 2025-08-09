import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  username: z.string().min(1, 'Username must be at least 1 character'),
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
