"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface FriendsListProps {
  activeChat: string | null
  setActiveChat: (id: string) => void
}

// Mock data for friends
const friends = [
  {
    id: "1",
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
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const filteredFriends = friends.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))

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
          <div className="p-2 space-y-1 h-full overflow-y-auto">
            {filteredFriends.map((friend, index) => (
              <motion.button
                key={friend.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`w-full text-left transition-all duration-200 ${
                  activeChat === friend.id ? "sidebar-item sidebar-item-active" : "sidebar-item"
                }`}
                onClick={() => {
                  setActiveChat(friend.id)
                }}
              >
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-white dark:border-dark-200">
                  <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-white">
                    {friend.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {friend.status === "online" && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-dark-200 rounded-full animate-pulse-subtle"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <div className="font-medium truncate">{friend.name}</div>
                  <div className="text-xs text-slate-500">{friend.time}</div>
                </div>
                <div className="flex justify-between items-baseline mt-1">
                  <div className="text-sm text-slate-500 truncate">{friend.lastMessage}</div>
                  {friend.unread > 0 && (
                    <div className="ml-2 bg-brand-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {friend.unread}
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </ScrollArea>
    </div>
  </div>
)
}