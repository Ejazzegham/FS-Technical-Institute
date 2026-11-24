import {
  Users2, Wrench, Briefcase, GraduationCap, Printer, LayoutTemplate, Layers, Scissors, Stamp,
  Truck, PenTool, Award, BookOpen, Laptop, ShieldCheck, Star, Clock, Heart, Target, Rocket,
  type LucideIcon,
} from "lucide-react";

// Admin-managed content stores icons by name; this maps the name to a component.
export const ICONS: Record<string, LucideIcon> = {
  users: Users2,
  wrench: Wrench,
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  printer: Printer,
  "layout-template": LayoutTemplate,
  layers: Layers,
  scissors: Scissors,
  stamp: Stamp,
  truck: Truck,
  "pen-tool": PenTool,
  award: Award,
  "book-open": BookOpen,
  laptop: Laptop,
  "shield-check": ShieldCheck,
  star: Star,
  clock: Clock,
  heart: Heart,
  target: Target,
  rocket: Rocket,
};

export const ICON_NAMES = Object.keys(ICONS);
export const iconFor = (name?: string): LucideIcon => (name && ICONS[name]) || Star;
