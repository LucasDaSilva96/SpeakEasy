'use client';
import React from 'react';
import SignInForm from '@/components/Forms/SignInForm';
import SignUpForm from '@/components/Forms/SignUpFrom';
import WelcomeHeader from '@/components/WelcomeHeader';
import { motion } from 'framer-motion';

export default function Authentication_Page() {
  const [state, setState] = React.useState('login');

  return (
    <section className='w-full min-h-screen bg-gradient-pattern flex-center-col gap-4 relative'>
      <WelcomeHeader />
      <div className='glass rounded-md shadow-md p-4 min-w-[370px] flex flex-col gap-2'>
        {state === 'login' ? <SignInForm /> : <SignUpForm />}

        <div
          className={`flex items-center w-full gap-1.5 text-sm text-black ${
            state === 'login' ? 'mt-7' : 'mt-2'
          }`}
        >
          <p>Not a member?</p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setState(state === 'login' ? 'signup' : 'login');
            }}
            type='button'
            className='text-white underline'
          >
            Sign up now
          </motion.button>
        </div>
      </div>
    </section>
  );
}
