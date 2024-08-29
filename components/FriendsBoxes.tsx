'use client';
import { UserFriendType, UserType } from '@/types/user.types';
import AvatarCircles from './magicui/avatar-circles';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Input } from './ui/input';
import { useState } from 'react';

type UserCardProps = {
  friends: UserFriendType[] | UserType[];
};
export default function FriendsBoxes({ friends }: UserCardProps) {
  const [search, setSearch] = useState('');
  const [friendsList, setFriendsList] = useState(friends);
  if (friends.length === 0) return null;

  const filterFriends = (search: string) => {
    setSearch(search);
    if (search === '') return setFriendsList(friends);
    const filteredFriends = friends.filter((friend) => {
      return (
        friend.first_name.toLowerCase().includes(search.toLowerCase()) ||
        friend.last_name.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFriendsList(filteredFriends as UserFriendType[]);
  };

  return (
    <div className='w-full h-full'>
      <Input
        type='text'
        minLength={1}
        value={search}
        onChange={(e) => filterFriends(e.target.value)}
        placeholder='Search for friends'
        className='bg-slate-300 rounded-md py-1 px-1'
      />
      <motion.ul className='w-full flex flex-wrap gap-6 mt-2 max-h-[75dvh]  overflow-y-auto'>
        {friendsList.length > 0 ? (
          friendsList.map((friend, i) => (
            <Link href={`/dashboard/chat/${friend.id}`} key={i}>
              <motion.li
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  type: 'spring',
                }}
                className={'flex-center relative flex-1 max-w-[200px]'}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className='text-center cursor-pointer'
                >
                  <AvatarCircles
                    avatarUrls={[friend?.image || '/default-avatar.png']}
                    className={`bg-slate-200/50 p-1 rounded-full border-2 ${
                      friend.status
                        ? 'border-green-600/70'
                        : 'border-gray-300/50'
                    }`}
                  />

                  <p className='font-extralight text-xs text-gray-500'>
                    {friend.first_name}
                  </p>
                </motion.div>
              </motion.li>
            </Link>
          ))
        ) : (
          <div className='w-full'>
            <h3 className='text-center text-xl'>No user found</h3>
          </div>
        )}
      </motion.ul>
    </div>
  );
}
