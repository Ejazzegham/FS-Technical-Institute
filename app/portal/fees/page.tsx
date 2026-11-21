"use client";

import { useEffect, useState } from "react";
import { Wallet, BadgeDollarSign, Info, Phone, MapPin } from "lucide-react";
import { usePortal } from "@/components/portal/PortalContext";
import { courses, contactInfo as defaultContactInfo, feeSettings as defaultFeeSettings } from "@/lib/data";
import { getFeeSettings, getContactInfo, type FeeSettings, type ContactInfo } from "@/lib/content";

export default function PortalFeesPage() {
  const { student } = usePortal();
  const course = courses.find((c) => c.title === student?.course);
  const [fees, setFees] = useState<FeeSettings>(defaultFeeSettings);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);

  useEffect(() => {
    getFeeSettings().then(setFees).catch(() => setFees(defaultFeeSettings));
    getContactInfo().then(setContactInfo).catch(() => setContactInfo(defaultContactInfo));
  }, []);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-gold-dark text-xs font-bold tracking-widest mb-1.5">FEE INFORMATION</p>
        <h1 className="font-display font-bold text-navy text-2xl">Your Course Fee</h1>
        <p className="text-sm text-navy/50 mt-1">
          A summary of the standard fee structure for your enrolled course.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-dark" />
        <div className="p-6 md:p-7 space-y-1">
          <FeeRow
            icon={BadgeDollarSign}
            label="Admission Fee"
            value={fees.admissionFee}
            hint="One-time, payable at admission"
          />
          <FeeRow
            icon={Wallet}
            label="Monthly Fee"
            value={course?.monthlyFee || "Contact office for details"}
            hint={`For ${course?.title || student?.course || "your course"}`}
          />
          <FeeRow icon={Info} label="Course Duration" value={course?.duration || "—"} last />
        </div>
      </div>

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 text-amber-800 rounded-2xl px-5 py-4 text-sm">
        <Info size={18} className="shrink-0 mt-0.5" />
        <p>
          Online fee payment isn&apos;t enabled yet. {fees.feeNote} For your current dues or
          payment history, contact the office directly.
        </p>
      </div>

      <div className="bg-navy rounded-2xl p-6">
        <h3 className="font-display font-bold text-white text-sm mb-4">Pay or Ask About Your Fee</h3>
        <div className="space-y-3">
          <a
            href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
          >
            <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Phone size={15} className="text-gold" />
            </span>
            <span className="text-sm">{contactInfo.phone}</span>
          </a>
          <div className="flex items-start gap-3 text-white/80">
            <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <MapPin size={15} className="text-gold" />
            </span>
            <span className="text-sm">{contactInfo.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeeRow({
  icon: Icon,
  label,
  value,
  hint,
  last = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint?: string;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 py-4 ${last ? "" : "border-b border-black/5"}`}>
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
          <Icon size={17} className="text-navy" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-navy">{label}</p>
          {hint && <p className="text-xs text-navy/40 truncate">{hint}</p>}
        </div>
      </div>
      <p className="font-display font-bold text-navy text-lg shrink-0">{value}</p>
    </div>
  );
}
