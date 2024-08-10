'use server';

import Conversation from '../models/conversation';
import Message from '../models/message';
import User from '../models/user';
import { connectToDB } from '../mongoose';

export const createMessage = async (
  conversationId: string,
  senderId: string,
  text: string
) => {
  try {
    await connectToDB();
    const conversation = await Conversation.findById(conversationId);
    const sender = await User.findById(senderId); // Check if the sender is part of the conversation
    if (!conversation || !sender) {
      throw new Error('Invalid conversation or sender');
    }
    const newMessage = new Message({
      conversationId: conversation.id,
      senderId: sender.id,
      text: text,
    });
    await newMessage.save();

    conversation.messages.push(newMessage.id);
    await conversation.save();

    return newMessage.id as string;
  } catch (err: any) {
    console.log(err);
    throw new Error(err.messages);
  }
};
