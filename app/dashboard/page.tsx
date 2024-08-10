import React from 'react';
import user from '@/data/users.json';
import UserCard from '@/components/UserCard';
import UserConversationsContainer from '@/components/UserConversationsContainer';
import { createNewConversation } from '@/lib/actions/conversation.actions';
import { createMessage } from '@/lib/actions/message.actions';

export default async function Dashboard() {
  // await createNewConversation(
  //   '66b5ea4cba8e199fb055ccf0',
  //   '66b7999bd9f6fbdd402afe22'
  // );

  // await createMessage(
  //   '66b7a308d9f6fbdd402afe66',
  //   '66b5ea4cba8e199fb055ccf0',
  //   'Hello, how are you?'
  // );
  return (
    <section className='w-full px-2 flex flex-col gap-2 pt-2'>
      <input
        type='text'
        className='bg-slate-200 rounded-md py-1 px-1 mt-2'
        placeholder='Search your chat'
      />
      <h1 className='font-semibold'>Friends ({user.users.length})</h1>
      <div className='max-w-[98dvw] flex items-center gap-2 overflow-x-auto px-4'>
        {user.users.map((user) => (
          <UserCard
            key={user.id}
            conversationsIds={user.conversationsIds}
            email={user.email}
            firstName={user.firstName}
            image={user.image}
            lastName={user.lastName}
            nativeLanguage={user.nativeLanguage}
            status={user.status}
            _id={user.id}
            flex_row={false}
          />
        ))}
      </div>
      <hr className='mt-2' />

      <UserConversationsContainer searchString='' />
    </section>
  );
}
