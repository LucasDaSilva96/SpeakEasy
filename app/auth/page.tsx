'use client';

import SignInForm from '@/components/Forms/SignInForm';
import SignUpForm from '@/components/Forms/SignUpFrom';
import { Button } from '@/components/ui/button';
import React from 'react';

export default function Authentication_Page() {
  const [state, setState] = React.useState('login');
  return (
    <section className='w-full min-h-screen'>
      <div>{state === 'login' ? <SignInForm /> : <SignUpForm />}</div>
      <Button
        className='mt-12 ml-4'
        onClick={() => {
          setState(state === 'login' ? 'signup' : 'login');
        }}
      >
        Click here
      </Button>
    </section>
  );
}
