import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { boardsApi, tasksApi, sprintsApi } from "../api/resources";
import TaskCard from "../components/TaskCard.jsx";
import TaskModal from "../components/TaskModal.jsx";

export default function BoardPage() {
  const { projectId } = useParams();
  const [board, setBoard] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([boardsApi.list(projectId), sprintsApi.list(projectId)])
      .then(([boardsRes, sprintsRes]) => {
        const boards = boardsRes.data.results ?? boardsRes.data;
        setBoard(boards[0] ?? null);
        setSprints(sprintsRes.data.results ?? sprintsRes.data);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(load, [load]);

  const openNewTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const saveTask = async (payload) => {
    if (editingTask) {
      await tasksApi.update(editingTask.id, payload);
    } else {
      await tasksApi.create({ ...payload, project: projectId });
    }
    setModalOpen(false);
    load();
  };

  const deleteTask = async (id) => {
    await tasksApi.remove(id);
    setModalOpen(false);
    load();
  };

  const onDragStart = (e, task) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ id: task.id }));
  };

  const onDrop = async (e, column) => {
    e.preventDefault();
    setDragOverColumn(null);
    const { id } = JSON.parse(e.dataTransfer.getData("text/plain"));
    const newOrder = column.tasks.length;
    await tasksApi.move(id, { column: column.id, order: newOrder });
    load();
  };

  if (loading) return <div className="p-8 text-sm text-ink/40">Loading board…</div>;
  if (!board)
    return (
      <div className="p-8 text-sm text-ink/40">
        This project doesn't have a board yet.
      </div>
    );

  return (
    <div className="p-6 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-xl font-semibold">{board.name}</h1>
          <p className="text-xs text-ink/40 mt-0.5">Drag cards between columns to update status</p>
        </div>
        <button onClick={openNewTask} className="btn-primary">
          + New task
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full min-w-max pb-4">
          {board.columns.map((column) => (
            <div
              key={column.id}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverColumn(column.id);
              }}
              onDragLeave={() => setDragOverColumn(null)}
              onDrop={(e) => onDrop(e, column)}
              className={`w-72 shrink-0 rounded-lg border p-3 flex flex-col ${
                dragOverColumn === column.id
                  ? "border-signal/50 bg-signal/5"
                  : "border-black/5 bg-black/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-semibold">{column.name}</h3>
                <span className="text-xs text-ink/40 font-mono">{column.tasks.length}</span>
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto">
                {column.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDragStart={onDragStart}
                    onClick={openEditTask}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TaskModal
        open={modalOpen}
        initial={editingTask}
        columns={board.columns}
        sprints={sprints}
        onClose={() => setModalOpen(false)}
        onSave={saveTask}
        onDelete={deleteTask}
      />
    </div>
  );
}
