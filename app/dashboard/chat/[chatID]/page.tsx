import React from 'react';

export default function Chat_Page({ params }: { params: { chatID: string } }) {
  console.log(params.chatID);
  return <div>chat page</div>;
}
