import { Users, Wallet, Receipt, UserCog, ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  blue: Users,
  green: Wallet,
  orange: Receipt,
  purple: UserCog,
};

const bg: Record<string, string> = {
  blue: "bg-sky-600",
  green: "bg-emerald-600",
  orange: "bg-amber-500",
  purple: "bg-violet-600",
};

export default function StatCard({
  label,
  value,
  change,
  trend,
  color,
}: {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  color: string;
}) {
  const Icon = icons[color];
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  const hasData = !/no data/i.test(change);

  return (
    <div className="bg-white rounded-xl border border-black/5 shadow-sm p-5 flex items-start gap-4">
      <span className={`w-11 h-11 rounded-lg ${bg[color]} flex items-center justify-center shrink-0`}>
        <Icon size={19} className="text-white" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-navy/50 mb-1">{label}</p>
        <p className="font-display font-bold text-navy text-xl mb-1 truncate">{value}</p>
        {hasData ? (
          <p
            className={`text-xs font-medium flex items-center gap-0.5 ${
              trend === "up" ? "text-emerald-600" : "text-red-500"
            }`}
          >
            <TrendIcon size={12} /> {change}
          </p>
        ) : (
          <p className="text-xs font-medium text-navy/35">{change}</p>
        )}
      </div>
    </div>
  );
}
