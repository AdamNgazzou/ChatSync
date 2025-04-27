"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { useState } from "react";
export default function ChatPage() {
  const isMobile = useMobile();
  const [showFriends, setShowFriends] = useState(false);

  return (
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
  );
}