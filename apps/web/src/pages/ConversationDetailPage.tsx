import { useState, useEffect, useRef, type FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Send, ArrowLeft, Clock, User, AlertTriangle } from "lucide-react";
import clsx from "clsx";
import { format, differenceInHours } from "date-fns";

interface Message {
  id: string;
  direction: string;
  type: string;
  body: string | null;
  status: string;
  sentAt: string;
  createdAt: string;
}

interface ConversationDetail {
  id: string;
  status: string;
  contact: { id: string; name: string; phone: string };
  messages: Message[];
}

export function ConversationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversation = async () => {
    try {
      const data = await api.get<ConversationDetail>(`/conversations/${id}`);
      setConversation(data);
    } catch {
      // failed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversation();
    // Poll for new messages
    const interval = setInterval(loadConversation, 5000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  const lastInbound = conversation?.messages
    .filter((m) => m.direction === "INBOUND")
    .at(-1);

  const isOutsideWindow = lastInbound
    ? differenceInHours(new Date(), new Date(lastInbound.createdAt)) > 24
    : true;

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    setSending(true);
    try {
      await api.post("/messages", {
        contactId: conversation.contact.id,
        type: "TEXT",
        body: newMessage.trim(),
      });
      setNewMessage("");
      await loadConversation();
    } catch {
      // send failed
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 bg-white px-6 py-4">
        <Link
          to="/conversations"
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold">
          {conversation.contact.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">
            {conversation.contact.name}
          </h2>
          <p className="text-xs text-gray-500">{conversation.contact.phone}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {isOutsideWindow && (
            <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5" />
              Outside 24h window
            </div>
          )}
          <Link
            to={`/contacts/${conversation.contact.id}`}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            <User className="mr-1 inline h-3.5 w-3.5" />
            View Contact
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="mx-auto max-w-3xl space-y-3">
          {conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={clsx(
                "flex",
                msg.direction === "OUTBOUND" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={clsx(
                  "max-w-[70%] rounded-2xl px-4 py-2.5",
                  msg.direction === "OUTBOUND"
                    ? "bg-brand-500 text-white"
                    : "bg-white border border-gray-200 text-gray-900",
                )}
              >
                {msg.body && <p className="text-sm">{msg.body}</p>}
                <div
                  className={clsx(
                    "mt-1 flex items-center gap-1 text-[10px]",
                    msg.direction === "OUTBOUND"
                      ? "text-brand-100"
                      : "text-gray-400",
                  )}
                >
                  <Clock className="h-2.5 w-2.5" />
                  {format(new Date(msg.sentAt), "HH:mm")}
                  {msg.direction === "OUTBOUND" && (
                    <span className="ml-1 capitalize">
                      {msg.status.toLowerCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <form
          onSubmit={handleSend}
          className="mx-auto flex max-w-3xl items-center gap-3"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              isOutsideWindow
                ? "Outside session window - use templates only"
                : "Type a message..."
            }
            disabled={isOutsideWindow}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-50 disabled:text-gray-400"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim() || isOutsideWindow}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm hover:bg-brand-600 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
