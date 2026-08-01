import { z } from 'zod';

export const simple_email = z.string().email('Invalid email.');

export const simple_password_login = z.string().min(1, 'Password is required.'); // login password should not have all validation rules

export const simple_password = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(50, { message: 'Password must be less than 50 characters long' })
  .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  .regex(/\d/, { message: 'Password must contain at least one digit' })
  .regex(/[@$!%*?&]/, {
    message:
      'Password must contain at least one special character like @$!%*?&',
  });
