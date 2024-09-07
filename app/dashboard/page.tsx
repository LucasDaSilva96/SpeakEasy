import React from 'react';
import UserConversationsContainer from '@/components/UserConversationsContainer';
import { getUserFriends } from '@/lib/actions/user.actions';
import UserCard from '@/components/UserCard';
import { UserFriendType } from '@/types/user.types';
import { getDashboardConversations } from '@/lib/actions/message.actions';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const friends = (await getUserFriends()) as unknown as UserFriendType[];

  const conversations = await getDashboardConversations();

  return (
    <section className='w-full px-2 flex flex-col gap-2 pt-2'>
      <h1 className='font-semibold'>Friends ({friends.length})</h1>

      <UserCard users={friends} flex_row={true} />

      <hr className='mt-2' />

      <div className='w-full max-h-[50vh] flex flex-col gap-2 overscroll-y-auto'>
        {conversations &&
          conversations.length > 0 &&
          conversations.map((conversation) => (
            <UserConversationsContainer
              key={conversation.friend_id}
              conversation={conversation}
            />
          ))}
      </div>
    </section>
  );
}
