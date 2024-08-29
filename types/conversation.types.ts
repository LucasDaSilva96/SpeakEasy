import { MessageType } from './message.types';

export interface Conversation {
  conversation_id: string;
  messages: MessageType[];
  friend_id: string;
  friend_name: string;
  friend_profile_image: string;
}
