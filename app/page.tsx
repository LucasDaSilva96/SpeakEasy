'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Root_Page() {
  const session = useSession();

  if (session.status === 'authenticated') {
    return redirect('/dashboard');
  } else {
    return redirect('/auth');
  }
}
