"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { Check, CheckCheck } from "lucide-react"

interface ChatMessageProps {
  message: string
  timestamp: string
  isOwn: boolean
  sender?: string
  status?: "sent" | "delivered" | "read"
}

export default function ChatMessage({ message, timestamp, isOwn, sender, status = "read" }: ChatMessageProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`flex ${isOwn ? "flex-row-reverse" : "flex-row"} max-w-[80%] gap-2`}>
        {!isOwn && (
          <div className="flex-shrink-0 pt-1">
            <Avatar className="h-8 w-8 border-2 border-white dark:border-dark-200">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-white text-xs">
                {sender
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        <div>
          {!isOwn && sender && <div className="text-xs text-slate-500 mb-1 ml-1">{sender}</div>}
          <div className="flex flex-col gap-1">
            <div className={`message-bubble ${isOwn ? "message-bubble-own" : "message-bubble-other"} animate-slide-in`}>
              {message}
            </div>
            <div className={`flex items-center text-xs text-slate-500 ${isOwn ? "justify-end" : "justify-start"}`}>
              <span>{timestamp}</span>
              {isOwn && (
                <span className="ml-1">
                  {status === "sent" && <Check className="h-3 w-3" />}
                  {status === "delivered" && <CheckCheck className="h-3 w-3" />}
                  {status === "read" && <CheckCheck className="h-3 w-3 text-brand-500" />}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
