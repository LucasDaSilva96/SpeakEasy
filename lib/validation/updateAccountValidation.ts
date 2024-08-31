import { z } from 'zod';

export const updateAccountValidation = z
  .object({
    email: z.string().email(),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    nativeLanguage: z.string().min(1),
    image: z.string().optional(),
    password: z.string().optional(),
  })
  .superRefine(({ password }, ctx) => {
    if (password) {
      if (password.length < 8) {
        ctx.addIssue({
          code: 'custom',
          message: 'Password must be at least 8 characters',
        });
      }
    }
  });
