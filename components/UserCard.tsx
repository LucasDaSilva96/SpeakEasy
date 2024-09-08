'use client';
import React from 'react';
import AvatarCircles from './magicui/avatar-circles';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserFriendType, UserType } from '@/types/user.types';
import Image from 'next/image';

export default function UserCard({
  users,
  flex_row,
}: {
  users: UserFriendType[] | UserType[] | [];
  flex_row: boolean;
}) {
  if (users.length === 0) return null;
  return (
    <motion.ul
      className={`flex ${
        !flex_row
          ? 'flex-col overflow-y-auto gap-2 items-start'
          : 'min-w-20 max-w-[98dvw] gap-2 overflow-x-auto items-center px-4 overflow-y-hidden'
      }`}
    >
      {users.map((user, i) => (
        <Link href={`/dashboard/chat/${user.id}`} key={i}>
          <motion.li
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              type: 'spring',
            }}
            className={
              !flex_row ? 'flex-center-col relative' : 'flex-center relative'
            }
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`bg-transparent rounded-full text-center ${
                user.status ? 'border-green-600/70' : 'border-gray-300/50'
              }`}
            >
              <div className='w-12 h-12 relative rounded-full overflow-clip'>
                <Image
                  src={user?.image || '/default-avatar.png'}
                  alt={user?.first_name + 'profile image'}
                  fill
                  sizes='(max-width: 200px) 100vw, (max-width: 300px) 50vw, 33vw'
                  priority
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>

              <p className='font-extralight text-xs text-white'>
                {user.first_name}
              </p>
            </motion.div>
          </motion.li>
        </Link>
      ))}
    </motion.ul>
  );
}
