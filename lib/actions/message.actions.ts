'use server';
import { createClient_server } from '../supabase/server';
import { getLoggedInUser } from './login.actions';

export const createOrGetConversation = async (userId2: string) => {
  try {
    const supabase = await createClient_server();
    const user = await getLoggedInUser();
    const userId1 = user.id;
    const { data, error } = await supabase
      .from('conversations')
      .select('id')
      .contains('users_id', [userId1, userId2]);

    if (error) throw new Error(error.message);

    if (data.length > 0) return data[0].id;

    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert([{ users_id: [userId1, userId2] }])
      .select('id')
      .single();

    if (conversationError || !conversation)
      throw new Error(
        conversationError?.message || 'Error creating conversation'
      );

    return conversation;
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};
