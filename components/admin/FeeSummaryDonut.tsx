"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { feeSummary } from "@/lib/adminData";

const data = [
  { name: "Collected", value: feeSummary.collected, color: "#10b981" },
  { name: "Due", value: feeSummary.due, color: "#f0a93b" },
];

export default function FeeSummaryDonut() {
  const total = feeSummary.total;

  return (
    <div className="relative h-44">
      {total > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={55}
              outerRadius={78}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <svg viewBox="0 0 176 176" className="w-full h-full">
          <circle cx="88" cy="88" r="66" fill="none" stroke="#eef1f6" strokeWidth="23" />
        </svg>
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[11px] text-navy/45">Total</span>
        <span className="font-display font-bold text-navy text-base leading-tight">PKR</span>
        <span className="font-display font-bold text-navy text-base leading-tight">
          {feeSummary.total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
