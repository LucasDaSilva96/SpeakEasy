import { MessageType } from './message.types';

export interface Conversation {
  conversation_id: string;
  messages: MessageType[];
  friend_id: string;
  friend_name: string;
  friend_profile_image: string;
}

export interface ConversationTypeDB {
  id: string;
  created_at: string;
  user_ids: string[];
  user_deleted_con_id: string;
}
