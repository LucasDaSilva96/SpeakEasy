'use client';
import React from 'react';
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
import { Loader2 } from 'lucide-react';

const validation = z.object({
  email: z.string().email(),
});

interface Props {
  setState: (state: string) => void;
}

export default function ForgotPasswordForm({ setState }: Props) {
  const [loading, setLoading] = React.useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      email: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof validation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    console.log(values);
  }
  return (
    <motion.div
      className='relative w-full'
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      exit={{ opacity: 0, scale: 0.6 }}
    >
      <div className='flex-center-col pb-4'>
        <h3 className='text-center py-2 font-semibold text-white text-lg'>
          Reset Your Password
        </h3>
        <p className='text-white text-sm font-thin'>
          Enter your email address and we&apos;ll send you a link to reset your
          password.
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
                  Sign up with your email
                </FormDescription>
                <FormMessage className='text-rose-600' />
              </FormItem>
            )}
          />
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
