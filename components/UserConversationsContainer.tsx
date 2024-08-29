'use client';
import { Conversation } from '@/types/conversation.types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { Badge } from './ui/badge';
import { formatDate } from '@/lib/utils';
import { translate } from '@/lib/actions/translate.actions';
import { TargetLanguageCode } from 'deepl-node';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function UserConversationBox({
  conversation,
}: {
  conversation: Conversation;
}) {
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const [translatedMessage, setTranslatedMessage] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const translated = await translate(
          lastMessage.message,
          lastMessage.language as TargetLanguageCode,
          true
        );
        setTranslatedMessage(translated);
        setIsLoading(false);
      } catch (e: any) {
        setIsLoading(false);
        console.error(e);
        toast.error('Error translating message');
      }
    })();
  }, [conversation.messages.length, lastMessage.message]);

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
          <h1 className='font-light text-[0.8rem]'>
            {conversation.friend_name}
          </h1>
          <div className='text-sm text-slate-500 flex flex-col'>
            <Badge>
              {isLoading ? (
                <Loader2 size={16} className='animate-spin text-blue' />
              ) : (
                <span>- {translatedMessage}</span>
              )}
            </Badge>
            <div className='flex items-center gap-1 font-extralight text-[0.7rem]'>
              <span>
                {lastMessage.sender_id === conversation.friend_id
                  ? conversation.friend_name
                  : 'You'}
              </span>
              <span>{formatDate(lastMessage.created_at)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
