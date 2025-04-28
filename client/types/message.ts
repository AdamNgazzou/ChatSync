interface Sender {
    _id: string;
    username: string;
  }
  
  export interface Message {
    _id: string;
    roomId: string;
    senderId: Sender;  // For old messages from API
    content: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  // For real-time messages from WebSocket
  export interface WSMessage {
    id: string;
    content: string;
    receiverId: string;
    senderId: string;
    senderName: string
    timestamp: number;
  }
  
  
  export interface PaginatedResponse {
    messages: Message[];
    pagination: {
      hasMore: boolean;
      nextCursor: string | null;
      limit: number;
    };
  }