import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  FaArrowLeftLong,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/http";
import { getUser } from "../auth/session";
import { useLanguage } from "../i18n/LanguageContext";
import "./LiveChat.css";

type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
};

type Message = {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  createdAt: string;
};

type BackendConversation = Partial<Conversation> & {
  _id?: string;
};

type BackendMessage = Partial<Message> & {
  _id?: string;
};

const READ_RECEIPTS_KEY = "mf_live_chat_read_receipts";

function getReadReceipts() {
  const raw = localStorage.getItem(READ_RECEIPTS_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function saveReadReceipts(receipts: Record<string, string>) {
  localStorage.setItem(READ_RECEIPTS_KEY, JSON.stringify(receipts));
}

function applyReadReceipts(
  conversations: Conversation[],
  receipts: Record<string, string>,
) {
  return conversations.map((conversation) =>
    receipts[conversation.id] === conversation.lastMessage
      ? { ...conversation, unread: 0 }
      : conversation,
  );
}

function normalizeConversation(
  item: BackendConversation,
  fallbackName: string,
): Conversation {
  return {
    id: String(item.id ?? item._id ?? crypto.randomUUID()),
    name: item.name ?? fallbackName,
    lastMessage: item.lastMessage ?? "",
    unread: item.unread ?? 0,
  };
}

function normalizeMessage(
  item: BackendMessage,
  conversationId: string,
): Message {
  return {
    id: String(item.id ?? item._id ?? crypto.randomUUID()),
    conversationId: item.conversationId ?? conversationId,
    content: item.content ?? "",
    senderId: item.senderId ?? "unknown",
    createdAt: item.createdAt ?? new Date().toISOString(),
  };
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

const LiveChat = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const currentUser = getUser();
  const currentUserId = currentUser?._id ?? "guest";
  const currentUserName =
    currentUser?.username ?? currentUser?.email ?? t("common.guest");

  const fallbackConversations = useMemo<Conversation[]>(
    () => [
      {
        id: "general",
        name: t("liveChat.general"),
        lastMessage: t("liveChat.generalLastMessage"),
        unread: 2,
      },
      {
        id: "discoveries",
        name: t("liveChat.discoveries"),
        lastMessage: t("liveChat.discoveriesLastMessage"),
        unread: 0,
      },
      {
        id: "support",
        name: t("liveChat.support"),
        lastMessage: t("liveChat.supportLastMessage"),
        unread: 1,
      },
    ],
    [t],
  );

  const fallbackMessages = useMemo<Record<string, Message[]>>(
    () => ({
      general: [
        {
          id: "general-1",
          conversationId: "general",
          content: t("liveChat.welcome"),
          senderId: "system",
          createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
        },
        {
          id: "general-2",
          conversationId: "general",
          content: t("liveChat.recommendation"),
          senderId: "system",
          createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        },
      ],
      discoveries: [
        {
          id: "discoveries-1",
          conversationId: "discoveries",
          content: t("liveChat.readyForFinds"),
          senderId: "system",
          createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        },
      ],
      support: [
        {
          id: "support-1",
          conversationId: "support",
          content: t("liveChat.supportHelp"),
          senderId: "system",
          createdAt: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
        },
      ],
    }),
    [t],
  );

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [messageText, setMessageText] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [conversationsCollapsed, setConversationsCollapsed] = useState(false);
  const [readReceipts, setReadReceipts] = useState<Record<string, string>>(() =>
    getReadReceipts(),
  );

  const messageListRef = useRef<HTMLDivElement | null>(null);

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === selectedConversationId,
      ) ?? conversations[0],
    [conversations, selectedConversationId],
  );

  const activeMessages = selectedConversation
    ? (messages[selectedConversation.id] ?? [])
    : [];

  useEffect(() => {
    const controller = new AbortController();
    const storedReadReceipts = getReadReceipts();

    async function loadConversations() {
      try {
        setLoadingConversations(true);
        const result = await apiFetch<BackendConversation[]>(
          "/live-chat/conversations",
          { signal: controller.signal },
        );
        const normalized = result.map((conversation) =>
          normalizeConversation(conversation, t("liveChat.conversation")),
        );
        const firstConversationId = normalized[0]?.id ?? "";
        const nextReceipts =
          firstConversationId && normalized[0]
            ? {
                ...storedReadReceipts,
                [firstConversationId]: normalized[0].lastMessage,
              }
            : storedReadReceipts;

        setReadReceipts(nextReceipts);
        saveReadReceipts(nextReceipts);
        setConversations(
          applyReadReceipts(
            normalized.map((conversation) =>
              conversation.id === firstConversationId
                ? { ...conversation, unread: 0 }
                : conversation,
            ),
            nextReceipts,
          ),
        );
        setSelectedConversationId(firstConversationId);
      } catch {
        const firstConversationId = fallbackConversations[0]?.id ?? "";
        const nextReceipts =
          firstConversationId && fallbackConversations[0]
            ? {
                ...storedReadReceipts,
                [firstConversationId]: fallbackConversations[0].lastMessage,
              }
            : storedReadReceipts;

        setReadReceipts(nextReceipts);
        saveReadReceipts(nextReceipts);
        setConversations(
          applyReadReceipts(
            fallbackConversations.map((conversation) =>
              conversation.id === firstConversationId
                ? { ...conversation, unread: 0 }
                : conversation,
            ),
            nextReceipts,
          ),
        );
        setMessages(fallbackMessages);
        setSelectedConversationId(firstConversationId);
      } finally {
        setLoadingConversations(false);
      }
    }

    loadConversations();

    return () => controller.abort();
  }, [fallbackConversations, fallbackMessages, t]);

  function markConversationAsRead(conversationId: string) {
    const conversation = conversations.find(
      (item) => item.id === conversationId,
    );
    const nextReceipts = {
      ...readReceipts,
      [conversationId]: conversation?.lastMessage ?? "",
    };

    setReadReceipts(nextReceipts);
    saveReadReceipts(nextReceipts);
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, unread: 0 }
          : conversation,
      ),
    );
  }

  useEffect(() => {
    if (!selectedConversation || messages[selectedConversation.id]) return;

    const controller = new AbortController();

    async function loadMessages() {
      try {
        setLoadingMessages(true);
        const result = await apiFetch<BackendMessage[]>(
          `/live-chat/conversations/${selectedConversation.id}/messages`,
          { signal: controller.signal },
        );

        setMessages((current) => ({
          ...current,
          [selectedConversation.id]: result.map((message) =>
            normalizeMessage(message, selectedConversation.id),
          ),
        }));
      } catch {
        setMessages((current) => ({
          ...current,
          [selectedConversation.id]:
            fallbackMessages[selectedConversation.id] ?? [],
        }));
      } finally {
        setLoadingMessages(false);
      }
    }

    loadMessages();

    return () => controller.abort();
  }, [fallbackMessages, messages, selectedConversation]);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [activeMessages.length, selectedConversationId]);

  async function sendMessage() {
    const trimmed = messageText.trim();
    if (!trimmed || !selectedConversation || sending) return;

    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      conversationId: selectedConversation.id,
      content: trimmed,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
    };

    setMessageText("");
    setSending(true);
    setReadReceipts((current) => {
      const nextReceipts = {
        ...current,
        [selectedConversation.id]: trimmed,
      };

      saveReadReceipts(nextReceipts);
      return nextReceipts;
    });
    setMessages((current) => ({
      ...current,
      [selectedConversation.id]: [
        ...(current[selectedConversation.id] ?? []),
        optimisticMessage,
      ],
    }));
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversation.id
          ? { ...conversation, lastMessage: trimmed, unread: 0 }
          : conversation,
      ),
    );

    try {
      const savedMessage = await apiFetch<BackendMessage>(
        `/live-chat/conversations/${selectedConversation.id}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            content: trimmed,
            senderId: currentUserId,
            senderName: currentUserName,
          }),
        },
      );

      setMessages((current) => ({
        ...current,
        [selectedConversation.id]: (current[selectedConversation.id] ?? []).map(
          (message) =>
            message.id === optimisticMessage.id
              ? normalizeMessage(savedMessage, selectedConversation.id)
              : message,
        ),
      }));
    } catch {
      setMessages((current) => ({
        ...current,
        [selectedConversation.id]: (current[selectedConversation.id] ?? []).map(
          (message) =>
            message.id === optimisticMessage.id
              ? { ...message, id: `${message.id}-local` }
              : message,
        ),
      }));
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
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
          <h1 className="Title">{t("liveChat.title")}</h1>
        </div>

        <div className="ConversationList">
          {loadingConversations ? (
            <button className="Conversation" type="button" disabled>
              <div className="ConversationContent">
                <div className="ConversationInfo">
                  <h2 className="ConversationName">
                    {t("liveChat.loadingChats")}
                  </h2>
                </div>
              </div>
            </button>
          ) : null}

          {conversations.map((conversation) => (
            <button
              className="Conversation"
              type="button"
              key={conversation.id}
              onClick={() => {
                setSelectedConversationId(conversation.id);
                markConversationAsRead(conversation.id);
              }}
            >
              <div className="ConversationContent">
                <div className="ConversationInfo">
                  <h2 className="ConversationName">{conversation.name}</h2>
                  <p className="ConversationLastMessage">
                    {conversation.lastMessage || t("liveChat.noMessages")}
                  </p>
                </div>

                {conversation.unread > 0 ? (
                  <span className="ConversationUnread">
                    {conversation.unread}
                  </span>
                ) : null}
              </div>
            </button>
          ))}
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
                ? t("liveChat.showConversations")
                : t("liveChat.hideConversations")
            }
            title={
              conversationsCollapsed
                ? t("liveChat.showConversations")
                : t("liveChat.hideConversations")
            }
          >
            {conversationsCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>

          <h2 className="ChatTitle">
            {selectedConversation?.name ?? t("liveChat.selectChat")}
          </h2>

          <button
            className="returnButton"
            type="button"
            onClick={() => navigate("/")}
          >
            <FaArrowLeftLong /> {t("common.back")}
          </button>
        </header>

        <div className="MessageList" ref={messageListRef}>
          {loadingMessages ? (
            <p className="MessageContent">{t("common.loading")}</p>
          ) : null}

          {activeMessages.map((message) => {
            const ownMessage = message.senderId === currentUserId;

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
              selectedConversation
                ? t("liveChat.typeMessage")
                : t("liveChat.selectChatFirst")
            }
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            onKeyDown={handleTextareaKeyDown}
            disabled={!selectedConversation || sending}
          />

          <button
            className="SendButton"
            type="submit"
            disabled={!messageText.trim() || !selectedConversation || sending}
          >
            {sending ? t("liveChat.sending") : t("liveChat.send")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default LiveChat;
