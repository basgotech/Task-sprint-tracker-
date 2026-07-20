import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sprintsApi } from "../api/resources";
import VelocityChart from "../components/VelocityChart.jsx";

const STATUS_STYLE = {
  planned: "bg-ink/5 text-ink/50",
  active: "bg-signal/10 text-signal",
  completed: "bg-moss/10 text-moss",
};

export default function SprintsPage() {
  const { projectId } = useParams();
  const [sprints, setSprints] = useState([]);
  const [velocity, setVelocity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", start_date: "", end_date: "", goal: "" });
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([sprintsApi.list(projectId), sprintsApi.velocity(projectId)])
      .then(([sprintsRes, velocityRes]) => {
        setSprints(sprintsRes.data.results ?? sprintsRes.data);
        setVelocity(velocityRes.data);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(load, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await sprintsApi.create({ ...form, project: projectId });
      setForm({ name: "", start_date: "", end_date: "", goal: "" });
      load();
    } finally {
      setCreating(false);
    }
  };

  const setStatus = async (sprint, status) => {
    await sprintsApi.update(sprint.id, { status });
    load();
  };

  return (
    <div className="p-6 max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold">Sprints &amp; velocity</h1>
        <p className="text-xs text-ink/40 mt-0.5">
          Plan sprints and track how much your team actually ships.
        </p>
      </div>

      <VelocityChart data={velocity} />

      <form onSubmit={submit} className="card p-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
        <input
          className="input sm:col-span-2"
          placeholder="Sprint name (e.g. Sprint 12)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="date"
          className="input"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          required
        />
        <input
          type="date"
          className="input"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          required
        />
        <button className="btn-primary" disabled={creating}>
          {creating ? "Creating…" : "New sprint"}
        </button>
      </form>

      <div className="card divide-y divide-black/5">
        {loading && <p className="p-4 text-sm text-ink/40">Loading sprints…</p>}
        {!loading && sprints.length === 0 && (
          <p className="p-4 text-sm text-ink/40">No sprints yet — create one above.</p>
        )}
        {sprints.map((s) => (
          <div key={s.id} className="p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">{s.name}</p>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[s.status]}`}
                >
                  {s.status}
                </span>
              </div>
              <p className="text-xs text-ink/40 mt-0.5">
                {s.start_date} → {s.end_date} · {s.task_count} tasks · {s.completed_points}/
                {s.committed_points} pts done
              </p>
            </div>
            <select
              className="input w-32 text-xs"
              value={s.status}
              onChange={(e) => setStatus(s, e.target.value)}
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
