import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { projectsApi } from "../api/resources";

export default function Shell() {
  const { user, logout } = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    projectsApi.list().then(({ data }) => setProjects(data.results ?? data));
  }, []);

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 shrink-0 bg-slate-950 text-white/90 flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <Link to="/" className="font-display text-lg font-semibold tracking-tight">
            Sprintline
          </Link>
          <p className="text-[11px] text-white/40 mt-0.5">Task &amp; sprint tracker</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="text-[11px] uppercase tracking-wider text-white/30 px-2 mb-2">
            Projects
          </p>
          {projects.map((p) => (
            <div key={p.id} className="mb-1">
              <div className="px-2 py-1.5 rounded-md text-sm font-medium text-white/80 flex items-center gap-2">
                <span className="font-mono text-[11px] text-signal bg-signal/10 rounded px-1.5 py-0.5">
                  {p.key}
                </span>
                <span className="truncate">{p.name}</span>
              </div>
              <div className="ml-1 pl-4 border-l border-white/10 flex flex-col text-sm">
                <Link
                  to={`/projects/${p.id}/board`}
                  className={`px-2 py-1 rounded hover:bg-white/5 ${
                    projectId == p.id ? "text-signal" : "text-white/60"
                  }`}
                >
                  Board
                </Link>
                <Link
                  to={`/projects/${p.id}/sprints`}
                  className={`px-2 py-1 rounded hover:bg-white/5 ${
                    projectId == p.id ? "text-signal" : "text-white/60"
                  }`}
                >
                  Sprints &amp; velocity
                </Link>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-xs text-white/30 px-2">No projects yet — create one below.</p>
          )}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => navigate("/", { state: { newProject: true } })}
            className="w-full text-sm text-left px-2 py-2 rounded-md text-white/70 hover:bg-white/5"
          >
            + New project
          </button>
          <div className="flex items-center justify-between px-2 pt-2">
            <span className="text-xs text-white/40 truncate">{user?.username}</span>
            <button onClick={logout} className="text-xs text-white/40 hover:text-white/80">
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
