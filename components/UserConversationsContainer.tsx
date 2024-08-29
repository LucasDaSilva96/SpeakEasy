'use client';

import { Conversation } from '@/types/conversation.types';
import { UserType } from '@/types/user.types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function UserConversationsContainer({
  searchString,
  conversations = [],
}: {
  searchString: string;
  conversations: Conversation[];
}) {
  console.log(conversations);
  return (
    <div className='w-full max-h-[50vh] flex flex-col gap-2 overscroll-y-auto'>
      {conversations.length > 0 &&
        conversations.map((conversation) => {
          const lastMessage =
            conversation.messages[conversation.messages.length - 1].message;
          const lastMessageSender =
            conversation.messages[conversation.messages.length - 1].sender_id;
          const friendName = conversation.friend_name;
          return (
            <Link
              href={`/dashboard/chat/${conversation.friend_id}`}
              key={conversation.friend_id}
            >
              <motion.div
                whileTap={{ scale: 0.98 }}
                whileHover={{
                  scale: 1.01,
                }}
                className='flex items-center gap-2 p-2 bg-slate-300 rounded-md cursor-pointer'
              >
                <Image
                  src={conversation.friend_profile_image}
                  alt='profile image'
                  width={50}
                  height={50}
                  className='rounded-full'
                />
                <div className='flex flex-col gap-1'>
                  <h1 className='font-light'>{friendName}</h1>
                  <p className='text-sm text-slate-500 flex flex-col'>
                    <span>- {lastMessage}</span>
                    <span>
                      {lastMessageSender === conversation.friend_id
                        ? friendName
                        : 'You'}
                    </span>
                  </p>
                </div>
              </motion.div>
            </Link>
          );
        })}
    </div>
  );
}
