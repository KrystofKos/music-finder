import { useEffect, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";

interface Message {
  user: string;
  text: string;
  timestamp: number;
}

// Получить URL бэкенда из переменной окружения или IP адреса
const getBackendUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  // Fallback: если окружение не установлено, используем localhost
  return "http://localhost:3000";
};

const SOCKET_URL = getBackendUrl();

export const useChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("Connected to chat server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from chat server");
      setIsConnected(false);
    });

    newSocket.on("chatHistory", (history: Message[]) => {
      console.log("Received chat history:", history);
      setMessages(history);
    });

    newSocket.on("newMessage", (message: Message) => {
      console.log("New message:", message);
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = useCallback(
    (user: string, text: string) => {
      if (socket && isConnected) {
        socket.emit("sendMessage", { user, text });
      }
    },
    [socket, isConnected],
  );

  return {
    socket,
    messages,
    isConnected,
    sendMessage,
  };
};
