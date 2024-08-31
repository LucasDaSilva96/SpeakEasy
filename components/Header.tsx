'use client';

import React from 'react';
import { Button } from './ui/button';
import AvatarCircles from './magicui/avatar-circles';
import { Loader2Icon, LogOutIcon } from 'lucide-react';
import { logout } from '@/lib/actions/login.actions';
import toast from 'react-hot-toast';
import { UserType } from '@/types/user.types';
import { Badge } from '@/components/ui/badge';
import NotificationHeader from './NotificationHeader';
import Image from 'next/image';

export default function Header({ user }: { user: UserType | null }) {
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setLoading(false);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message);
      setLoading(false);
    }
  };
  return (
    <header className='w-full flex items-center justify-between px-1 py-1'>
      <aside className='flex gap-1.5 items-center'>
        <div className='flex-center-col'>
          <div className='w-12 h-12 relative rounded-full overflow-clip'>
            <Image
              src={user?.image || '/default-avatar.png'}
              alt={user?.first_name + 'profile image'}
              fill
              style={{
                objectFit: 'cover',
              }}
            />
          </div>

          <div className='flex items-center gap-1 -ml-1.5 z-10'>
            {user?.status ? (
              <div className='w-2 h-2 rounded-full bg-green-600 animate-pulse' />
            ) : (
              <div className='w-2 h-2 rounded-full bg-gray-400/50' />
            )}
            <p className='font-extralight text-xs text-gray-500'>
              {user?.first_name}
            </p>
          </div>
        </div>
        <Badge className='bg-blue max-h-6 self-end hover:bg-blue'>
          <span>{user?.native_language.name}</span>
        </Badge>
      </aside>
      <div className='flex-center gap-10'>
        <NotificationHeader />
        <Button
          disabled={loading}
          className='bg-blue flex-center gap-1'
          onClick={handleLogout}
        >
          <span className='hidden md:inline'>Logout</span>
          {loading ? (
            <Loader2Icon size={18} className='animate-spin text-white' />
          ) : (
            <LogOutIcon size={18} />
          )}
        </Button>
      </div>
    </header>
  );
}
