'use client';
import React from 'react';
import SignInForm from '@/components/Forms/SignInForm';
import SignUpForm from '@/components/Forms/SignUpFrom';
import WelcomeHeader from '@/components/WelcomeHeader';
import { motion } from 'framer-motion';
import ForgotPasswordForm from '@/components/Forms/ForgotPasswordForm';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Authentication_Page() {
  const [state, setState] = React.useState('login');
  const session = useSession();

  if (session?.status === 'authenticated') {
    return redirect('/dashboard');
  }

  return (
    <section className='w-full min-h-screen bg-gradient-pattern flex-center-col gap-4 relative p-2'>
      <WelcomeHeader />
      <div className='glass rounded-md shadow-md p-4 min-w-[370px] flex flex-col gap-2'>
        {state === 'login' ? (
          <SignInForm />
        ) : state === 'signup' ? (
          <SignUpForm setState={setState} />
        ) : (
          <ForgotPasswordForm setState={setState} />
        )}

        <div
          className={`w-full text-sm text-black ${
            state === 'login' ? 'mt-7' : 'mt-2'
          }`}
        >
          <p className='min-w-[97px]'>
            {state === 'login'
              ? 'Not a member?'
              : state === 'signup'
              ? 'Already a member?'
              : ''}
          </p>
          <div className='w-full flex items-center justify-between'>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setState(
                  state === 'login'
                    ? 'signup'
                    : state === 'forgotPassword'
                    ? 'login'
                    : 'login'
                );
              }}
              type='button'
              className='text-white underline'
            >
              {state === 'login'
                ? 'Sign up now'
                : state === 'signup'
                ? 'Login now'
                : 'Back to login'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setState('forgotPassword');
              }}
              type='button'
              className='text-red underline'
            >
              Forgot Password?
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
