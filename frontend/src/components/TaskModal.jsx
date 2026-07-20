import React, { useEffect, useState } from "react";

const PRIORITIES = ["low", "medium", "high", "urgent"];

export default function TaskModal({ open, initial, columns, sprints, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(emptyForm());

  function emptyForm() {
    return {
      title: "",
      description: "",
      priority: "medium",
      story_points: 0,
      column: columns?.[0]?.id ?? "",
      sprint: "",
    };
  }

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        description: initial.description || "",
        priority: initial.priority,
        story_points: initial.story_points,
        column: initial.column,
        sprint: initial.sprint || "",
      });
    } else {
      setForm(emptyForm());
    }
  }, [initial, open]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, sprint: form.sprint || null, story_points: Number(form.story_points) });
  };

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold">
            {initial ? `Edit task #${initial.id}` : "New task"}
          </h2>
          <button onClick={onClose} className="text-ink/40 hover:text-ink text-sm">
            Close
          </button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-ink/60">Title</label>
            <input
              className="input mt-1"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink/60">Description</label>
            <textarea
              className="input mt-1"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-ink/60">Priority</label>
              <select
                className="input mt-1"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-ink/60">Story points</label>
              <input
                type="number"
                min={0}
                className="input mt-1"
                value={form.story_points}
                onChange={(e) => setForm({ ...form, story_points: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink/60">Column</label>
              <select
                className="input mt-1"
                value={form.column}
                onChange={(e) => setForm({ ...form, column: Number(e.target.value) })}
              >
                {columns?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-ink/60">Sprint</label>
            <select
              className="input mt-1"
              value={form.sprint}
              onChange={(e) => setForm({ ...form, sprint: e.target.value })}
            >
              <option value="">Backlog (no sprint)</option>
              {sprints?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            {initial ? (
              <button
                type="button"
                onClick={() => onDelete(initial.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete task
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="btn-ghost">
                Cancel
              </button>
              <button className="btn-primary">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
