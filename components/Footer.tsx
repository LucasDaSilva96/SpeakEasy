'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MessageCircleMoreIcon,
  HomeIcon,
  UserCogIcon,
  UserRoundPlusIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const url = usePathname();

  console.log(url);
  return (
    <motion.footer
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      exit={{ y: 100, opacity: 0 }}
      className='mt-auto bg-blue py-3 text-white flex items-center justify-evenly px-4'
    >
      <Link
        href={'/dashboard'}
        className={`flex-center-col ${
          url === '/dashboard'
            ? 'text-white font-semibold'
            : 'text-gray-300 font-extralight'
        } hover:text-white`}
      >
        <span>
          <HomeIcon size={32} />
        </span>
        <span className='text-xs md:text-base'>Home</span>
      </Link>

      <Link
        href={'/dashboard/newChat'}
        className={`flex-center-col ${
          url === '/dashboard/newChat'
            ? 'text-white font-semibold'
            : 'text-gray-300 font-extralight'
        } hover:text-white`}
      >
        <span>
          <MessageCircleMoreIcon size={32} />
        </span>
        <span className='text-xs md:text-base'>New Chat</span>
      </Link>

      <Link
        href={'/dashboard/addNewFriend'}
        className={`flex-center-col ${
          url === '/dashboard/addNewFriend'
            ? 'text-white font-semibold'
            : 'text-gray-300 font-extralight'
        } hover:text-white`}
      >
        <span>
          <UserRoundPlusIcon size={32} />
        </span>
        <span className='text-xs md:text-base'>Add friend</span>
      </Link>

      <Link
        href={'/dashboard/profile'}
        className={`flex-center-col ${
          url === '/dashboard/profile'
            ? 'text-white font-semibold'
            : 'text-gray-300 font-extralight'
        } hover:text-white`}
      >
        <span>
          <UserCogIcon size={32} />
        </span>
        <span className='text-xs md:text-base'>Account</span>
      </Link>
    </motion.footer>
  );
}
