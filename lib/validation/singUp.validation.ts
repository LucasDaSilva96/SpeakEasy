import { z } from 'zod';

export const signUpValidation = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
    firstName: z.string(),
    lastName: z.string(),
    image: z.string().optional(),
    nativeLanguage: z.string(),
  })
  .superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['passwordConfirm'],
      });
    }
  });
