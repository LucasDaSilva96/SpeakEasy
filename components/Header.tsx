'use client';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { Button } from './ui/button';

export default function Header() {
  const { data } = useSession();
  return (
    <header className='w-full flex items-center justify-between px-1'>
      <aside className='flex'>
        <div className='relative h-12 w-12 rounded-lg'>
          <Image
            src={data?.user?.image || '/default-avatar.png'}
            alt={data?.user?.name || 'Default profile logo'}
            fill
          />
        </div>
        <div className='self-end flex items-center gap-1 -ml-1.5 z-10'>
          <div className='w-2 h-2 rounded-full bg-green-600 animate-pulse' />
          <p className='font-extralight text-xs text-gray-500'>
            {data?.user?.name || 'User'}
          </p>
        </div>
      </aside>
      <Button className='bg-blue' onClick={() => signOut()}>
        Logout
      </Button>
    </header>
  );
}
