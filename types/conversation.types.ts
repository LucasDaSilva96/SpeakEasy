import { MessageType } from './message.types';

export interface Conversation {
  conversation_id: string;
  messages: MessageType[];
  friend_id: string;
}
