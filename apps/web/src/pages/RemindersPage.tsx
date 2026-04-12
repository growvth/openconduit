import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Bell, Check, Clock, AlertCircle } from "lucide-react";
import clsx from "clsx";
import { format, isPast, isToday } from "date-fns";

interface Reminder {
  id: string;
  note: string;
  dueAt: string;
  completed: boolean;
  contact: { id: string; name: string; phone: string };
}

export function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("today");

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get<Reminder[]>(`/reminders?filter=${filter}`);
      setReminders(data);
    } catch {
      // failed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      await api.put(`/reminders/${id}`, { completed: !completed });
      load();
    } catch {
      // failed
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Keep track of follow-ups with your contacts
        </p>
      </div>

      <div className="mb-4 flex gap-2">
        {[
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

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      ) : reminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16">
          <Bell className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-sm text-gray-500">No reminders</p>
        </div>
      ) : (
        <div className="space-y-2">
          {reminders.map((reminder) => {
            const due = new Date(reminder.dueAt);
            const overdue = isPast(due) && !reminder.completed;

            return (
              <div
                key={reminder.id}
                className={clsx(
                  "flex items-start gap-4 rounded-xl border bg-white p-4 shadow-sm",
                  overdue ? "border-red-200" : "border-gray-200",
                )}
              >
                <button
                  onClick={() => toggleComplete(reminder.id, reminder.completed)}
                  className={clsx(
                    "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    reminder.completed
                      ? "border-brand-500 bg-brand-500 text-white"
                      : "border-gray-300 hover:border-brand-400",
                  )}
                >
                  {reminder.completed && <Check className="h-3 w-3" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={clsx(
                      "text-sm",
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
