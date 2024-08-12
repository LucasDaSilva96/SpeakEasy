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
import { Loader2 } from 'lucide-react';

import toast from 'react-hot-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const passwordSchema = z
  .object({
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
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

export default function Reset_Password_Page({
  params,
}: {
  params: { token: string };
}) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  if (!params.token || !email) {
    return (
      <section className='w-full min-h-screen bg-gradient-pattern flex-center'>
        <div className='flex-center-col gap-4'>
          <h1 className='text-3xl font-bold text-white'>Incorrect URL</h1>
          <p className='text-lg text-white'>
            The URL you are trying to access is incorrect.
            <br /> Please try again.
          </p>
          <Link
            className='py-2 px-4 bg-black rounded-md text-white'
            href={'/auth'}
          >
            Back
          </Link>
        </div>
      </section>
    );
  }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof passwordSchema>) {
    try {
      if (!params.token) throw new Error('Token is required');
      if (!email) throw new Error('Email is required');
      if (!values.password || !values.passwordConfirm)
        throw new Error('Password is required');
      if (values.password !== values.passwordConfirm)
        throw new Error('Passwords do not match');
      setLoading(true);
      // TODO: Implement the resetPassword function
    } catch (e: any) {
      console.error(e);
      toast.error(e.message);
      setLoading(false);
    }
  }

  return (
    <section className='w-full min-h-screen bg-gradient-pattern flex-center relative'>
      <Button
        className='absolute top-2 left-2 bg-white text-black z-40 hover:text-white'
        onClick={() => router.push('/auth')}
      >
        Home
      </Button>
      <div className='min-w-[380px] glass p-2 rounded-md shadow-md'>
        <div className='flex-center-col pb-4'>
          <h3 className='text-center py-2 font-semibold text-white text-lg'>
            Reset Your Password
          </h3>
          <p className='text-white text-sm font-thin'>
            Please enter your new password
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-center-col gap-6'
          >
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='flex flex-col text-white w-full'>
                  <FormLabel className='text-xs'>Password*</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Password'
                      autoComplete='new-password'
                      className='bg-black/75 transition-colors ease-in  focus:bg-black border-none'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='hidden'>
                    Enter a new password
                  </FormDescription>
                  <FormMessage className='text-rose-600' />
                </FormItem>
              )}
            />
            {/*  */}
            <FormField
              control={form.control}
              name='passwordConfirm'
              render={({ field }) => (
                <FormItem className='flex flex-col text-white w-full'>
                  <FormLabel className='text-xs'>Confirm Password*</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      autoComplete='off'
                      className='bg-black/75 transition-colors ease-in  focus:bg-black border-none'
                      placeholder='Confirm password'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='hidden'>
                    Confirm your new password
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
              <p>Submit</p>
              {loading && (
                <span>
                  <Loader2 size={16} className='animate-spin' />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
