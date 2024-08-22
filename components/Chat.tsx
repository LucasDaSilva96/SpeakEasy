'use client';
import { useEffect, useRef, useState } from 'react';
import AvatarCircles from '@/components/magicui/avatar-circles';
import WritingAnimation from '@/components/WritingAnimation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserFriendType, UserType } from '@/types/user.types';
import toast from 'react-hot-toast';
import { RealtimeChannel } from '@supabase/supabase-js';
import { createClient_browser } from '@/lib/supabase/client';
import { UserMinus } from 'lucide-react';
import { TooltipComponent } from './ToolTipComponent';
import { removeFriend } from '@/lib/actions/user.actions';

interface ChatProps {
  id: string;
  user: UserType;
  friend: UserFriendType;
  conversationID: string;
}

export default function Chat({ id, friend, user, conversationID }: ChatProps) {
  const supabase = createClient_browser();
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(friend.status);
  const [messages, setMessages] = useState<any[]>([]);
  const message = useRef<HTMLTextAreaElement | null>(null);
  const channel = useRef<RealtimeChannel | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!channel.current) {
      const topic = conversationID;

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
  }, [id, user.id]);

  async function deleteFriend() {
    try {
      setLoading(true);
      await removeFriend(friend.id);
      setLoading(false);
      toast.success('Friend removed successfully');
    } catch (e: any) {
      setLoading(false);
      console.error(e);
      toast.error(e.message);
    }
  }

  function onSend() {
    if (!channel.current || !message.current?.value) return;
    channel.current.send({
      type: 'broadcast',
      event: 'message',
      // The payload is the message object
      payload: {
        message: message.current.value,
        sender_id: user.id,
        language: user.native_language,
      },
    });
    console.log('Message sent!');
    message.current.value = '';
  }

  return (
    <section className='w-full p-2 relative flex flex-col'>
      <header className='w-full flex items-center gap-x-2.5'>
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
        <TooltipComponent hoverText='Remove contact'>
          <Button
            disabled={loading}
            onClick={deleteFriend}
            variant={'default'}
            className='w-10 p-0 h-11 bg-red'
          >
            <UserMinus size={20} />
          </Button>
        </TooltipComponent>
      </header>
      <div className='w-full p-1 h-[45dvh] border rounded-md overflow-y-auto  mt-2 flex flex-col gap-2'></div>
      <div className='flex-center-col w-full gap-2 mt-4'>
        <Textarea
          ref={message}
          placeholder='Type your message here.'
          className='bg-slate-200 outline-none outline-offset-0 border-none'
        />
        <Button
          disabled={loading}
          className='bg-blue min-w-[280px]'
          onClick={onSend}
        >
          Send message
        </Button>
      </div>
    </section>
  );
}
