'use client';

import { Settings, Users2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function SideNavigation() {
  const path = usePathname();

  return (
    <nav className='min-w-[180px] h-full bg-slate-200 p-2 flex flex-col gap-2 items-start'>
      <Link
        href='/dashboard/profile'
        className={`${
          path === '/dashboard/profile'
            ? 'bg-blue text-slate-50'
            : 'bg-transparent'
        } flex-center gap-1 p-1 rounded-md`}
      >
        <span>Account</span>
        <span>
          <Settings size={18} />
        </span>
      </Link>
      <Link
        href='/dashboard/profile/friends'
        className={`${
          path === '/dashboard/profile/friends'
            ? 'bg-blue text-slate-50'
            : 'bg-transparent'
        } flex-center gap-1 p-1 rounded-md`}
      >
        <span>Manage Friends</span>
        <span>
          <Users2 size={18} />
        </span>
      </Link>
    </nav>
  );
}
