import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { ArrowLeft, Phone, Tag, MessageSquare, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

interface ContactDetail {
  id: string;
  name: string;
  phone: string;
  notes: string | null;
  optedIn: boolean;
  optedInAt: string | null;
  createdAt: string;
  tags: { tag: { id: string; name: string; color: string } }[];
  pipelineStage: { id: string; name: string; color: string } | null;
  assignedTo: { id: string; name: string } | null;
  conversations: { id: string; status: string; updatedAt: string }[];
}

export function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<ContactDetail>(`/contacts/${id}`);
        setContact(data);
        setEditName(data.name);
        setEditNotes(data.notes ?? "");
      } catch {
        // failed
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSave = async () => {
    try {
      const updated = await api.put<ContactDetail>(`/contacts/${id}`, {
        name: editName,
        notes: editNotes || undefined,
      });
      setContact({ ...contact!, ...updated });
      setEditing(false);
    } catch {
      // failed
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this contact and all associated data? This cannot be undone.")) return;
    try {
      await api.delete(`/contacts/${id}`);
      navigate("/contacts");
    } catch {
      // failed
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Contact not found</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/contacts"
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{contact.name}</h1>
          <p className="flex items-center gap-1 text-sm text-gray-500">
            <Phone className="h-3.5 w-3.5" /> {contact.phone}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {editing ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-gray-900">Edit Contact</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {contact.notes && (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h2 className="mb-2 text-sm font-medium text-gray-500">Notes</h2>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
                </div>
              )}

              {/* Conversations */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-4 font-semibold text-gray-900">Conversations</h2>
                {contact.conversations.length === 0 ? (
                  <p className="text-sm text-gray-500">No conversations</p>
                ) : (
                  <div className="space-y-2">
                    {contact.conversations.map((conv) => (
                      <Link
                        key={conv.id}
                        to={`/conversations/${conv.id}`}
                        className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50"
                      >
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{conv.status}</span>
                        <span className="text-xs text-gray-400">
                          {format(new Date(conv.updatedAt), "MMM d, yyyy")}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-sm font-medium text-gray-500">Details</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-400">Created</dt>
                <dd className="text-sm text-gray-700">
                  {format(new Date(contact.createdAt), "MMM d, yyyy")}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Opted In</dt>
                <dd className="text-sm text-gray-700">
                  {contact.optedIn ? "Yes" : "No"}
                </dd>
              </div>
              {contact.assignedTo && (
                <div>
                  <dt className="text-xs text-gray-400">Assigned To</dt>
                  <dd className="text-sm text-gray-700">{contact.assignedTo.name}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Tags */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-sm font-medium text-gray-500">Tags</h2>
            {contact.tags.length === 0 ? (
              <p className="text-sm text-gray-400">No tags</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {contact.tags.map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: `${tag.color}20`,
                      color: tag.color,
                    }}
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pipeline stage */}
          {contact.pipelineStage && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-3 text-sm font-medium text-gray-500">Pipeline Stage</h2>
              <span
                className="rounded-full px-3 py-1 text-sm font-medium"
                style={{
                  backgroundColor: `${contact.pipelineStage.color}20`,
                  color: contact.pipelineStage.color,
                }}
              >
                {contact.pipelineStage.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
