// PLACEHOLDER DATA — the /admin dashboard UI is not yet wired to a real data
// source. Everything below is zeroed-out/placeholder so it never displays
// numbers or names that look like real students, fees or expenses.
// Before using this dashboard for real: replace these static arrays with
// live Firestore queries (see README "Admin dashboard" section) and add an
// auth/role guard to app/admin/layout.tsx.

export type SidebarLink = {
  label: string;
  icon:
    | "dashboard"
    | "students"
    | "fee"
    | "expenses"
    | "staff"
    | "courses"
    | "onlineClasses"
    | "classes"
    | "attendance"
    | "exams"
    | "certificates"
    | "reports"
    | "notice"
    | "messages"
    | "settings"
    | "backup";
  href: string;
  children?: { label: string; href: string }[];
};

export const sidebarLinks: SidebarLink[] = [
  { label: "Dashboard", icon: "dashboard", href: "/admin" },
  { label: "Students", icon: "students", href: "/admin/students" },
  {
    label: "Fee Management",
    icon: "fee",
    href: "/admin/fees",
    children: [
      { label: "Fee Collection", href: "/admin/fees/collection" },
      { label: "Manage Fees", href: "/admin/fees/manage" },
      { label: "Fee Records", href: "/admin/fees/records" },
      { label: "Due Fees", href: "/admin/fees/due" },
    ],
  },
  { label: "Expenses", icon: "expenses", href: "/admin/expenses" },
  { label: "Staff Management", icon: "staff", href: "/admin/staff" },
  { label: "Courses", icon: "courses", href: "/admin/courses" },
  {
    label: "Online Classes",
    icon: "onlineClasses",
    href: "/admin/live-classes",
    children: [
      { label: "Live Classes", href: "/admin/live-classes" },
      { label: "Recorded Lectures", href: "/admin/recorded-lectures" },
      { label: "Software & Tools", href: "/admin/software" },
    ],
  },
  { label: "Classes & Batches", icon: "classes", href: "/admin/classes" },
  { label: "Attendance", icon: "attendance", href: "/admin/attendance" },
  { label: "Examinations", icon: "exams", href: "/admin/examinations" },
  { label: "Certificates", icon: "certificates", href: "/admin/certificates" },
  { label: "Reports", icon: "reports", href: "/admin/reports" },
  { label: "Notice Board", icon: "notice", href: "/admin/notices" },
  { label: "Messages", icon: "messages", href: "/admin/messages" },
  { label: "Settings", icon: "settings", href: "/admin/settings" },
  { label: "Backup & Restore", icon: "backup", href: "/admin/backup" },
];

export const dashboardStats = [
  { label: "Total Students", value: "0", change: "No data yet", trend: "up" as const, color: "blue" },
  { label: "Total Fee Collected", value: "PKR 0", change: "No data yet", trend: "up" as const, color: "green" },
  { label: "Total Expenses", value: "PKR 0", change: "No data yet", trend: "down" as const, color: "orange" },
  { label: "Total Staff", value: "0", change: "No data yet", trend: "up" as const, color: "purple" },
];

export const feeCollectionOverview = [
  { date: "Week 1", collected: 0, due: 0 },
  { date: "Week 2", collected: 0, due: 0 },
  { date: "Week 3", collected: 0, due: 0 },
  { date: "Week 4", collected: 0, due: 0 },
];

export const feeSummary = {
  collected: 0,
  due: 0,
  total: 0,
};

export const studentsOverview = [
  { label: "Web Development", value: 0, pct: 0, color: "#0f1e3d" },
  { label: "Graphic Design", value: 0, pct: 0, color: "#7c3aed" },
  { label: "Cyber Security", value: 0, pct: 0, color: "#f0a93b" },
  { label: "Digital Marketing", value: 0, pct: 0, color: "#ef4444" },
  { label: "MS Office", value: 0, pct: 0, color: "#10b981" },
  { label: "Other Courses", value: 0, pct: 0, color: "#94a3b8" },
];

export const dueFeesOverview = [
  { range: "1 - 30 Days", amount: 0, students: 0, color: "text-sky-600 bg-sky-50" },
  { range: "31 - 60 Days", amount: 0, students: 0, color: "text-amber-600 bg-amber-50" },
  { range: "61 - 90 Days", amount: 0, students: 0, color: "text-orange-600 bg-orange-50" },
  { range: "90+ Days", amount: 0, students: 0, color: "text-red-600 bg-red-50" },
];

export const recentFeeCollections: {
  name: string;
  course: string;
  amount: string;
  time: string;
}[] = [];

export const recentStudents: {
  name: string;
  course: string;
  batch: string;
  date: string;
  status: string;
}[] = [];

export const recentExpenses: {
  title: string;
  category: string;
  amount: string;
  date: string;
}[] = [];

export const quickActions = [
  { label: "Add Student", href: "/admin/students/new", color: "blue" },
  { label: "Collect Fee", href: "/admin/fees/collection", color: "green" },
  { label: "Add Expense", href: "/admin/expenses/new", color: "red" },
  { label: "Add Staff", href: "/admin/staff/new", color: "sky" },
  { label: "Create Notice", href: "/admin/notices/new", color: "teal" },
  { label: "Generate Report", href: "/admin/reports", color: "purple" },
];
