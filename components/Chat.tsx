'use client';
import { useEffect, useRef, useState } from 'react';
import WritingAnimation from '@/components/WritingAnimation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserFriendType, UserType } from '@/types/user.types';
import toast from 'react-hot-toast';
import { createClient_browser } from '@/lib/supabase/client';
import { UserMinus } from 'lucide-react';
import { TooltipComponent } from './ToolTipComponent';
import { removeFriend } from '@/lib/actions/user.actions';
import {
  getConversationMessages,
  sendMessage,
} from '@/lib/actions/message.actions';
import { MessageType } from '@/types/message.types';
import { translate } from '@/lib/actions/translate.actions';
import { TargetLanguageCode } from 'deepl-node';
import BigLoaderScreen from './BigLoaderScreen';
import { formatDate } from '@/lib/utils';
import { revalidate } from '@/lib/revalidation';
import Image from 'next/image';

interface ChatProps {
  user: UserType;
  friend: UserFriendType;
  conversationID: string;
}

export default function Chat({ friend, user, conversationID }: ChatProps) {
  const supabase = createClient_browser();
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(friend.status);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const message = useRef<HTMLTextAreaElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleInsert = async (payload: any) => {
    if (payload.new.sender_id === user.id) {
      setMessages((prev) => [...prev, payload.new]);
      return;
    }

    try {
      setIsTyping(true);
      const translated = await translate(
        payload.new.message,
        user.native_language.language as TargetLanguageCode
      );
      setMessages((prev) => [...prev, { ...payload.new, message: translated }]);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setIsMounted(true);
        const data = await getConversationMessages(conversationID);
        setMessages(data);
        setIsMounted(false);
      } catch (e: any) {
        console.error(e);
        toast.error(e.message);
        setIsMounted(false);
      }
    })();
    const channel = supabase
      .channel(conversationID)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        handleInsert
      )
      .subscribe((state) => console.log(state));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationID]);

  useEffect(() => {
    const msgBoxes = document.querySelectorAll('.message__container');
    if (msgBoxes.length > 0) {
      msgBoxes[msgBoxes.length - 1].scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

  async function onSend() {
    if (!message.current?.value) return;
    let isError = false;
    try {
      setLoading(true);
      await sendMessage({
        conversation_id: conversationID,
        language: user.native_language.language as TargetLanguageCode,
        message: message.current.value,
        friend_id: friend.id,
      });
      message.current.value = '';
    } catch (e: any) {
      isError = true;
      console.error(e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
    if (isError) {
      revalidate('/dashboard');
    }
  }

  return (
    <section className='w-full p-2 relative flex flex-col mt-2'>
      {isMounted && <BigLoaderScreen />}
      <header className='w-full flex items-center justify-between'>
        <div className='flex items-center gap-1.5 rounded-xl shadow-sm bg-brown py-1 px-4'>
          <div className='w-10 h-10 relative rounded-full overflow-clip'>
            <Image
              src={friend?.image || '/default-avatar.png'}
              alt={friend?.first_name + 'profile image'}
              loading='lazy'
              fill
              sizes='(max-width: 200px) 100vw, (max-width: 300px) 50vw, 33vw'
              style={{
                objectFit: 'cover',
              }}
            />
          </div>
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
        {friend.first_name !== 'User no longer exists' && (
          <TooltipComponent hoverText={`Remove ${friend.first_name}`}>
            <Button
              disabled={loading}
              onClick={deleteFriend}
              variant={'default'}
              className='w-10 p-0 h-11 bg-white/50 rounded-full'
            >
              <UserMinus size={20} />
            </Button>
          </TooltipComponent>
        )}
      </header>
      <div className='w-full p-2 h-[44dvh] border border-brown rounded-md overflow-y-auto mt-1 flex flex-col gap-2'>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${
              msg.sender_id === user.id ? 'self-end' : 'self-start'
            } relative flex flex-col gap-1`}
          >
            <p
              className={`${
                msg.sender_id === user.id
                  ? 'bg-blue text-white'
                  : 'bg-slate-200 text-gray-600'
              } p-2 rounded-md max-w-[370px] message__container`}
            >
              {msg.message}
            </p>
            <div
              className={`w-full text-[12px] text-gray-400 flex-center gap-1`}
            >
              <div
                className={`${
                  msg.sender_id === user.id ? 'ml-auto' : 'mr-auto'
                } flex gap-1`}
              >
                <span>
                  {msg.sender_id === user.id ? 'You' : friend.first_name}
                </span>
                <span>{formatDate(msg.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {friend.first_name !== 'User no longer exists' && (
        <div className='flex-center-col w-full gap-2 mt-2'>
          <Textarea
            ref={message}
            placeholder='Type your message here.'
            className='bg-slate-200 outline-none outline-offset-0 border-none text-black'
          />
          <Button
            disabled={loading}
            className='bg-brown min-w-[280px]'
            onClick={onSend}
          >
            Send message
          </Button>
        </div>
      )}
    </section>
  );
}
