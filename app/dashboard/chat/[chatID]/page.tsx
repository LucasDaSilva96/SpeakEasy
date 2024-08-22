import Chat from '@/components/Chat';
import { getLoggedInUser } from '@/lib/actions/login.actions';
import { createOrGetConversation } from '@/lib/actions/message.actions';
import { getUser } from '@/lib/actions/user.actions';
import { createClient_server } from '@/lib/supabase/server';
import { Loader2Icon } from 'lucide-react';

export default async function Chat_Page({
  params,
}: {
  params: { chatID: string };
}) {
  const id = params.chatID;
  const user = await getLoggedInUser();
  const friend = await getUser(id);
  const conversationId = await createOrGetConversation(id);

  if (!user || !friend)
    return (
      <div className='min-w-full min-h-[75vh] flex-center'>
        <h1 className='text-lg text-blue flex-center gap-1'>
          Loading{' '}
          <span>
            <Loader2Icon size={20} className='animate-spin' />
          </span>
        </h1>
      </div>
    );

  return (
    <Chat id={id} user={user} friend={friend} conversationID={conversationId} />
  );
}
