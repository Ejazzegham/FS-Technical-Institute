"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { feeCollectionOverview } from "@/lib/adminData";

export default function FeeCollectionChart() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={feeCollectionOverview} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="collectedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f1e3d" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#0f1e3d" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="dueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0a93b" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#f0a93b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#0f1e3d99" }}
            axisLine={{ stroke: "#eef1f6" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => `${v}M`}
            tick={{ fontSize: 11, fill: "#0f1e3d99" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value, name) => [
              `PKR ${Number(value ?? 0).toFixed(1)}M`,
              name === "collected" ? "Collected" : "Due",
            ]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #eef1f6" }}
          />
          <Area
            type="monotone"
            dataKey="collected"
            stroke="#0f1e3d"
            strokeWidth={2.5}
            fill="url(#collectedGradient)"
            dot={{ r: 3, fill: "#0f1e3d" }}
          />
          <Area
            type="monotone"
            dataKey="due"
            stroke="#f0a93b"
            strokeWidth={2.5}
            strokeDasharray="4 3"
            fill="url(#dueGradient)"
            dot={{ r: 3, fill: "#f0a93b" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
