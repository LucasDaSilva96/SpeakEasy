import React from 'react';
import UserConversationsContainer from '@/components/UserConversationsContainer';
import { getUserFriends } from '@/lib/actions/user.actions';
import UserCard from '@/components/UserCard';
import { UserFriendType } from '@/types/user.types';
import { getDashboardConversations } from '@/lib/actions/message.actions';

export default async function Dashboard() {
  const friends = (await getUserFriends()) as unknown as UserFriendType[];

  const conversations = await getDashboardConversations();

  console.log('####', conversations);

  return (
    <section className='w-full px-2 flex flex-col gap-2 pt-2'>
      <input
        type='text'
        className='bg-slate-300  rounded-md py-1 px-1 mt-2'
        placeholder='Find friend'
      />
      <h1 className='font-semibold'>Friends ({friends.length})</h1>

      <UserCard users={friends} flex_row={false} />

      <hr className='mt-2' />

      <UserConversationsContainer searchString='' />
    </section>
  );
}
