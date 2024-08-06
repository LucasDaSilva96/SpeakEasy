export interface MessageType {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}
