"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare,LogOut, Moon, Sun } from "lucide-react";
import FriendsList from "@/components/friends-list";
import { useMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth, useProtectedRoute } from "@/hooks/use-auth";
import { User } from "@/types/user"; // Import the User type
import Loading from './loading'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const isLoading = useProtectedRoute(); // Get the loading state
  const [showFriends, setShowFriends] = useState(false);
  const isMobile = useMobile();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter()
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };


    useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    }, []);
  if (isLoading) {
    return <Loading/>; 
  }
  return (
    <div className="flex h-screen bg-gradient-to-br from-brand-50 to-brand-100 dark:from-dark-200 dark:to-dark-300">
      {/* Sidebar - FriendsList */}
      <motion.div
        initial={{ x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 }}
        animate={{ x: isMobile && !showFriends ? -300 : 0, opacity: isMobile && !showFriends ? 0 : 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full md:w-80 flex-col glass-panel rounded-r-2xl shadow-glass dark:shadow-glass-dark z-10 absolute md:relative h-full overflow-y-auto"
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/30 flex items-center justify-between">
          <div className="font-semibold text-lg flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mr-2">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            ChatSync
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
            </Button>
          </div>
        </div>

        <FriendsList
          activeChat={null}
          setActiveChat={(friendId) => {
            router.push(`/chat/${friendId}`);
            if (isMobile) setShowFriends(false);
          }}
        />
        <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-700/30">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white dark:border-dark-200">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-white">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">{user?.username}</div>
              <div className="text-xs text-slate-500">{user?.email}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}