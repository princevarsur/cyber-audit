"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { chartColors } from "@/lib/scoring";

export default function ComplianceStatusChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const shown = data.filter((d) => d.value > 0);
  return (
    <div className="card">
      <h3 className="mb-4 text-sm font-semibold text-white">Compliance Status Breakdown</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={shown}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
          >
            {shown.map((d) => (
              <Cell key={d.name} fill={chartColors[d.name] ?? "#64748b"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#121c2e",
              border: "1px solid #243049",
              borderRadius: 8,
              color: "#e2e8f0",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "#94a3b8" }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
