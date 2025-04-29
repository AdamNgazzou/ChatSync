// client/contexts/RoomContext.tsx
import { createContext, useContext, useState } from 'react';

interface Room {
  _id: string;
  name: string;
  image?: string;
  type: string;
}

interface RoomContextType {
  activeRoom: Room | null;
  setActiveRoom: (room: Room | null) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

  return (
    <RoomContext.Provider value={{ activeRoom, setActiveRoom }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}