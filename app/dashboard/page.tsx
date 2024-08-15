import React from 'react';
import user from '@/data/users.json';

import UserConversationsContainer from '@/components/UserConversationsContainer';
import { getUserFriends } from '@/lib/actions/user.actions';

export default async function Dashboard() {
  const friends = await getUserFriends();
  return (
    <section className='w-full px-2 flex flex-col gap-2 pt-2'>
      <input
        type='text'
        className='bg-slate-300  rounded-md py-1 px-1 mt-2'
        placeholder='Search your chat'
      />
      <h1 className='font-semibold'>Friends ({user.users.length})</h1>

      <UserCard users={friends} flex_row={false} />

      <hr className='mt-2' />

      <UserConversationsContainer searchString='' />
    </section>
  );
}
