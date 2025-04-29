"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRooms } from "@/hooks/useRooms"
import { useRoom } from "@/context/RoomContext";

interface FriendsListProps {
  activeChat: string | null
  setActiveChat: (id: string) => void
}


// Mock data for friends
const friends = [
  {
    id: "680e7e324c5a7d23e22c9c94",
    name: "Alice Cooper",
    status: "online",
    lastMessage: "Looking forward to it!",
    time: "10:37 AM",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Bob Johnson",
    status: "online",
    lastMessage: "Can you send me that file?",
    time: "9:41 AM",
    unread: 2,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Carol Williams",
    status: "offline",
    lastMessage: "Thanks for your help!",
    time: "Yesterday",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Dave Brown",
    status: "online",
    lastMessage: "Let's meet tomorrow",
    time: "Yesterday",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Eve Davis",
    status: "offline",
    lastMessage: "The project is done",
    time: "Monday",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "Frank Miller",
    status: "online",
    lastMessage: "Did you see the news?",
    time: "Monday",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "7",
    name: "Grace Lee",
    status: "offline",
    lastMessage: "Happy birthday!",
    time: "Sunday",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "8",
    name: "Henry Wilson",
    status: "online",
    lastMessage: "I'll call you later",
    time: "Last week",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function FriendsList({ activeChat, setActiveChat }: FriendsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const { rooms, isLoading, error } = useRooms(currentUser.id);
  const { setActiveRoom } = useRoom();

  const filteredRooms = rooms.filter((room) => 
    room.room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 48 * 60 * 60 * 1000) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };
  const handleRoomClick = (roomData: any) => {
    // Set the active room in context
    setActiveRoom({
      _id: roomData.room._id,
      name: roomData.room.name,
      image: roomData.room.image,
      type: roomData.room.type
    });
    // Navigate to the chat
    setActiveChat(roomData.room._id);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-4 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contacts..."
            className="glass-input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full w-full">
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : (
            <div className="p-2 space-y-1 h-full overflow-y-auto">
              {filteredRooms.map((roomData, index) => (
                <motion.button
                  key={roomData.room._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`w-full text-left transition-all duration-200 ${
                    activeChat === roomData.room._id ? "sidebar-item sidebar-item-active" : "sidebar-item"
                  }`}
                  onClick={() => handleRoomClick(roomData)}
                  >
                  
                  <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white dark:border-dark-200">
                    <AvatarImage 
                      src={roomData.room.image || "/placeholder.svg?height=40&width=40"} 
                      alt={roomData.room.name} 
                    />
                    <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-white">
                      {roomData.room.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <div className="font-medium truncate">{roomData.room.name}</div>
                      <div className="text-xs text-slate-500">
                        {formatTime(roomData.lastMessageTime || "")}
                      </div>
                    </div>
                    <div className="flex justify-between items-baseline mt-1">
                      <div className="text-sm text-slate-500 truncate">
                        {roomData.lastMessage || "No messages yet"}
                      </div>
                      {roomData.unread > 0 && (
                        <div className="ml-2 bg-brand-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {roomData.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}