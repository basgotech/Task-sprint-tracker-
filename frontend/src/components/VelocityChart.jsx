import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function VelocityChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="card p-6 text-sm text-ink/40">
        Complete a sprint to start seeing your team's velocity here.
      </div>
    );
  }

  const avgCompleted =
    data.reduce((sum, d) => sum + d.completed_points, 0) / data.length;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-sm font-semibold">Team velocity</h3>
          <p className="text-xs text-ink/40 mt-0.5">Committed vs. completed story points</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink/40">Avg. completed</p>
          <p className="font-mono text-lg font-semibold text-signal">
            {avgCompleted.toFixed(1)}
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1B243014" vertical={false} />
          <XAxis
            dataKey="sprint_name"
            tick={{ fontSize: 11, fill: "#1B243088" }}
            axisLine={{ stroke: "#1B243020" }}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: "#1B243088" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #1B24301A" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="committed_points" name="Committed" fill="#1B243022" radius={[4, 4, 0, 0]} />
          <Bar dataKey="completed_points" name="Completed" fill="#5B8DEF" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
