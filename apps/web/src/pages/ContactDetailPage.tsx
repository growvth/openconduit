import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { ArrowLeft, Phone, Tag, MessageSquare, Trash2, Edit, Plus, X, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import clsx from "clsx";

interface TagItem {
  id: string;
  name: string;
  color: string;
}

interface StageItem {
  id: string;
  name: string;
  color: string;
  order: number;
}

interface ContactDetail {
  id: string;
  name: string;
  phone: string;
  notes: string | null;
  optedIn: boolean;
  optedInAt: string | null;
  createdAt: string;
  tags: { tag: TagItem }[];
  pipelineStage: StageItem | null;
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

  // Tag picker state
  const [allTags, setAllTags] = useState<TagItem[]>([]);
  const [showTagPicker, setShowTagPicker] = useState(false);

  // Stage picker state
  const [allStages, setAllStages] = useState<StageItem[]>([]);
  const [showStagePicker, setShowStagePicker] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [data, tags, stages] = await Promise.all([
          api.get<ContactDetail>(`/contacts/${id}`),
          api.get<TagItem[]>("/tags"),
          api.get<StageItem[]>("/pipeline/stages"),
        ]);
        setContact(data);
        setEditName(data.name);
        setEditNotes(data.notes ?? "");
        setAllTags(tags);
        setAllStages(stages);
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

  const addTag = async (tagId: string) => {
    try {
      const updated = await api.post<ContactDetail>(`/contacts/${id}/tags`, { tagIds: [tagId] });
      setContact({ ...contact!, tags: updated.tags });
      setShowTagPicker(false);
    } catch {
      // failed
    }
  };

  const removeTag = async (tagId: string) => {
    try {
      await api.delete(`/contacts/${id}/tags/${tagId}`);
      setContact({
        ...contact!,
        tags: contact!.tags.filter((t) => t.tag.id !== tagId),
      });
    } catch {
      // failed
    }
  };

  const setStage = async (stageId: string | null) => {
    try {
      const updated = await api.put<ContactDetail>(`/contacts/${id}/stage`, { stageId });
      setContact({ ...contact!, pipelineStage: updated.pipelineStage });
      setShowStagePicker(false);
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

  const assignedTagIds = new Set(contact.tags.map((t) => t.tag.id));
  const availableTags = allTags.filter((t) => !assignedTagIds.has(t.id));

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

          {/* Pipeline Stage */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-sm font-medium text-gray-500">Pipeline Stage</h2>
            <div className="relative">
              <button
                onClick={() => setShowStagePicker(!showStagePicker)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                {contact.pipelineStage ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: contact.pipelineStage.color }}
                    />
                    {contact.pipelineStage.name}
                  </span>
                ) : (
                  <span className="text-gray-400">No stage</span>
                )}
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {showStagePicker && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <button
                    onClick={() => setStage(null)}
                    className="block w-full px-3 py-2 text-left text-sm text-gray-400 hover:bg-gray-50"
                  >
                    No stage
                  </button>
                  {allStages.map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => setStage(stage.id)}
                      className={clsx(
                        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50",
                        contact.pipelineStage?.id === stage.id
                          ? "bg-gray-50 font-medium"
                          : "",
                      )}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      {stage.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500">Tags</h2>
              {availableTags.length > 0 && (
                <button
                  onClick={() => setShowTagPicker(!showTagPicker)}
                  className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>
            {showTagPicker && (
              <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-2">
                <p className="mb-2 text-xs font-medium text-gray-500">Add a tag</p>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => addTag(tag.id)}
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-80"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                      }}
                    >
                      <Plus className="h-2.5 w-2.5" />
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {contact.tags.length === 0 && !showTagPicker ? (
              <p className="text-sm text-gray-400">No tags</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {contact.tags.map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="group inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: `${tag.color}20`,
                      color: tag.color,
                    }}
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag.name}
                    <button
                      onClick={() => removeTag(tag.id)}
                      className="ml-0.5 rounded-full p-0.5 opacity-0 transition-opacity hover:bg-black/10 group-hover:opacity-100"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
