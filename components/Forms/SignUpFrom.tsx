'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React, { useEffect, useMemo } from 'react';
import { signUpValidation } from '@/lib/validation/singUp.validation';
import { LanguageType } from '@/types/language.types';
import { getAllLanguages } from '@/lib/actions/language.actions';

export default function SignUpForm() {
  const [languages, setLanguages] = React.useState<LanguageType[]>([]);

  useEffect(() => {
    getAllLanguages().then((res) => {
      setLanguages(res);
    });
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      passwordConfirm: '',
      nativeLanguage: '',
      image: '/default-avatar.jpg',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof signUpValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      exit={{ opacity: 0, scale: 0.6 }}
    >
      <div className='flex-center-col pb-4'>
        <h3 className='text-center py-2 font-semibold text-white text-lg'>
          Welcome
        </h3>
        <p className='text-white text-sm font-thin'>
          Join the Conversation, No Matter the Language
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex-center-col gap-6'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='flex flex-col text-white w-full'>
                <FormLabel className='text-xs'>Email*</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    autoComplete='email'
                    className='bg-black/75 transition-colors ease-in  focus:bg-black border-none'
                    placeholder='example@io.com'
                    {...field}
                  />
                </FormControl>
                <FormDescription className='hidden'>
                  Sign in with your email and password
                </FormDescription>
                <FormMessage className='text-rose-600' />
              </FormItem>
            )}
          />
          {/*  */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='flex flex-col text-white w-full'>
                <FormLabel className='text-xs'>Password*</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    autoComplete='current-password'
                    className='bg-black/75 transition-colors ease-in  focus:bg-black border-none'
                    placeholder='password'
                    {...field}
                  />
                </FormControl>
                <FormDescription className='hidden'>
                  Sign in with your email and password
                </FormDescription>
                <FormMessage className='text-rose-600' />
              </FormItem>
            )}
          />
          {/*  */}
          <Button type='submit'>Sign in</Button>
        </form>
      </Form>
    </motion.div>
  );
}
