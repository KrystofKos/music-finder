import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  FaArrowLeftLong,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useChat } from "../api/useChat";
import { getUser } from "../auth/session";
import "./LiveChat.css";

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function LiveChat() {
  const navigate = useNavigate();
  const currentUser = getUser();

  const [conversationsCollapsed, setConversationsCollapsed] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [userName, setUserName] = useState("");
  const messageListRef = useRef<HTMLDivElement | null>(null);

  const { messages: socketMessages, isConnected, sendMessage } = useChat();

  useEffect(() => {
    const stored = localStorage.getItem("chatUserName");
    if (stored) {
      setUserName(stored);
      return;
    }

    const fallbackName =
      currentUser?.username ??
      currentUser?.email ??
      `User_${Math.floor(Math.random() * 10000)}`;
    setUserName(fallbackName);
    localStorage.setItem("chatUserName", fallbackName);
  }, [currentUser?.email, currentUser?.username]);

  const conversation = useMemo(() => {
    const last = socketMessages.at(-1);
    const lastMessage = last?.text ?? "Share tracks, albums, and listening notes.";

    return {
      id: "general",
      name: "General",
      lastMessage,
      unread: 0,
    };
  }, [socketMessages]);

  const activeMessages = useMemo(
    () =>
      socketMessages.map((message, index) => ({
        id: `${message.timestamp}-${index}`,
        content: message.text,
        senderId: message.user,
        createdAt: new Date(message.timestamp).toISOString(),
      })),
    [socketMessages],
  );

  useEffect(() => {
    if (!messageListRef.current) return;
    messageListRef.current.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [activeMessages.length]);

  async function onSendMessage() {
    const trimmed = messageText.trim();
    if (!trimmed || !isConnected) return;
    if (!userName.trim()) return;

    sendMessage(userName.trim(), trimmed);
    setMessageText("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSendMessage();
  }

  function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void onSendMessage();
    }
  }

  return (
    <section
      className={`LiveChat ${
        conversationsCollapsed ? "LiveChatCollapsed" : ""
      }`}
    >
      <aside className="Sidebar">
        <div className="SidebarHeader">
          <h1 className="Title">Live Chat</h1>
        </div>

        <div className="ConversationList">
          <button className="Conversation" type="button">
            <div className="ConversationContent">
              <div className="ConversationInfo">
                <h2 className="ConversationName">{conversation.name}</h2>
                <p className="ConversationLastMessage">
                  {conversation.lastMessage || "No messages yet"}
                </p>
              </div>
            </div>
          </button>
        </div>
      </aside>

      <div className="Chat">
        <header className="ChatHeader">
          <button
            className="ConversationsToggleButton"
            type="button"
            onClick={() => setConversationsCollapsed((current) => !current)}
            aria-label={
              conversationsCollapsed
                ? "Show conversations"
                : "Hide conversations"
            }
            title={
              conversationsCollapsed
                ? "Show conversations"
                : "Hide conversations"
            }
          >
            {conversationsCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>

          <h2 className="ChatTitle">
            {conversation.name}
            {!isConnected ? " (Disconnected)" : ""}
          </h2>

          <button
            className="returnButton"
            type="button"
            onClick={() => navigate("/")}
          >
            <FaArrowLeftLong /> Back
          </button>
        </header>

        <div className="MessageList" ref={messageListRef}>
          {activeMessages.map((message) => {
            const ownMessage = message.senderId === userName;

            return (
              <div
                className={ownMessage ? "MessageRowOwn" : "MessageRow"}
                key={message.id}
              >
                <article className={ownMessage ? "MessageOwn" : "Message"}>
                  <p className="MessageContent">{message.content}</p>
                  <time className="MessageTime" dateTime={message.createdAt}>
                    {formatTime(message.createdAt)}
                  </time>
                </article>
              </div>
            );
          })}
        </div>

        <form className="ChatInput" onSubmit={handleSubmit}>
          <textarea
            className="Textarea"
            placeholder={
              isConnected ? "Type your message..." : "Connecting to chat..."
            }
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            onKeyDown={handleTextareaKeyDown}
            disabled={!isConnected}
          />

          <button
            className="SendButton"
            type="submit"
            disabled={!isConnected || !messageText.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}

export default LiveChat;

