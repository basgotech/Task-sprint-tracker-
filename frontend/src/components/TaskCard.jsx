import React from "react";

const PRIORITY_DOT = {
  low: "bg-ink/20",
  medium: "bg-signal",
  high: "bg-amber",
  urgent: "bg-red-500",
};

export default function TaskCard({ task, onDragStart, onClick }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={() => onClick(task)}
      className="card p-3 cursor-grab active:cursor-grabbing hover:border-signal/30"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug">{task.title}</p>
        <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${PRIORITY_DOT[task.priority]}`} />
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="font-mono text-[11px] text-ink/40">#{task.id}</span>
        <div className="flex items-center gap-2">
          {task.story_points > 0 && (
            <span className="text-[11px] font-mono bg-ink/5 rounded px-1.5 py-0.5">
              {task.story_points} pt
            </span>
          )}
          {task.assignee_username && (
            <span
              title={task.assignee_username}
              className="h-5 w-5 rounded-full bg-signal/10 text-signal text-[10px] font-semibold flex items-center justify-center"
            >
              {task.assignee_username.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
