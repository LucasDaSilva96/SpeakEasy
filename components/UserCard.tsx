'use client';
import React from 'react';
import AvatarCircles from './magicui/avatar-circles';
import { motion } from 'framer-motion';

interface UserCardProps {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  conversationsIds: string[];
  nativeLanguage: string;
  status: string;
  flex_row?: boolean;
}

export default function UserCard({
  users,
  flex_row,
}: {
  users: UserCardProps[];
  flex_row: boolean;
}) {
  return (
    <motion.ul className='min-w-20 cursor-pointer max-w-[98dvw] flex items-center gap-2 overflow-x-auto px-4 overflow-y-hidden'>
      {users.map((user, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, type: 'spring', delay: i * 0.2 }}
          className={
            !flex_row ? 'flex-center-col relative' : 'flex-center relative'
          }
        >
          <motion.div whileTap={{ scale: 0.9 }} className='text-center'>
            <AvatarCircles
              avatarUrls={[user.image]}
              className={`bg-slate-200/50 p-1 rounded-full border-2 ${
                user.status === 'online'
                  ? 'border-green-600/70'
                  : 'border-gray-300/50'
              }`}
            />

            <p className='font-extralight text-xs text-gray-500'>
              {user.firstName}
            </p>
          </motion.div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
