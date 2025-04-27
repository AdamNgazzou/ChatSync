import { useState, useEffect, useRef, useCallback } from "react"

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  receiverId: string
  timestamp: number
}

export function useWebSocket(chatId?: string, currentUserId = "currentUser", currentUserName = "John Doe") {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  let manuallyClosed = false; // Add this flag

  useEffect(() => {
    if (!chatId) return;
  
    const ws = new WebSocket("ws://localhost:3001/chat");
    wsRef.current = ws;
    let isCurrent = true; // Track if this WebSocket instance is the current one
  
    ws.onopen = () => {
      if (!isCurrent) return; // Ignore if this is not the current WebSocket
      setIsConnected(true);
      ws.send(JSON.stringify({ type: "join", roomId: chatId }));
      console.log("Connected to server and joined room", chatId);
    };
  
    ws.onmessage = (event) => {
      if (!isCurrent) return; // Ignore if this is not the current WebSocket
      try {
        const msg = JSON.parse(event.data);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: msg.content,
            senderId: msg.sender || "other",
            senderName: msg.senderName || "Other",
            receiverId: chatId,
            timestamp: Date.now(),
          },
        ]);
        console.log("Received from server:", msg);
      } catch (e) {
        console.error("Invalid message from server", event.data);
      }
    };
  
    ws.onclose = () => {
      if (!isCurrent) return; // Ignore if this is not the current WebSocket
      if (!manuallyClosed) {
        console.log("WebSocket was closed by server or network.");
      } else {
        console.log("WebSocket closed manually by cleanup.");
      }
      setIsConnected(false);
    };
  
    ws.onerror = (err) => {
      if (!isCurrent) return; // Ignore if this is not the current WebSocket
      console.error("WebSocket encountered an error:", err);
      console.error("WebSocket error details:", {
        readyState: ws.readyState,
        url: ws.url,
        time: new Date().toISOString(),
      });
    };
  
    return () => {
      isCurrent = false; // Mark this WebSocket instance as outdated
      manuallyClosed = true; // Set the flag before closing
      if (wsRef.current === ws) {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
        wsRef.current = null;
      }
    };
  }, [chatId]);
  const sendMessage = useCallback(
    (content: string, receiverId: string) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "message",
            content,
            sender: currentUserId,
            senderName: currentUserName,
          })
        )
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content,
            senderId: currentUserId,
            senderName: currentUserName,
            receiverId,
            timestamp: Date.now(),
          },
        ])
      }
    },
    [currentUserId, currentUserName]
  )

  return {
    messages,
    sendMessage,
    isConnected,
  }
}