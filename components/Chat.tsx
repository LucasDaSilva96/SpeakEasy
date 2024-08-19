'use client';
import { useEffect, useRef, useState } from 'react';
import AvatarCircles from '@/components/magicui/avatar-circles';
import WritingAnimation from '@/components/WritingAnimation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserFriendType, UserType } from '@/types/user.types';
import { getUser } from '@/lib/actions/user.actions';
import toast from 'react-hot-toast';
import { RealtimeChannel, User } from '@supabase/supabase-js';
import { createClient_browser } from '@/lib/supabase/client';

interface ChatProps {
  id: string;
  user: User;
  friend: UserFriendType;
}

export default function Chat({ id, friend, user }: ChatProps) {
  const supabase = createClient_browser();
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const message = useRef<HTMLTextAreaElement | null>(null);
  const channel = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!channel.current) {
      const topic = `${user.id} | ${id}`;
      console.log('Topic:', topic);
      // The topic is the channel name
      channel.current = supabase
        .channel(topic)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages' },
          (payload) => {
            console.log('Change received!', payload);
          }
        )
        .subscribe();
    }

    return () => {
      if (channel.current) supabase.removeChannel(channel.current!);
    };
  }, [id]);

  function onSend() {
    if (!channel.current || !message.current?.value) return;
    channel.current.send({
      type: 'broadcast',
      event: 'message',
      // The payload is the message object
      payload: {
        message: message.current.value,
        sender_id: '1',
      },
    });
    console.log('Message sent!');
    message.current.value = '';
  }

  return (
    <section className='w-full p-2 relative flex flex-col'>
      <header className='w-full flex items-center'>
        <div className='ml-auto flex items-center gap-1.5 rounded-xl shadow-sm bg-slate-200 p-1 min-w-[150px]'>
          <AvatarCircles avatarUrls={['/default-avatar.png']} />
          <div className='flex-center gap-0.5'>
            <h2 className='font-extralight text-gray-600 text-sm'>
              {friend?.first_name}
            </h2>
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
          ref={message}
          placeholder='Type your message here.'
          className='bg-slate-200 outline-none outline-offset-0 border-none'
        />
        <Button className='bg-blue min-w-[280px]' onClick={onSend}>
          Send message
        </Button>
      </div>
    </section>
  );
}
