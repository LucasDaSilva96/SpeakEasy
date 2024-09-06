'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircleMoreIcon,
  HomeIcon,
  UserCogIcon,
  UserRoundPlusIcon,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Dock, DockIcon } from './magicui/dock';
import { cn } from '@/lib/utils';
import { revalidate } from '@/lib/revalidation';

export default function Footer() {
  const url = usePathname();
  const router = useRouter();

  const handleRedirect = async (path: string) => {
    await revalidate(path);
    return router.push(path);
  };

  return (
    <motion.footer
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      exit={{ y: 100, opacity: 0 }}
      className='mt-auto relative flex-center pb-0.5'
    >
      <Dock
        magnification={60}
        distance={100}
        direction='middle'
        className='min-w-[380px] flex justify-evenly bg-white/50 shadow-lg relative'
      >
        <DockIcon
          className={`${
            url === '/dashboard'
              ? 'bg-brown shadow-md'
              : 'bg-transparent shadow-none'
          } p-2 flex-center group hover:bg-brown`}
        >
          <HomeIcon
            className='size-full'
            onClick={() => handleRedirect('/dashboard')}
          />

          <ToolTip label='Home' className='group-hover:md:inline' />
        </DockIcon>
        <DockIcon
          className={`${
            url === '/dashboard/newChat'
              ? 'bg-brown shadow-md'
              : 'bg-transparent shadow-none'
          } p-2 flex-center group hover:bg-brown`}
        >
          <MessageCircleMoreIcon
            className='size-full z-10'
            onClick={() => handleRedirect('/dashboard/newChat')}
          />

          <ToolTip label='New Chat' className='group-hover:md:inline' />
        </DockIcon>
        <DockIcon
          className={`${
            url === '/dashboard/addNewFriend'
              ? 'bg-brown shadow-md'
              : 'bg-transparent shadow-none'
          } p-2 flex-center group hover:bg-brown`}
        >
          <UserRoundPlusIcon
            className='size-full'
            onClick={() => handleRedirect('/dashboard/addNewFriend')}
          />

          <ToolTip label='Add Friend' className='group-hover:md:inline' />
        </DockIcon>
        <DockIcon
          className={`${
            url.startsWith('/dashboard/profile')
              ? 'bg-brown shadow-md'
              : 'bg-transparent shadow-none'
          } p-2 flex-center group hover:bg-brown`}
        >
          <UserCogIcon
            className='size-full'
            onClick={() => handleRedirect('/dashboard/profile')}
          />

          <ToolTip label='Account' className='group-hover:md:inline' />
        </DockIcon>
      </Dock>
    </motion.footer>
  );
}

function ToolTip({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        'absolute text-brown transition-all duration-300 ease-linear top-[-1.65rem] hidden will-change-auto',
        className
      )}
    >
      <p>{label}</p>
    </div>
  );
}
