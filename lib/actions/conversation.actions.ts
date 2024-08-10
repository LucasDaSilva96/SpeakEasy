'use server';

import Conversation from '../models/conversation';
import User from '../models/user';
import { connectToDB } from '../mongoose';

export const createNewConversation = async (
  userId_1: string,
  userId_2: string
) => {
  try {
    await connectToDB();
    const user_1 = await User.findById(userId_1);
    const user_2 = await User.findById(userId_2);

    if (!user_1 || !user_2) {
      throw new Error('User not found');
    }
    const newConversation = new Conversation({
      users: [user_1.id, user_2.id],
    });
    await newConversation.save();
    user_1.conversationsIds.push(newConversation.id);
    user_2.conversationsIds.push(newConversation.id);
    await user_1.save();
    await user_2.save();

    return newConversation.id as string;
  } catch (err: any) {
    console.log(err);
    throw new Error(err.messages);
  }
};
