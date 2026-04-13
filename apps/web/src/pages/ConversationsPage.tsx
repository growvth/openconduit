import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { MessageSquare, Clock } from "lucide-react";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { PageTransition, motion, staggerContainer, staggerItem } from "@/components/Motion";

interface Conversation {
  id: string;
  status: string;
  updatedAt: string;
  contact: { id: string; name: string; phone: string };
  assignedTo: { id: string; name: string } | null;
  messages: { body: string | null; direction: string; createdAt: string }[];
}

const statusColors: Record<string, string> = {
  OPEN: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  RESOLVED: "bg-gray-100 text-gray-600",
};

export function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const hasAnimated = useRef(false);

  useEffect(() => {
    async function load() {
      if (!hasAnimated.current) setLoading(true);
      try {
        const params = new URLSearchParams({ pageSize: "50" });
        if (statusFilter) params.set("status", statusFilter);
        const res = await api.get<{ data: Conversation[] }>(
          `/conversations?${params}`,
        );
        setConversations(res.data);
      } catch {
        // failed
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [statusFilter]);

  return (
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your WhatsApp conversations
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-2">
          {["", "OPEN", "PENDING", "RESOLVED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={clsx(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                statusFilter === status
                  ? "bg-brand-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50",
              )}
            >
              {status || "All"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          </div>
        ) : conversations.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <MessageSquare className="mb-3 h-12 w-12 text-gray-300" />
            <p className="text-sm text-gray-500">No conversations yet</p>
            <p className="mt-1 text-xs text-gray-400">
              Conversations will appear here when messages are received
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => {
              const lastMessage = conv.messages[0];
              return (
                <div key={conv.id}>
                  <Link
                    to={`/conversations/${conv.id}`}
                    className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold text-sm">
                      {conv.contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {conv.contact.name}
                        </span>
                        <span
                          className={clsx(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            statusColors[conv.status],
                          )}
                        >
                          {conv.status}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-gray-500">
                        {lastMessage?.body || "No messages"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(conv.updatedAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
  );
}
