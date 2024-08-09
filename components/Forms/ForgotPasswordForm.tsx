'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import toast from 'react-hot-toast';
import { generateToken, getUser } from '@/lib/actions/user.actions';
import { parseResponse } from '@/lib/response';
import { UserType } from '@/types/user.types';

interface Props {
  setState: (state: string) => void;
}

export default function ForgotPasswordForm({ setState }: Props) {
  const [loading, setLoading] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      if (!formRef.current) return;
      const formData = new FormData(formRef.current);
      const email = formData.get('email') as string;
      const res = await generateToken(email);
      const user = parseResponse(res, {} as UserType);
      if (!user) {
        throw new Error('The user does not exist in our database');
      }
      formData.append('name', user.firstName + ' ' + user.lastName);
      formData.append('access_key', process.env.NEXT_PUBLIC_WEB3_FORM_KEY!);
      formData.append('subject', 'SpeakEasy - Reset Password');
      formData.append('from_name', 'SpeakEasy');
      formData.append(
        'message',
        `Here is your password reset link: ${process.env
          .NEXT_PUBLIC_HOST_URL!}/reset-password/${user.resetToken}?email=${
          user.email
        } .This link will expire in 15 minutes.`
      );

      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: json,
      });

      if (!response.ok) {
        throw new Error(
          'Something went wrong. Please try again or contact support'
        );
      }

      setLoading(false);
      toast.success('Password reset link has been sent to your email');
      formRef.current.reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      setLoading(false);
    }
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

      <form ref={formRef} onSubmit={onSubmit} className='flex-center-col gap-6'>
        <div className='w-full flex flex-col items-start gap-1.5'>
          <Label htmlFor='email' className='text-white'>
            Email*
          </Label>
          <Input
            id='email'
            type='email'
            name='email'
            autoComplete='email'
            placeholder='example@io.com'
            required
            className='bg-black/75 text-white border-none outline-none ring-0'
          />
        </div>
        <Button
          disabled={loading}
          className='flex items-center gap-1'
          type='submit'
        >
          <p>Send link</p>
          {loading && (
            <span>
              <Loader2 size={16} className='animate-spin' />
            </span>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
