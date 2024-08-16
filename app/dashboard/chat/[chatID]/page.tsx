'use client';

import React, { useEffect } from 'react';
import AvatarCircles from '@/components/magicui/avatar-circles';
import WritingAnimation from '@/components/WritingAnimation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserFriendType } from '@/types/user.types';
import { getUser } from '@/lib/actions/user.actions';
import toast from 'react-hot-toast';

export default function Chat_Page({ params }: { params: { chatID: string } }) {
  const id = params.chatID;
  const [isTyping, setIsTyping] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(true);
  const [friend, setFriend] = React.useState<UserFriendType | null>(null);

  useEffect(() => {
    getUser(id)
      .then((data) => {
        setFriend(data);
      })
      .catch((e: any) => {
        console.error(e);
        toast.error(e.message);
      });
  }, [id]);

  return (
    <section className='w-full p-2 relative flex flex-col'>
      <header className='w-full flex items-center'>
        <div className='ml-auto flex items-center gap-1.5 rounded-xl shadow-sm bg-slate-200 p-1 min-w-[150px]'>
          <AvatarCircles avatarUrls={['/default-avatar.png']} />
          <div className='flex-center gap-0.5'>
            <h2 className='font-extralight text-gray-600 text-sm'>Friend</h2>
            {isOnline ? (
              <div className='w-2 h-2 rounded-full bg-green-600 animate-pulse' />
            ) : (
              <div className='w-2 h-2 rounded-full bg-gray-400/50' />
            )}
          </div>
          {isTyping && <WritingAnimation />}
        </div>
      </header>
      <div className='w-full p-1 h-[45dvh] border rounded-md overflow-y-auto  mt-2 flex flex-col gap-2'></div>
      <div className='flex-center-col w-full gap-2 mt-4'>
        <Textarea
          placeholder='Type your message here.'
          className='bg-slate-200 outline-none outline-offset-0 border-none'
        />
        <Button className='bg-blue min-w-[280px]'>Send message</Button>
      </div>
    </section>
  );
}
