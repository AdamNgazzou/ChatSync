"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LogOut,
  Send,
  User,
  Users,
  MessageSquare,
  Phone,
  Video,
  ImageIcon,
  Paperclip,
  Smile,
  Mic,
  Moon,
  Sun,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import ChatMessage from "@/components/chat-message"
import { useWebSocket } from "@/hooks/use-websocket"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useInView } from 'react-intersection-observer' 
import { Message,PaginatedResponse, WSMessage } from "@/types/message"
import { useRoom } from "@/context/RoomContext";

export default function ChatPage() {
  const params = useParams();
  const chatId = params?.chatid as string;
  const [message, setMessage] = useState("");
  const [showFriends, setShowFriends] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);
  const { theme, setTheme } = useTheme();

  const [oldMessages, setOldMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [wasAtBottomBeforeNewMessage, setWasAtBottomBeforeNewMessage] = useState(true);
  const isInitialLoad = useRef(true);
  const { activeRoom } = useRoom();
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '200px 0px 0px 0px',
    triggerOnce: false,
    delay: 100
  });
  
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser({
          id: user.id,
          name: user.username,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const { messages, sendMessage, isConnected } = useWebSocket (
    chatId,
    currentUser?.id,
    currentUser?.name
  );
  console.log(messages)

  // Reset old messages and pagination when chatId changes, then fetch first page
  useEffect(() => {
    if (chatId) {
      setOldMessages([]);
      setHasMore(true);
      isInitialLoad.current = true;
      fetchOldMessages(true);
    }
  }, [chatId]);
  
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      fetchOldMessages();
    }
  }, [inView, hasMore, isLoading]);
  // Fetch old messages (pagination)
  const fetchOldMessages = async (isInitial = false) => {
    if (!chatId || isLoading || (!hasMore && !isInitial)) return;
  
    try {
      setIsLoading(true);
      const oldestMessage = oldMessages[0];
      const before = oldestMessage
        ? new Date(oldestMessage.createdAt).getTime()
        : undefined;
  
      const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat/${chatId}?limit=10${
        before ? `&before=${before}` : ""
      }`;
  
      const response = await fetch(url, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) throw new Error("Failed to fetch messages");
  
      const data: PaginatedResponse = await response.json();
      const reversed = data.messages.reverse(); // oldest → newest
  
      setHasMore(data.pagination.hasMore);
  
      setOldMessages(prev => {
        const combined = [...reversed, ...prev];
        const uniqueMessages = Array.from(
          new Map(combined.map(msg => [msg._id, msg])).values()
        );
        return uniqueMessages;
      });
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isInitialLoad.current && oldMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView();
      isInitialLoad.current = false;
    }
  }, [oldMessages]);
  

  useEffect(() => {
    if (!isInitialLoad.current && wasAtBottomBeforeNewMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, wasAtBottomBeforeNewMessage]);
  
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current;
    if (!scrollContainer) return;
  
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      setIsAtBottom(distanceFromBottom < 10);
    };
  
    // Only add scroll listener after initial load
    if (!isInitialLoad.current) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [isInitialLoad.current]);

  useEffect(() => {
    // Save if we were at bottom BEFORE new messages are appended
    setWasAtBottomBeforeNewMessage(isAtBottom);
  }, [messages.length]); // <- before you scroll
  
  useEffect(() => {
    if (wasAtBottomBeforeNewMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && chatId) {
      sendMessage(message, chatId);
      setMessage("");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <div className="flex h-screen bg-gradient-to-br from-brand-50 to-brand-100 dark:from-dark-200 dark:to-dark-300">
      {/* Sidebar - hidden on mobile unless toggled */}
      

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {chatId ? (
          <>
            {/* Chat header */}
            <div className="p-4 glass-panel rounded-b-2xl shadow-glass dark:shadow-glass-dark flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                {isMobile && (
                  <Button variant="ghost" size="icon" onClick={() => setShowFriends(true)}>
                    <Users className="h-5 w-5" />
                  </Button>
                )}
                <Avatar className="h-10 w-10 border-2 border-white dark:border-dark-200">
                  <AvatarImage src={activeRoom?.image || "/placeholder.svg"} />
                  <AvatarFallback>
                    {activeRoom?.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                <div className="font-medium">{activeRoom?.name} hey</div>
                  <div className="text-xs flex items-center">
                    {isConnected ? (
                      <span className="flex items-center text-green-500">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse-subtle"></span>
                        Online
                      </span>
                    ) : (
                      <span className="flex items-center text-slate-500">
                        <span className="w-2 h-2 bg-slate-400 rounded-full mr-1"></span>
                        Offline
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages area */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-1 py-4 flex flex-col">
            <div ref={loadMoreRef} className="h-8" />

            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
              </div>
            )}

              {/* Old messages */}
              <div className="flex flex-col space-y-2">

              {oldMessages.map((msg: Message) => (
                <ChatMessage
                  key={msg._id}
                  message={msg.content}
                  timestamp={new Date(msg.createdAt).toLocaleTimeString([], { 
                    hour: "2-digit", 
                    minute: "2-digit" 
                  })}
                  isOwn={msg.senderId._id === currentUser?.id}
                  sender={msg.senderId._id !== currentUser?.id ? msg.senderId.username : undefined}
                  status={msg.senderId._id === currentUser?.id ? "read" : undefined}
                />
              ))}

              {messages.map((msg : WSMessage) => (
                <ChatMessage
                  key={msg.id}
                  message={msg.content}
                  timestamp={new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: "2-digit", 
                    minute: "2-digit" 
                  })}
                  isOwn={msg.senderId === currentUser?.id}
                  sender={msg.senderId !== currentUser?.id ? msg.senderName : undefined}
                  status={msg.senderId === currentUser?.id ? "read" : undefined}
                />
              ))}
              </div>

              <div ref={messagesEndRef} />
 

              </div>
            </ScrollArea>

            {/* Message input */}
            <div className="p-4">
              <div className="glass-panel rounded-2xl shadow-glass dark:shadow-glass-dark p-2">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="icon" className="rounded-full text-slate-500">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="rounded-full text-slate-500">
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="glass-input flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button type="button" variant="ghost" size="icon" className="rounded-full text-slate-500">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="rounded-full text-slate-500">
                    <Mic className="h-5 w-5" />
                  </Button>
                  <Button
                    type="submit"
                    disabled={!message.trim()}
                    className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col p-4 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-panel rounded-2xl shadow-glass dark:shadow-glass-dark p-8 max-w-md"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <MessageSquare className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Welcome to ChatSync</h3>
              <p className="text-slate-500 mb-6">
                Choose a contact from the sidebar to start chatting or add a new contact to begin a conversation.
              </p>
              {isMobile && (
                <Button
                  className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white"
                  onClick={() => setShowFriends(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Contacts
                </Button>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
