'use server';
import { createClient_server } from '../supabase/server';
import { getLoggedInUser } from './login.actions';
import { translate } from './translate.actions';
import { TargetLanguageCode } from 'deepl-node';

export const createOrGetConversation = async (userId2: string) => {
  try {
    const supabase = await createClient_server();
    const user = await getLoggedInUser();
    const userId1 = user.id;
    const { data, error } = await supabase
      .from('conversations')
      .select('id')
      .contains('user_ids', [userId1, userId2]);

    if (error) throw new Error(error.message);

    if (data.length > 0) return data[0].id;

    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert([{ user_ids: [userId1, userId2] }])
      .select('id')
      .single();

    if (conversationError || !conversation)
      throw new Error(
        conversationError?.message || 'Error creating conversation'
      );

    return conversation.id;
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};

interface Message {
  conversation_id: string;
  message: string;
  language: string;
  friend_id: string;
}
export const sendMessage = async ({
  conversation_id,
  language,
  message,
  friend_id,
}: Message) => {
  try {
    const supabase = await createClient_server();
    const user = await getLoggedInUser();

    const { data: friend, error: friendError } = await supabase
      .from('friendships')
      .select('*')
      .or(
        `user_id.eq.${user.id},friend_id.eq.${friend_id},or(friend_id.eq.${user.id},user_id.eq.${friend_id})`
      )
      .eq('status', 'accepted');

    if (friendError) throw new Error('Error sending message');
    if (!friend || !friend.length)
      throw new Error(
        'Friendship not found. This may be because the user has been removed from your friends list.'
      );

    const { data, error } = await supabase
      .from('messages')
      .insert([{ conversation_id, sender_id: user.id, message, language }])
      .select('id');
    if (error) throw new Error(error.message);

    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .update({ messages: data[0].id })
      .eq('id', conversation_id)
      .select();

    if (conversationError || !conversation)
      throw new Error('Error sending message');

    return data;
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};

export const getConversationMessages = async (conversationId: string) => {
  try {
    const supabase = await createClient_server();
    const user = await getLoggedInUser();
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId);
    if (error) throw new Error(error.message);

    for (const message of data) {
      message.message = await translate(
        message.message,
        user.native_language.language as TargetLanguageCode
      );
    }

    return data;
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};
