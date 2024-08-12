'use client';

import { MessageType } from '@/types/message.types';
import { UserType } from '@/types/user.types';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ConversationResponse {
  _id: string;
  messages: MessageType[];
  users: UserType[];
}

export default function UserConversationsContainer({
  searchString,
}: {
  searchString: string;
}) {
  const conversations: ConversationResponse[] = [];

  return (
    <div className='w-full max-h-[50vh] flex flex-col gap-2 overscroll-y-auto'>
      {conversations.length > 0 &&
        conversations.map((conversation, i) => (
          <Link href={`/dashboard/chat/${conversation._id}`} key={i}>
            <motion.article
              initial={{ x: '100%', opacity: 0, scale: 0.5 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, type: 'spring', delay: i * 0.1 }}
              exit={{ x: -100, opacity: 0, scale: 0.5 }}
              whileTap={{ scale: 0.98 }}
              key={conversation._id}
              className='bg-blue p-2
          rounded-3xl flex cursor-pointer'
            >
              <div className='flex'>
                <div className='px-2 py-1 rounded-full bg-slate-100'>
                  {conversation.users.map((user) => {
                    // TODO fix this ↓
                    if (user.email !== '') {
                      return (
                        <div className='flex-center-col' key={user._id}>
                          <Image
                            key={user._id}
                            src={user.image}
                            alt={user.firstName}
                            width={40}
                            height={40}
                            className='rounded-full'
                          />
                          <span className='text-gray-600 font-extralight text-xs'>
                            {user.firstName}
                          </span>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <p className='pl-2 font-extralight self-center text-white'>
                - {conversation.messages[conversation.messages.length - 1].text}
              </p>
            </motion.article>
          </Link>
        ))}
    </div>
  );
}
