'use client';

import { getUserConversations } from '@/lib/actions/user.actions';
import { parseResponse } from '@/lib/response';
import { MessageType } from '@/types/message.types';
import { UserType } from '@/types/user.types';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

interface ConversationResponse {
  _id: string;
  messages: MessageType[];
  users: UserType[];
}

export default function UserConversationsContainer({
  searchString,
}: {
  searchString: string;
}) {
  const [conversations, setConversations] = React.useState<
    ConversationResponse[]
  >([]);
  const { data } = useSession();
  React.useEffect(() => {
    (async () => {
      if (!data || !data.user || !data.user.email) return;
      const response = await getUserConversations(data.user.email);
      if (!response) return;
      const jsonObj = parseResponse(response, {} as any);
      setConversations(jsonObj);
    })();
  }, [data]);

  return (
    <div className='w-full max-h-[50vh] flex flex-col gap-2 overscroll-y-auto'>
      {conversations.length > 0 &&
        conversations.map((conversation) => (
          <article
            key={conversation._id}
            className='bg-blue p-2
          rounded-3xl flex'
          >
            <div className='flex'>
              <div className='px-2 py-1 rounded-full bg-slate-100'>
                {conversation.users.map((user) => {
                  if (user.email !== data?.user!.email) {
                    return (
                      <div className='flex-center-col' key={user._id}>
                        <Image
                          key={user._id}
                          src={user.image}
                          alt={user.firstName}
                          width={40}
                          height={40}
                          className='rounded-full'
                        />
                        <span className='text-gray-600 font-extralight text-xs'>
                          {user.firstName}
                        </span>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            <p className='pl-2 font-extralight self-center text-white'>
              - {conversation.messages[conversation.messages.length - 1].text}
            </p>
          </article>
        ))}
    </div>
  );
}
