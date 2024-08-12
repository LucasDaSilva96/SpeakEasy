import React from 'react';

export default function Chat_Page({ params }: { params: { chatID: string } }) {
  const friend_id = params.chatID;

  return <div>chat page</div>;
}
