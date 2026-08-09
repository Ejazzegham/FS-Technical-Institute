import {
  Code2,
  Palette,
  TrendingUp,
  LayoutGrid,
  Smartphone,
  Terminal,
  Video,
  Ruler,
  Megaphone,
  Briefcase,
  MonitorPlay,
  LineChart,
  Languages,
  GraduationCap,
} from "lucide-react";
import type { Course } from "@/lib/data";

/**
 * Single source of truth for how each course "icon" key is represented visually
 * (icon component, card gradient, badge color). Shared by CourseCard (Courses page)
 * and the Online Class page so a course looks and reads the same everywhere.
 */
export const courseIconMap: Record<Course["icon"], typeof Code2> = {
  code: Code2,
  palette: Palette,
  "trending-up": TrendingUp,
  "layout-grid": LayoutGrid,
  smartphone: Smartphone,
  terminal: Terminal,
  video: Video,
  ruler: Ruler,
  megaphone: Megaphone,
  briefcase: Briefcase,
  youtube: MonitorPlay,
  "line-chart": LineChart,
  languages: Languages,
  "graduation-cap": GraduationCap,
};

export const courseGradients: Record<Course["icon"], string> = {
  code: "from-sky-900 to-slate-900",
  palette: "from-fuchsia-900 to-slate-900",
  "trending-up": "from-indigo-900 to-slate-900",
  "layout-grid": "from-orange-900 to-slate-900",
  smartphone: "from-teal-900 to-slate-900",
  terminal: "from-slate-800 to-slate-950",
  video: "from-rose-900 to-slate-900",
  ruler: "from-amber-900 to-slate-900",
  megaphone: "from-purple-900 to-slate-900",
  briefcase: "from-emerald-900 to-slate-900",
  youtube: "from-red-900 to-slate-900",
  "line-chart": "from-cyan-900 to-slate-900",
  languages: "from-blue-900 to-slate-900",
  "graduation-cap": "from-yellow-900 to-slate-900",
};

export const courseChipColors: Record<Course["icon"], string> = {
  code: "bg-sky-600",
  palette: "bg-fuchsia-600",
  "trending-up": "bg-indigo-600",
  "layout-grid": "bg-orange-600",
  smartphone: "bg-teal-600",
  terminal: "bg-slate-600",
  video: "bg-rose-600",
  ruler: "bg-amber-600",
  megaphone: "bg-purple-600",
  briefcase: "bg-emerald-600",
  youtube: "bg-red-600",
  "line-chart": "bg-cyan-600",
  languages: "bg-blue-600",
  "graduation-cap": "bg-yellow-600",
};
