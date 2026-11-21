"use client";

import { useState } from "react";
import Image from "next/image";
import {
  UserRound,
  Phone,
  Mail,
  MapPin,
  Fingerprint,
  Droplet,
  BookMarked,
  GraduationCap,
  Users2,
  CalendarClock,
  Hash,
  FileText,
  ImageIcon,
  Pencil,
  Check,
  X,
  Copy,
  CheckCheck,
  Printer,
  ExternalLink,
} from "lucide-react";
import { usePortal } from "@/components/portal/PortalContext";
import StudentAvatar from "@/components/portal/StudentAvatar";
import PremiumSelect from "@/components/PremiumSelect";
import { religions, bloodGroups } from "@/lib/data";
import { formatTimestamp } from "@/lib/portalUtils";

export default function ProfilePage() {
  const { student, updateProfile, refreshing } = usePortal();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [mobile, setMobile] = useState(student?.mobile ?? "");
  const [address, setAddress] = useState(student?.address ?? "");
  const [religion, setReligion] = useState(student?.religion ?? "");
  const [bloodGroup, setBloodGroup] = useState(student?.bloodGroup ?? "");

  if (!student) return null;

  function startEdit() {
    setMobile(student!.mobile ?? "");
    setAddress(student!.address ?? "");
    setReligion(student!.religion ?? "");
    setBloodGroup(student!.bloodGroup ?? "");
    setEditing(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile({
        mobile: mobile.trim(),
        address: address.trim(),
        religion: religion || null,
        bloodGroup: bloodGroup || null,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function copyEnrollment() {
    navigator.clipboard?.writeText(student!.enrollmentNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-navy-dark" />
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold-dark via-gold to-gold-dark" />
        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
          <StudentAvatar name={student.fullName} photoUrl={student.photoUrl} size={84} ring />
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-extrabold text-white text-2xl mb-1.5 truncate">
              {student.fullName}
            </h1>
            <button
              onClick={copyEnrollment}
              className="inline-flex items-center gap-1.5 text-gold text-sm font-mono hover:text-gold-dark transition-colors"
              title="Copy enrollment number"
            >
              {copied ? <CheckCheck size={13} /> : <Copy size={13} />} {student.enrollmentNumber}
            </button>
          </div>
          {!editing ? (
            <button
              onClick={startEdit}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shrink-0"
            >
              <Pencil size={14} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setEditing(false)}
                className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-1.5 bg-gold hover:bg-gold-dark disabled:opacity-60 text-navy text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                <Check size={14} /> {saving ? "Saving…" : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          {/* Personal information */}
          <InfoCard icon={UserRound} title="Personal Information">
            <InfoRow icon={UserRound} label="Father's Name" value={student.fatherName || "—"} />
            <InfoRow icon={Mail} label="Email Address" value={student.email} />
            {editing ? (
              <EditRow icon={Phone} label="Mobile Number">
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="input"
                  placeholder="Mobile Number"
                />
              </EditRow>
            ) : (
              <InfoRow icon={Phone} label="Mobile Number" value={student.mobile} />
            )}
            <InfoRow icon={Fingerprint} label="CNIC / B-Form Number" value={student.cnic || "—"} />
            {editing ? (
              <EditRow icon={MapPin} label="Address">
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input"
                  placeholder="Address"
                />
              </EditRow>
            ) : (
              <InfoRow icon={MapPin} label="Address" value={student.address || "—"} />
            )}
            {editing ? (
              <EditRow icon={Droplet} label="Religion">
                <PremiumSelect
                  name="religion"
                  placeholder="Select religion"
                  options={religions}
                  defaultValue={religion ?? ""}
                  onChange={setReligion}
                />
              </EditRow>
            ) : (
              <InfoRow icon={Droplet} label="Religion" value={student.religion || "—"} />
            )}
            {editing ? (
              <EditRow icon={Droplet} label="Blood Group" last>
                <PremiumSelect
                  name="bloodGroup"
                  placeholder="Select blood group"
                  options={bloodGroups}
                  defaultValue={bloodGroup ?? ""}
                  onChange={setBloodGroup}
                />
              </EditRow>
            ) : (
              <InfoRow icon={Droplet} label="Blood Group" value={student.bloodGroup || "—"} last />
            )}
          </InfoCard>

          {/* Academic information */}
          <InfoCard icon={GraduationCap} title="Academic Information">
            <InfoRow icon={BookMarked} label="Enrolled Course" value={student.course} />
            <InfoRow icon={Users2} label="Batch" value={student.batch || "—"} />
            <InfoRow icon={GraduationCap} label="Qualification" value={student.qualification || "—"} />
            <InfoRow icon={Hash} label="Enrollment Number" value={student.enrollmentNumber} />
            <InfoRow
              icon={CalendarClock}
              label="Registered On"
              value={formatTimestamp(student.createdAt)}
              last
            />
            <p className="text-xs text-navy/40 pt-3">
              To change your course, batch, or qualification on record, please contact the admin
              office.
            </p>
          </InfoCard>

          {/* Documents */}
          <InfoCard icon={FileText} title="Uploaded Documents">
            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              <DocumentTile
                icon={ImageIcon}
                label="Student Photo"
                url={student.photoUrl}
              />
              <DocumentTile
                icon={FileText}
                label="ID / Academic Document"
                url={student.documentUrl}
              />
            </div>
            <p className="text-xs text-navy/40 pt-3">
              To update your photo or documents, please visit the admin office with the new
              files.
            </p>
          </InfoCard>
        </div>

        {/* ID Card */}
        <div className="space-y-4">
          <IdCard
            name={student.fullName}
            enrollmentNumber={student.enrollmentNumber}
            course={student.course}
            batch={student.batch}
            photoUrl={student.photoUrl}
          />
          {refreshing && <p className="text-xs text-navy/40 text-center">Syncing…</p>}
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
      <div className="flex items-center gap-2.5 mb-1">
        <span className="w-7 h-7 rounded-md bg-gold/10 flex items-center justify-center shrink-0">
          <Icon size={14} className="text-gold-dark" />
        </span>
        <h2 className="font-display font-bold text-navy text-base">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  last = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 py-3.5 ${last ? "" : "border-b border-black/5"}`}>
      <span className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-navy" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-navy/45 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-navy break-words">{value}</p>
      </div>
    </div>
  );
}

function EditRow({
  icon: Icon,
  label,
  children,
  last = false,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 py-3.5 ${last ? "" : "border-b border-black/5"}`}>
      <span className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={15} className="text-gold-dark" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-navy/45 mb-1.5">{label}</p>
        {children}
      </div>
    </div>
  );
}

function DocumentTile({ icon: Icon, label, url }: { icon: React.ElementType; label: string; url?: string | null }) {
  return (
    <div className="border border-black/10 rounded-lg p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
          <Icon size={15} className="text-navy" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-navy truncate">{label}</p>
          <p className="text-xs text-navy/40">{url ? "Uploaded" : "Not uploaded"}</p>
        </div>
      </div>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-gold-dark hover:text-gold shrink-0"
        >
          View <ExternalLink size={12} />
        </a>
      )}
    </div>
  );
}

function IdCard({
  name,
  enrollmentNumber,
  course,
  batch,
  photoUrl,
}: {
  name: string;
  enrollmentNumber: string;
  course: string;
  batch?: string | null;
  photoUrl?: string | null;
}) {
  return (
    <div>
      <div
        id="student-id-card"
        className="id-card-print bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden"
      >
        <div className="bg-navy px-5 pt-5 pb-8 relative">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold-dark via-gold to-gold-dark" />
          <div className="flex items-center gap-2.5 mb-4">
            <Image src="/images/logo.png" alt="FSTI" width={28} height={28} className="rounded-full" />
            <div className="leading-tight">
              <p className="text-white text-xs font-display font-bold">Furqan Saeed</p>
              <p className="text-gold text-[9px] font-semibold tracking-widest">TECHNICAL INSTITUTE</p>
            </div>
          </div>
          <p className="text-white/50 text-[10px] font-bold tracking-widest">STUDENT ID CARD</p>
        </div>

        <div className="px-5 pb-5 -mt-8">
          <div className="w-20 h-20 rounded-xl overflow-hidden ring-4 ring-white shadow-md mb-3">
            <StudentAvatar name={name} photoUrl={photoUrl} size={80} />
          </div>
          <p className="font-display font-bold text-navy text-base leading-snug">{name}</p>
          <p className="text-xs font-mono text-gold-dark mb-3">{enrollmentNumber}</p>
          <div className="space-y-1.5 text-xs text-navy/60 border-t border-black/5 pt-3">
            <p>
              <span className="text-navy/40">Course:</span> <span className="font-medium text-navy">{course}</span>
            </p>
            {batch && (
              <p>
                <span className="text-navy/40">Batch:</span> <span className="font-medium text-navy">{batch}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => window.print()}
        className="no-print mt-3 w-full inline-flex items-center justify-center gap-2 bg-white border border-black/10 hover:border-navy/30 text-navy text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
      >
        <Printer size={15} /> Print ID Card
      </button>
    </div>
  );
}
