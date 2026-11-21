import Link from "next/link";
import { recentFeeCollections } from "@/lib/adminData";

export default function RecentFeeCollections() {
  return (
    <div className="bg-white rounded-xl border border-black/5 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-navy text-base">Recent Fee Collections</h3>
        <Link href="/admin/fees/collection" className="text-xs font-semibold text-navy/50 hover:text-navy">
          View All
        </Link>
      </div>

      {recentFeeCollections.length === 0 && (
        <p className="text-sm text-navy/40 py-6 text-center">No fee collections yet.</p>
      )}

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentFeeCollections.map((item) => (
          <li key={item.name + item.time} className="flex items-center gap-3 rounded-lg border border-black/5 p-3">
            <span className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center text-navy font-semibold text-xs shrink-0">
              {item.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-navy truncate">{item.name}</p>
              <p className="text-xs text-navy/45 truncate">{item.course}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-emerald-600">{item.amount}</p>
              <p className="text-[10px] text-navy/35">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>

      <Link
        href="/admin/fees/collection"
        className="block text-center text-xs font-semibold text-navy mt-4 pt-4 border-t border-black/5 hover:text-gold-dark"
      >
        View All Collections →
      </Link>
    </div>
  );
}
