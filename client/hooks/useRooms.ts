// client/hooks/useRooms.ts
import { useState, useEffect } from 'react';

interface Room {
  _id: string;
  name: string;
  type: string;
  image : string
}

interface RoomWithMeta {
  room: Room;
  unread: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export function useRooms(userId: string) {
  const [rooms, setRooms] = useState<RoomWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial rooms data
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/room/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error);
        
        setRooms(data.rooms);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchRooms();
    }
  }, [userId]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!userId) return;

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/chat`);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Update rooms when receiving a new message
        if (message.type === 'message') {
          setRooms(prevRooms => prevRooms.map(room => {
            if (room.room._id === message.roomId) {
              return {
                ...room,
                lastMessage: message.content,
                lastMessageTime: new Date().toISOString(),
                unread: message.senderId !== userId ? room.unread + 1 : room.unread
              };
            }
            return room;
          }));
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    };

    return () => {
      ws.close();
    };
  }, [userId]);

  const markRoomAsRead = (roomId: string) => {
    setRooms(prevRooms => prevRooms.map(room => {
      if (room.room._id === roomId) {
        return { ...room, unread: 0 };
      }
      return room;
    }));
  };

  return { rooms, isLoading, error, markRoomAsRead };
}