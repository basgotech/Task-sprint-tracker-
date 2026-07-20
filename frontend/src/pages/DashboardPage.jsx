import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectsApi, boardsApi } from "../api/resources";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", key: "", description: "" });
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    projectsApi
      .list()
      .then(({ data }) => setProjects(data.results ?? data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data: project } = await projectsApi.create({
        ...form,
        key: form.key.toUpperCase(),
      });
      await boardsApi.create(project.id);
      setForm({ name: "", key: "", description: "" });
      load();
      navigate(`/projects/${project.id}/board`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display text-2xl font-semibold">Your projects</h1>
      <p className="text-sm text-ink/50 mt-1">
        Kanban boards, sprints, and velocity tracking for your team.
      </p>

      <form onSubmit={submit} className="card p-5 mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          className="input sm:col-span-2"
          placeholder="Project name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="input font-mono uppercase"
          placeholder="KEY"
          maxLength={10}
          value={form.key}
          onChange={(e) => setForm({ ...form, key: e.target.value })}
          required
        />
        <button className="btn-primary" disabled={creating}>
          {creating ? "Creating…" : "New project"}
        </button>
      </form>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {loading && <p className="text-sm text-ink/40">Loading projects…</p>}
        {!loading && projects.length === 0 && (
          <p className="text-sm text-ink/40">
            No projects yet. Create one above to get your first board.
          </p>
        )}
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(`/projects/${p.id}/board`)}
            className="card p-4 text-left hover:border-signal/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-signal bg-signal/10 rounded px-1.5 py-0.5">
                {p.key}
              </span>
              <span className="font-medium">{p.name}</span>
            </div>
            <p className="text-xs text-ink/40 mt-2">{p.members_count} member(s)</p>
          </button>
        ))}
      </div>
    </div>
  );
}
