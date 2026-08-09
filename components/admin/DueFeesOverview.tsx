import { dueFeesOverview, feeSummary } from "@/lib/adminData";

export default function DueFeesOverview() {
  return (
    <div className="bg-white rounded-xl border border-black/5 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-navy text-base">Due Fees Overview</h3>
        <span className="text-xs font-medium text-navy/40">By age of outstanding balance</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dueFeesOverview.map((row) => (
          <div key={row.range} className="rounded-lg border border-black/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-navy/60">{row.range}</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${row.color}`}>
                {row.students} Students
              </span>
            </div>
            <p className="font-display font-bold text-navy text-lg">PKR {row.amount.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-black/5">
        <span className="text-sm font-semibold text-navy">Total Due</span>
        <span className="text-sm font-bold text-red-600">PKR {feeSummary.due.toLocaleString()}</span>
      </div>
    </div>
  );
}
