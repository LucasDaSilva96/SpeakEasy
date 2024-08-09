'use client';

import { getUserConversations } from '@/lib/actions/user.actions';
import { parseResponse } from '@/lib/response';
import { useSession } from 'next-auth/react';
import React from 'react';

export default function UserConversationsContainer({
  searchString,
}: {
  searchString: string;
}) {
  const [conversations, setConversations] = React.useState<any[]>([]);
  const { data } = useSession();
  React.useEffect(() => {
    (async () => {
      if (!data || !data.user || !data.user.email) return;
      const response = await getUserConversations(data.user.email);
      const jsonObj = parseResponse(response, {} as any);
      setConversations(jsonObj);
    })();
  }, [data]);

  console.log(conversations);
  return <div>UserConversationsContainer</div>;
}
