import { loginSchema, registerSchema } from '@/utils/validation/authSchema';

export const formConfig = {
  login: {
    schema: loginSchema,
    fields: ['username', 'password'],
    buttonLabel: 'Login',
    successMsg: 'Login successful',
    description: 'Welcome back to the Star Wars universe!',
  },
  register: {
    schema: registerSchema,
    fields: ['username', 'email', 'password'],
    buttonLabel: 'Create Account',
    successMsg: 'Registration successful',
    description: 'Welcome to the Star Wars universe!',
  },
} as const;
