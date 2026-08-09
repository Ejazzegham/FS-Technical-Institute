import { GraduationCap, BookOpen, Users, Briefcase, LucideIcon } from "lucide-react";

const icons: LucideIcon[] = [GraduationCap, BookOpen, Users, Briefcase];

export default function StatsBar({
  stats,
}: {
  stats: { label: string; value: string }[];
}) {
  return (
    <div className="relative z-10 -mt-10 mx-4 md:mx-auto max-w-5xl bg-white rounded-2xl shadow-xl shadow-navy/10 border border-black/5 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-black/5">
      {stats.map((stat, i) => {
        const Icon = icons[i % icons.length];
        return (
          <div key={stat.label} className="flex items-center gap-3 px-5 py-6 justify-center">
            <span className="w-11 h-11 rounded-full bg-navy flex items-center justify-center shrink-0">
              <Icon size={18} className="text-gold" />
            </span>
            <span className="leading-tight">
              <span className="block font-display font-bold text-lg text-navy">{stat.value}</span>
              <span className="block text-xs text-navy/60">{stat.label}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
