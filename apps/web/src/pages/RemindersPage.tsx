import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Bell, Check, Clock, AlertCircle, Plus, X, Search } from "lucide-react";
import clsx from "clsx";
import { format, isPast } from "date-fns";
import {
  PageTransition,
  motion,
  AnimatePresence,
  staggerContainer,
  staggerItem,
  expandVariants,
} from "@/components/Motion";

interface Reminder {
  id: string;
  note: string;
  dueAt: string;
  completed: boolean;
  contact: { id: string; name: string; phone: string };
}

interface ContactOption {
  id: string;
  name: string;
  phone: string;
}

export function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // New reminder form
  const [showForm, setShowForm] = useState(false);
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("09:00");
  const [submitting, setSubmitting] = useState(false);
  const hasAnimated = useRef(false);
  const isFirstRender = useRef(true);

  const load = async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("filter", filter);
      if (search.trim()) params.set("search", search.trim());
      const qs = params.toString();
      const data = await api.get<Reminder[]>(`/reminders${qs ? `?${qs}` : ""}`);
      setReminders(data);
    } catch {
      // failed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(!hasAnimated.current);
  }, [filter]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timeout = setTimeout(() => load(), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const openForm = async () => {
    try {
      const result = await api.get<{ data: ContactOption[] }>("/contacts?pageSize=100");
      setContacts(result.data);
    } catch {
      // failed
    }
    // Default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDueDate(tomorrow.toISOString().split("T")[0]);
    setDueTime("09:00");
    setNote("");
    setSelectedContactId("");
    setShowForm(true);
  };

  const handleCreate = async () => {
    if (!selectedContactId || !note || !dueDate) return;
    setSubmitting(true);
    try {
      const dueAt = new Date(`${dueDate}T${dueTime}:00`).toISOString();
      await api.post("/reminders", {
        contactId: selectedContactId,
        note,
        dueAt,
      });
      setShowForm(false);
      load();
    } catch {
      // failed
    } finally {
      setSubmitting(false);
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      await api.put(`/reminders/${id}`, { completed: !completed });
      load();
    } catch {
      // failed
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      await api.delete(`/reminders/${id}`);
      load();
    } catch {
      // failed
    }
  };

  return (
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
            <p className="mt-1 text-sm text-gray-500">
              Keep track of follow-ups with your contacts
            </p>
          </div>
          <motion.button
            onClick={openForm}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            whileTap={{ scale: 0.97 }}
          >
            <Plus className="h-4 w-4" />
            New Reminder
          </motion.button>
        </div>

        {/* New reminder form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="mb-6 rounded-xl border border-gray-200 bg-white p-6"
              variants={expandVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">New Reminder</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <select
                    value={selectedContactId}
                    onChange={(e) => setSelectedContactId(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    <option value="">Select a contact...</option>
                    {contacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Note</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder="Follow up about pricing..."
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Time</label>
                    <input
                      type="time"
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={handleCreate}
                    disabled={!selectedContactId || !note || !dueDate || submitting}
                    className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                    whileTap={{ scale: 0.97 }}
                  >
                    {submitting ? "Creating..." : "Create Reminder"}
                  </motion.button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {[
              { key: "all", label: "All" },
              { key: "today", label: "Due Today" },
              { key: "overdue", label: "Overdue" },
              { key: "upcoming", label: "Upcoming" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={clsx(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  filter === f.key
                    ? "bg-brand-500 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reminders..."
              className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          </div>
        ) : reminders.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Bell className="mb-3 h-12 w-12 text-gray-300" />
            <p className="text-sm text-gray-500">No reminders</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {reminders.map((reminder) => {
              const due = new Date(reminder.dueAt);
              const overdue = isPast(due) && !reminder.completed;

              return (
                <div
                  key={reminder.id}
                  className={clsx(
                    "flex items-start gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
                    overdue ? "border-red-200" : "border-gray-200",
                  )}
                >
                  <motion.button
                    onClick={() => toggleComplete(reminder.id, reminder.completed)}
                    className={clsx(
                      "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      reminder.completed
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-gray-300 hover:border-brand-400",
                    )}
                    whileTap={{ scale: 0.85 }}
                  >
                    {reminder.completed && <Check className="h-3 w-3" />}
                  </motion.button>
                  <div className="min-w-0 flex-1">
                    <p
                      className={clsx(
                        "text-sm transition-all",
                        reminder.completed
                          ? "text-gray-400 line-through"
                          : "text-gray-900",
                      )}
                    >
                      {reminder.note}
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      <Link
                        to={`/contacts/${reminder.contact.id}`}
                        className="text-xs text-brand-600 hover:underline"
                      >
                        {reminder.contact.name}
                      </Link>
                      <span
                        className={clsx(
                          "flex items-center gap-1 text-xs",
                          overdue ? "text-red-500" : "text-gray-400",
                        )}
                      >
                        {overdue ? (
                          <AlertCircle className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {format(due, "MMM d, yyyy 'at' HH:mm")}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="rounded-md p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
  );
}
