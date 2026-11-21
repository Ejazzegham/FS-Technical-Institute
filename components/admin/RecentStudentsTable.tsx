import Link from "next/link";
import { recentStudents } from "@/lib/adminData";

export default function RecentStudentsTable() {
  return (
    <div className="bg-white rounded-xl border border-black/5 shadow-sm p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-navy text-base">Recent Students</h3>
        <Link href="/admin/students" className="text-xs font-semibold text-navy/50 hover:text-navy">
          View All
        </Link>
      </div>

      {recentStudents.length === 0 && (
        <p className="text-sm text-navy/40 py-6 text-center">No students yet.</p>
      )}

      <div className={`overflow-x-auto -mx-5 ${recentStudents.length === 0 ? "hidden" : ""}`}>
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-left text-xs text-navy/40 border-b border-black/5">
              <th className="font-medium px-5 pb-2 w-8">#</th>
              <th className="font-medium px-2 pb-2">Name</th>
              <th className="font-medium px-2 pb-2">Course</th>
              <th className="font-medium px-2 pb-2">Batch</th>
              <th className="font-medium px-2 pb-2">Admission Date</th>
              <th className="font-medium px-5 pb-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentStudents.map((s, i) => (
              <tr key={i} className="border-b border-black/5 last:border-0">
                <td className="px-5 py-3 text-navy/50">{i + 1}</td>
                <td className="px-2 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-navy/10 flex items-center justify-center text-navy font-semibold text-[11px] shrink-0">
                      {s.name.charAt(0)}
                    </span>
                    <span className="font-medium text-navy whitespace-nowrap">{s.name}</span>
                  </div>
                </td>
                <td className="px-2 py-3 text-navy/65 whitespace-nowrap">{s.course}</td>
                <td className="px-2 py-3 text-navy/65">{s.batch}</td>
                <td className="px-2 py-3 text-navy/65 whitespace-nowrap">{s.date}</td>
                <td className="px-5 py-3 text-right">
                  <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
