'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import React from 'react';
import { signInValidation } from '@/lib/validation/signIn.validation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function SignInForm() {
  const [loading, setLoading] = React.useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof signInValidation>>({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    try {
      const { email, password } = values;

      const response: any = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!response.ok) {
        throw new Error(response.error);
      }
      setLoading(false);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message);
      setLoading(false);
    }
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
          Welcome back
        </h3>
        <p className='text-white text-sm font-thin'>
          Please enter your account details
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
          <Button
            disabled={loading}
            className='flex items-center gap-1'
            type='submit'
          >
            <p>Sign up</p>
            {loading && (
              <span>
                <Loader2 size={16} className='animate-spin' />
              </span>
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
