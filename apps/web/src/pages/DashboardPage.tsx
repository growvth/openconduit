import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { MessageSquare, Users, Bell, Clock } from "lucide-react";

interface DashboardStats {
  openConversations: number;
  newContactsThisWeek: number;
  remindersDueToday: number;
  recentMessages: {
    id: string;
    body: string | null;
    direction: string;
    createdAt: string;
    conversation: { contact: { name: string; id: string } };
  }[];
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [conversations, contacts, reminders] = await Promise.all([
          api.get<{ total: number }>("/conversations?status=OPEN&pageSize=1"),
          api.get<{ total: number }>("/contacts?pageSize=1"),
          api.get<unknown[]>("/reminders?filter=today"),
        ]);

        setStats({
          openConversations: conversations.total,
          newContactsThisWeek: contacts.total,
          remindersDueToday: Array.isArray(reminders) ? reminders.length : 0,
          recentMessages: [],
        });
      } catch {
        // Stats failed to load
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Open Conversations",
      value: stats?.openConversations ?? 0,
      icon: MessageSquare,
      color: "text-blue-600 bg-blue-50",
      link: "/conversations",
    },
    {
      label: "Total Contacts",
      value: stats?.newContactsThisWeek ?? 0,
      icon: Users,
      color: "text-green-600 bg-green-50",
      link: "/contacts",
    },
    {
      label: "Reminders Due Today",
      value: stats?.remindersDueToday ?? 0,
      icon: Bell,
      color: "text-amber-600 bg-amber-50",
      link: "/reminders",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your WhatsApp CRM activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
              >
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/contacts"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Users className="h-4 w-4" />
            View Contacts
          </Link>
          <Link
            to="/conversations"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <MessageSquare className="h-4 w-4" />
            Open Conversations
          </Link>
          <Link
            to="/reminders"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Clock className="h-4 w-4" />
            Manage Reminders
          </Link>
        </div>
      </div>
    </div>
  );
}
