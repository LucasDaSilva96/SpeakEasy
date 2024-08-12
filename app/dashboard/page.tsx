import React from 'react';
import user from '@/data/users.json';
import UserCard from '@/components/UserCard';
import UserConversationsContainer from '@/components/UserConversationsContainer';

export default async function Dashboard() {
  return (
    <section className='w-full px-2 flex flex-col gap-2 pt-2'>
      <input
        type='text'
        className='bg-slate-300  rounded-md py-1 px-1 mt-2'
        placeholder='Search your chat'
      />
      <h1 className='font-semibold'>Friends ({user.users.length})</h1>

      <UserCard users={user.users} flex_row={false} />

      <hr className='mt-2' />

      <UserConversationsContainer searchString='' />
    </section>
  );
}
