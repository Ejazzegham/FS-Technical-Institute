import Link from "next/link";
import { UserPlus, HandCoins, FileWarning, Contact, Megaphone, FileBarChart } from "lucide-react";
import { quickActions } from "@/lib/adminData";

const icons = [UserPlus, HandCoins, FileWarning, Contact, Megaphone, FileBarChart];

const colorMap: Record<string, string> = {
  blue: "bg-sky-50 text-sky-700",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-700",
  sky: "bg-indigo-50 text-indigo-700",
  teal: "bg-teal-50 text-teal-700",
  purple: "bg-violet-50 text-violet-700",
};

export default function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {quickActions.map((action, i) => {
        const Icon = icons[i];
        return (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-black/5 py-4 px-2 text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[action.color]}`}>
              <Icon size={16} />
            </span>
            <span className="text-xs font-medium text-navy/75 leading-tight">{action.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
