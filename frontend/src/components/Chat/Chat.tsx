import { useEffect, useState, useRef } from "react";
import type { FormEvent } from "react";
import { useChat } from "../../api/useChat";
import "./Chat.css";

const Chat = () => {
  const { messages, isConnected, sendMessage } = useChat();
  const [messageText, setMessageText] = useState("");
  const [userName, setUserName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get username from localStorage or set a default
    const stored = localStorage.getItem("chatUserName");
    if (stored) {
      setUserName(stored);
    } else {
      const defaultName = `User_${Math.floor(Math.random() * 10000)}`;
      setUserName(defaultName);
      localStorage.setItem("chatUserName", defaultName);
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && userName && isConnected) {
      sendMessage(userName, messageText);
      setMessageText("");
    }
  };

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setUserName(newName);
    localStorage.setItem("chatUserName", newName);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Live Chat</h2>
        <div className="connection-status">
          <span
            className={`status-dot ${isConnected ? "connected" : "disconnected"}`}
          ></span>
          <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      <div className="chat-user-setup">
        <input
          type="text"
          value={userName}
          onChange={handleUserNameChange}
          placeholder="Enter your name"
          className="user-name-input"
        />
      </div>

      <div className="messages-list">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="message-item">
              <div className="message-header">
                <span className="message-user">{msg.user}</span>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="message-text">{msg.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
          disabled={!isConnected}
        />
        <button type="submit" disabled={!isConnected || !messageText.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
