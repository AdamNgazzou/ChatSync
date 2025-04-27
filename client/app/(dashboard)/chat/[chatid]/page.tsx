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
import FriendsList from "@/components/friends-list"
import { useWebSocket } from "@/hooks/use-websocket"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export default function ChatPage() {
  const params = useParams();
  const chatId = params?.chatid as string
  const [message, setMessage] = useState("")
  const [showFriends, setShowFriends] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const isMobile = useMobile()
  const { messages, sendMessage, isConnected } = useWebSocket(chatId)
  const [mounted, setMounted] = useState(false)


  const { theme, setTheme } = useTheme()
  useEffect(() => {
    setMounted(true)
  }, [])
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (message.trim() && chatId) {
      sendMessage(message, chatId)
      setMessage("")
    }
  }

  const handleLogout = () => {
    // In a real app, you would call your logout API here
    router.push("/login")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-brand-50 to-brand-100 dark:from-dark-200 dark:to-dark-300">
      {/* Sidebar - hidden on mobile unless toggled */}
      <motion.div
        initial={{ x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 }}
        animate={{ x: isMobile && !showFriends ? -300 : 0, opacity: isMobile && !showFriends ? 0 : 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full md:w-80 flex-col glass-panel rounded-r-2xl shadow-glass dark:shadow-glass-dark z-10 absolute md:relative h-full overflow-y-auto"
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/30 flex items-center justify-between  ">
          <div className="font-semibold text-lg flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mr-2">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            ChatSync
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowFriends(false)} className="md:hidden">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
            </Button>
          </div>
        </div>

        <FriendsList
          activeChat={chatId}
          setActiveChat={(friendId) => {
            router.push(`/chat/${friendId}`)
            if (isMobile) setShowFriends(false)
          }}
        />

        <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-700/30">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white dark:border-dark-200">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-white">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">John Doe</div>
              <div className="text-xs text-slate-500">john.doe@example.com</div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>

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
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-white">
                    AC
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Alice Cooper</div>
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
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-1 py-4">
                <ChatMessage
                  message="Hey there! How's it going?"
                  timestamp="10:30 AM"
                  isOwn={false}
                  sender="Alice Cooper"
                  status="read"
                />
                <ChatMessage
                  message="Hi Alice! I'm doing well, thanks for asking. How about you?"
                  timestamp="10:32 AM"
                  isOwn={true}
                  status="read"
                />
                <ChatMessage
                  message="I'm great! Just wanted to check in. Do you have time to catch up later today?"
                  timestamp="10:33 AM"
                  isOwn={false}
                  sender="Alice Cooper"
                  status="read"
                />
                <ChatMessage
                  message="I'm free after 5 PM. Would that work for you?"
                  timestamp="10:35 AM"
                  isOwn={true}
                  status="read"
                />
                <ChatMessage
                  message="Perfect! Let's plan for 5:30 PM then. I'll send you a calendar invite."
                  timestamp="10:36 AM"
                  isOwn={false}
                  sender="Alice Cooper"
                  status="read"
                />
                <ChatMessage
                  message="Sounds good! Looking forward to it."
                  timestamp="10:37 AM"
                  isOwn={true}
                  status="read"
                />

                {/* Render actual messages from WebSocket */}
                {messages.map((msg, index) => (
                  <ChatMessage
                    key={index}
                    message={msg.content}
                    timestamp={new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    isOwn={msg.senderId === "currentUser"}
                    sender={msg.senderId !== "currentUser" ? msg.senderName : undefined}
                    status={msg.senderId === "currentUser" ? "read" : undefined}
                  />
                ))}

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
