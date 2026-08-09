import Link from "next/link";
import { recentExpenses } from "@/lib/adminData";

export default function RecentExpensesTable() {
  return (
    <div className="bg-white rounded-xl border border-black/5 shadow-sm p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-navy text-base">Recent Expenses</h3>
        <Link href="/admin/expenses" className="text-xs font-semibold text-navy/50 hover:text-navy">
          View All
        </Link>
      </div>

      {recentExpenses.length === 0 && (
        <p className="text-sm text-navy/40 py-6 text-center">No expenses recorded yet.</p>
      )}

      <div className={`overflow-x-auto -mx-5 ${recentExpenses.length === 0 ? "hidden" : ""}`}>
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="text-left text-xs text-navy/40 border-b border-black/5">
              <th className="font-medium px-5 pb-2 w-8">#</th>
              <th className="font-medium px-2 pb-2">Expense Title</th>
              <th className="font-medium px-2 pb-2">Category</th>
              <th className="font-medium px-2 pb-2">Amount</th>
              <th className="font-medium px-5 pb-2 text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentExpenses.map((e, i) => (
              <tr key={i} className="border-b border-black/5 last:border-0">
                <td className="px-5 py-3 text-navy/50">{i + 1}</td>
                <td className="px-2 py-3 font-medium text-navy whitespace-nowrap">{e.title}</td>
                <td className="px-2 py-3 text-navy/65 whitespace-nowrap">{e.category}</td>
                <td className="px-2 py-3 text-navy/65 whitespace-nowrap">{e.amount}</td>
                <td className="px-5 py-3 text-navy/65 text-right whitespace-nowrap">{e.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
