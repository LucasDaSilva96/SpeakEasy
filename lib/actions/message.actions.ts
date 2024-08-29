'use server';
import { MessageType } from '@/types/message.types';
import { createClient_server } from '../supabase/server';
import { getLoggedInUser } from './login.actions';
import { translate } from './translate.actions';
import { TargetLanguageCode } from 'deepl-node';
import { Conversation } from '@/types/conversation.types';

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
      .contains('users', [user.id, friend_id])
      .eq('status', 'accepted');

    if (friendError) throw new Error(friendError.message);
    if (!friend || !friend.length)
      throw new Error(
        'Friendship not found. This may be because the user has been removed from your friends list.'
      );

    const { data, error } = await supabase
      .from('messages')
      .insert([{ conversation_id, sender_id: user.id, message, language }])
      .select();
    if (error) throw new Error(error.message);

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

export const getDashboardConversations = async () => {
  try {
    const supabase = await createClient_server();
    const user = await getLoggedInUser();
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .contains('user_ids', [user.id]);

    if (error) throw new Error(error.message);
    if (!conversations) return [];

    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversations[0].id);

    if (messagesError) throw new Error(messagesError.message);
    if (!messages) return [];

    const conversationsData = conversations.map((conversation) => {
      return {
        conversation_id: conversation.id,
        messages: messages.map((message) => {
          if (message.conversation_id === conversation.id) {
            return message;
          }
        }),
        friend_id: conversation.user_ids.find((id: string) => id !== user.id),
      };
    });

    return conversationsData as Conversation[];
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};
