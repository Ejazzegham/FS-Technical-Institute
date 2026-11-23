"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2 } from "lucide-react";
import type { AdmissionsData, AttendanceData, FeesData } from "@/lib/adminDashboard";

const PALETTE = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"];
const STATUS_COLORS: Record<string, string> = {
  New: "#6366f1",
  Contacted: "#06b6d4",
  Enrolled: "#10b981",
  Rejected: "#f43f5e",
};

const axisTick = { fontSize: 11, fill: "#64708a" };
const tooltipStyle = {
  fontSize: 12,
  borderRadius: 6,
  border: "1px solid #e6eaf2",
  boxShadow: "0 8px 24px -8px rgba(15,30,61,0.18)",
  padding: "6px 10px",
};

const pkr = (n: number) => `Rs. ${Math.round(n).toLocaleString("en-US")}`;
const compact = (n: number) =>
  n >= 1_000_000 ? `${+(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${+(n / 1000).toFixed(1)}k` : String(n);

export function ChartCard({
  title,
  subtitle,
  accent,
  badge,
  className = "",
  children,
}: {
  title: string;
  subtitle: string;
  accent: string;
  badge?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`relative bg-white rounded-lg border border-[#e6eaf2] shadow-[0_1px_2px_rgba(15,30,61,0.04)] overflow-hidden ${className}`}>
      <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: accent }} />
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-1">
        <div className="min-w-0">
          <h3 className="font-display font-bold text-sm text-navy">{title}</h3>
          <p className="text-[11px] text-navy/45">{subtitle}</p>
        </div>
        {badge}
      </div>
      <div className="px-3 pb-3 pt-1">{children}</div>
    </section>
  );
}

function ChartState({ loading, empty, children }: { loading: boolean; empty: boolean; children: ReactNode }) {
  if (loading) {
    return (
      <div className="h-56 flex items-center justify-center text-navy/30">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }
  if (empty) {
    return (
      <div className="h-56 flex items-center justify-center text-xs text-navy/40 text-center px-6">
        No data yet — it will appear here as records come in.
      </div>
    );
  }
  return <div className="h-56">{children}</div>;
}

function Pill({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span
      className="shrink-0 rounded px-2 py-0.5 text-[11px] font-bold"
      style={{ color, backgroundColor: `${color}1a` }}
    >
      {children}
    </span>
  );
}

/* ------------------------------ Fee collections ------------------------------ */
export function FeeCollectionsCard({ data, className }: { data: FeesData | null; className?: string }) {
  const empty = !data || data.total === 0;
  return (
    <ChartCard
      title="Fee Collections"
      subtitle="Amount collected per month · last 6 months"
      accent="linear-gradient(90deg,#10b981,#06b6d4)"
      badge={data && <Pill color="#059669">{pkr(data.thisMonth)} this month</Pill>}
      className={className}
    >
      <ChartState loading={!data} empty={empty}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data?.monthly} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="feeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="feeStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
            <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={compact} tick={axisTick} axisLine={false} tickLine={false} width={44} />
            <Tooltip formatter={(v) => [pkr(Number(v ?? 0)), "Collected"]} contentStyle={tooltipStyle} cursor={{ stroke: "#10b981", strokeDasharray: 3 }} />
            <Area
              type="monotone"
              dataKey="collected"
              stroke="url(#feeStroke)"
              strokeWidth={2.5}
              fill="url(#feeFill)"
              dot={{ r: 3, fill: "#fff", stroke: "#10b981", strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartState>
    </ChartCard>
  );
}

/* -------------------------------- Admissions -------------------------------- */
export function AdmissionsCard({ data, className }: { data: AdmissionsData | null; className?: string }) {
  const empty = !data || data.total === 0;
  return (
    <ChartCard
      title="Admissions"
      subtitle="Applications received · last 6 months"
      accent="linear-gradient(90deg,#6366f1,#8b5cf6)"
      badge={data && <Pill color="#6366f1">{data.total} total</Pill>}
      className={className}
    >
      <ChartState loading={!data} empty={empty}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data?.monthly} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
            <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [Number(v ?? 0), "Admissions"]} contentStyle={tooltipStyle} cursor={{ fill: "#6366f10d" }} />
            <Bar dataKey="admissions" radius={[3, 3, 0, 0]} maxBarSize={30}>
              {data?.monthly.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartState>
    </ChartCard>
  );
}

/* ----------------------------- Admission status ----------------------------- */
export function AdmissionStatusCard({ data, className }: { data: AdmissionsData | null; className?: string }) {
  const empty = !data || data.total === 0;
  return (
    <ChartCard
      title="Admission Status"
      subtitle="Where applications stand"
      accent="linear-gradient(90deg,#f59e0b,#f43f5e)"
      className={className}
    >
      <ChartState loading={!data} empty={empty}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data?.byStatus}
              dataKey="value"
              nameKey="status"
              innerRadius={46}
              outerRadius={74}
              paddingAngle={3}
              stroke="none"
            >
              {data?.byStatus.map((s, i) => (
                <Cell key={s.status} fill={STATUS_COLORS[s.status] ?? PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#64708a" }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartState>
    </ChartCard>
  );
}

/* -------------------------------- Attendance -------------------------------- */
export function AttendanceCard({ data, className }: { data: AttendanceData | null; className?: string }) {
  const empty = !data || data.marked === 0;
  return (
    <ChartCard
      title="Student Attendance"
      subtitle="Present vs absent · last 7 days"
      accent="linear-gradient(90deg,#06b6d4,#10b981,#f43f5e)"
      badge={data && data.marked > 0 && <Pill color="#0891b2">{data.presentPct}% present</Pill>}
      className={className}
    >
      <ChartState loading={!data} empty={empty}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data?.daily} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
            <XAxis dataKey="day" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#06b6d40d" }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#64708a" }} />
            <Bar dataKey="present" name="Present" stackId="a" fill="#10b981" maxBarSize={30} />
            <Bar dataKey="absent" name="Absent" stackId="a" fill="#f43f5e" radius={[3, 3, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </ChartState>
    </ChartCard>
  );
}
