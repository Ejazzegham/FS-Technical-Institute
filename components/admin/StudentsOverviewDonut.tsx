"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { studentsOverview } from "@/lib/adminData";

const total = studentsOverview.reduce((sum, s) => sum + s.value, 0);

export default function StudentsOverviewDonut() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-10">
      <div className="relative w-44 h-44 shrink-0">
        {total > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={studentsOverview}
                dataKey="value"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                stroke="none"
              >
                {studentsOverview.map((d) => (
                  <Cell key={d.label} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <svg viewBox="0 0 176 176" className="w-full h-full">
            <circle cx="88" cy="88" r="70" fill="none" stroke="#eef1f6" strokeWidth="25" />
          </svg>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display font-bold text-navy text-xl leading-tight">
            {total.toLocaleString()}
          </span>
          <span className="text-[11px] text-navy/45">Total Students</span>
        </div>
      </div>

      <ul className="flex-1 w-full grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
        {studentsOverview.map((s) => (
          <li key={s.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-navy/70">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
            <span className="text-navy/45 text-xs">
              {s.value} ({s.pct}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
