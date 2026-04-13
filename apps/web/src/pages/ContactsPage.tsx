import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Users, Plus, Search, Phone, Tag, ChevronDown, X } from "lucide-react";
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

interface Contact {
  id: string;
  name: string;
  phone: string;
  optedIn: boolean;
  tags: { tag: TagItem }[];
  pipelineStage: StageItem | null;
  assignedTo: { id: string; name: string } | null;
}

export function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [createError, setCreateError] = useState("");

  // Global tag/stage data
  const [allTags, setAllTags] = useState<TagItem[]>([]);
  const [allStages, setAllStages] = useState<StageItem[]>([]);

  // Inline picker state
  const [tagPickerFor, setTagPickerFor] = useState<string | null>(null);
  const [stagePickerFor, setStagePickerFor] = useState<string | null>(null);

  const loadContacts = async (searchQuery = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ pageSize: "50" });
      if (searchQuery) params.set("search", searchQuery);
      const res = await api.get<{ data: Contact[] }>(`/contacts?${params}`);
      setContacts(res.data);
    } catch {
      // failed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const [, tags, stages] = await Promise.all([
          loadContacts(),
          api.get<TagItem[]>("/tags"),
          api.get<StageItem[]>("/pipeline/stages"),
        ]);
        setAllTags(tags);
        setAllStages(stages);
      } catch {
        // failed
      }
    }
    init();
  }, []);

  const handleSearch = () => {
    loadContacts(search);
  };

  const handleCreate = async () => {
    setCreateError("");
    try {
      await api.post("/contacts", { name: newName, phone: newPhone });
      setNewName("");
      setNewPhone("");
      setShowCreate(false);
      loadContacts(search);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create contact");
    }
  };

  const addTag = async (contactId: string, tagId: string) => {
    try {
      const updated = await api.post<Contact>(`/contacts/${contactId}/tags`, { tagIds: [tagId] });
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, tags: updated.tags } : c)),
      );
    } catch {
      // failed
    }
    setTagPickerFor(null);
  };

  const removeTag = async (contactId: string, tagId: string) => {
    try {
      await api.delete(`/contacts/${contactId}/tags/${tagId}`);
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactId
            ? { ...c, tags: c.tags.filter((t) => t.tag.id !== tagId) }
            : c,
        ),
      );
    } catch {
      // failed
    }
  };

  const setStage = async (contactId: string, stageId: string | null) => {
    try {
      const updated = await api.put<Contact>(`/contacts/${contactId}/stage`, { stageId });
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactId ? { ...c, pipelineStage: updated.pipelineStage } : c,
        ),
      );
    } catch {
      // failed
    }
    setStagePickerFor(null);
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your WhatsApp contacts
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" />
          Add Contact
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by name or phone..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <button
          onClick={handleSearch}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Search
        </button>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">New Contact</h2>
            {createError && (
              <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {createError}
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Contact name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName || !newPhone}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16">
          <Users className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-sm text-gray-500">No contacts yet</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Tags
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Stage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.map((contact) => {
                const assignedTagIds = new Set(contact.tags.map((t) => t.tag.id));
                const availableTags = allTags.filter((t) => !assignedTagIds.has(t.id));

                return (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/contacts/${contact.id}`}
                        className="font-medium text-gray-900 hover:text-brand-600"
                      >
                        {contact.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Phone className="h-3.5 w-3.5" />
                        {contact.phone}
                      </span>
                    </td>
                    {/* Tags cell with inline picker */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1">
                        {contact.tags.map(({ tag }) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center gap-1 rounded-full py-0.5 pl-2 pr-1 text-xs font-medium"
                            style={{
                              backgroundColor: `${tag.color}20`,
                              color: tag.color,
                            }}
                          >
                            <Tag className="h-2.5 w-2.5" />
                            {tag.name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTag(contact.id, tag.id);
                              }}
                              className="ml-0.5 rounded-full p-0.5 opacity-50 hover:opacity-100 hover:bg-black/10"
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </span>
                        ))}
                        {availableTags.length > 0 && (
                          <div className="relative">
                            <button
                              onClick={() =>
                                setTagPickerFor(tagPickerFor === contact.id ? null : contact.id)
                              }
                              className="rounded-full border border-dashed border-gray-300 p-0.5 text-gray-400 hover:border-gray-400 hover:text-gray-500"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            {tagPickerFor === contact.id && (
                              <DropdownPortal onClose={() => setTagPickerFor(null)}>
                                <div className="w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                  <p className="px-3 py-1.5 text-xs font-medium text-gray-400">
                                    Add tag
                                  </p>
                                  {availableTags.map((tag) => (
                                    <button
                                      key={tag.id}
                                      onClick={() => addTag(contact.id, tag.id)}
                                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                                    >
                                      <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{ backgroundColor: tag.color }}
                                      />
                                      {tag.name}
                                    </button>
                                  ))}
                                </div>
                              </DropdownPortal>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    {/* Stage cell with inline picker */}
                    <td className="px-4 py-3">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setStagePickerFor(stagePickerFor === contact.id ? null : contact.id)
                          }
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium hover:opacity-80"
                          style={
                            contact.pipelineStage
                              ? {
                                  backgroundColor: `${contact.pipelineStage.color}20`,
                                  color: contact.pipelineStage.color,
                                }
                              : undefined
                          }
                        >
                          {contact.pipelineStage ? (
                            <>
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: contact.pipelineStage.color }}
                              />
                              {contact.pipelineStage.name}
                              <ChevronDown className="h-3 w-3" />
                            </>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-400 border border-dashed border-gray-300 rounded-full px-2 py-0.5">
                              <Plus className="h-3 w-3" />
                              Stage
                            </span>
                          )}
                        </button>
                        {stagePickerFor === contact.id && (
                          <DropdownPortal onClose={() => setStagePickerFor(null)}>
                            <div className="w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                              <button
                                onClick={() => setStage(contact.id, null)}
                                className="block w-full px-3 py-1.5 text-left text-sm text-gray-400 hover:bg-gray-50"
                              >
                                No stage
                              </button>
                              {allStages.map((stage) => (
                                <button
                                  key={stage.id}
                                  onClick={() => setStage(contact.id, stage.id)}
                                  className={clsx(
                                    "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-gray-50",
                                    contact.pipelineStage?.id === stage.id && "bg-gray-50 font-medium",
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
                          </DropdownPortal>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DropdownPortal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute left-0 top-full z-20 mt-1">
      {children}
    </div>
  );
}
