import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function Home_Page() {
  const session = await getServerSession();

  if (!session) {
    return redirect('/auth');
  }

  console.log('session', session);

  return <div>Hello</div>;
}
