'use client';

import React from 'react';
import { Button } from './ui/button';
import AvatarCircles from './magicui/avatar-circles';
import { LogOutIcon } from 'lucide-react';
import { logout } from '@/lib/actions/login.actions';

export default function Header() {
  return (
    <header className='w-full flex items-center justify-between px-1 py-1'>
      <aside className='flex'>
        <AvatarCircles avatarUrls={['/default-avatar.png']} />

        <div className='self-end flex items-center gap-1 -ml-1.5 z-10'>
          <div className='w-2 h-2 rounded-full bg-green-600 animate-pulse' />
          <p className='font-extralight text-xs text-gray-500'>{'User'}</p>
        </div>
      </aside>
      <Button
        className='bg-blue flex-center gap-1'
        onClick={async () => await logout()}
      >
        <span className='hidden md:inline'>Logout</span>
        <LogOutIcon size={18} />
      </Button>
    </header>
  );
}
