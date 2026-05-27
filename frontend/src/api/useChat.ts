import { useCallback, useEffect, useState } from "react";
import io, { type Socket } from "socket.io-client";

export type ChatMessage = {
  user: string;
  text: string;
  timestamp: number;
};

function getBackendUrl() {
  const envUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;
  if (envUrl) return envUrl;
  return "http://localhost:3000";
}

const SOCKET_URL = getBackendUrl();

export function useChat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));

    newSocket.on("chatHistory", (history: ChatMessage[]) => {
      setMessages(history);
    });

    newSocket.on("newMessage", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = useCallback(
    (user: string, text: string) => {
      if (!socket || !isConnected) return;
      socket.emit("sendMessage", { user, text });
    },
    [socket, isConnected],
  );

  return { socket, messages, isConnected, sendMessage };
}

