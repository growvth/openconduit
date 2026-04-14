import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { MessageSquare, Users, Bell, BarChart3, TrendingUp, PieChart, ArrowRight } from "lucide-react";
import { PageTransition, motion, staggerContainer, staggerItem } from "@/components/Motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart as RePieChart, Pie, Cell, Legend
} from "recharts";
import { formatDistanceToNow } from "date-fns";

interface DashboardData {
  stats: {
    openConversations: number;
    totalContacts: number;
    remindersDueToday: number;
  };
  pipeline: { name: string; value: number }[];
  tags: { name: string; value: number }[];
  messageVolume: { name: string; inbound: number; outbound: number }[];
  recentConversations: {
    id: string;
    contactName: string;
    phone: string;
    lastMessage: string;
    time: string;
  }[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await api.get<DashboardData>("/dashboard");
        setData(response);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
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
      value: data?.stats.openConversations ?? 0,
      icon: MessageSquare,
      color: "text-blue-600 bg-blue-50",
      link: "/conversations",
    },
    {
      label: "Total Contacts",
      value: data?.stats.totalContacts ?? 0,
      icon: Users,
      color: "text-green-600 bg-green-50",
      link: "/contacts",
    },
    {
      label: "Reminders Due Today",
      value: data?.stats.remindersDueToday ?? 0,
      icon: Bell,
      color: "text-amber-600 bg-amber-50",
      link: "/reminders",
    },
  ];

  return (
    <PageTransition>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time insights into your WhatsApp CRM
          </p>
        </div>

        {/* Top Stats */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {statCards.map((card) => (
            <motion.div key={card.label} variants={staggerItem}>
              <Link
                to={card.link}
                className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1"
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
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Message Volume Area Chart - Spans 2 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-500" />
                <h3 className="font-semibold text-gray-900">Message Volume</h3>
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Last 7 Days</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.messageVolume}>
                  <defs>
                    <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="inbound" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorInbound)" 
                    name="Inbound"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="outbound" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorOutbound)" 
                    name="Outbound"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Activity Feed */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-brand-500" />
                <h3 className="font-semibold text-gray-900">Active Chats</h3>
              </div>
              <Link to="/conversations" className="text-xs font-semibold text-brand-600 hover:text-brand-700">View All</Link>
            </div>
            <div className="flex-1 space-y-4 overflow-hidden">
              {data?.recentConversations.map((chat) => (
                <Link 
                  key={chat.id} 
                  to={`/conversations?id=${chat.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
                    {chat.contactName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{chat.contactName}</p>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">
                        {formatDistanceToNow(new Date(chat.time), { addSuffix: true }).replace('about ', '')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                  </div>
                </Link>
              ))}
              {data?.recentConversations.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <p className="text-sm text-gray-400">No active conversations</p>
                </div>
              )}
            </div>
            <Link 
              to="/contacts" 
              className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-brand-50 hover:text-brand-600 transition-all"
            >
              Start New Chat <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Pipeline Funnel Bar Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-brand-500" />
                <h3 className="font-semibold text-gray-900">Pipeline Funnel</h3>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.pipeline} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#4b5563", fontWeight: 500 }}
                  />
                  <Tooltip 
                    cursor={{ fill: "#f9fafb" }}
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32} name="Contacts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Tag Distribution Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-brand-500" />
                <h3 className="font-semibold text-gray-900">Top Tags</h3>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={data?.tags}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data?.tags.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
