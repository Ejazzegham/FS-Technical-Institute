"use client";

import { useState, useRef } from "react";
import {
  Send,
  CheckCircle2,
  Eye,
  EyeOff,
  Upload,
  UserRound,
  GraduationCap,
  FileStack,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseAuth, db } from "@/lib/firebase";
import {
  courses as defaultCourses,
  batches,
  qualifications,
  religions,
  bloodGroups,
  type Course,
} from "@/lib/data";
import PremiumSelect from "@/components/PremiumSelect";

export default function AdmissionForm({ courses = defaultCourses }: { courses?: Course[] }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [docName, setDocName] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [enrollmentNumber, setEnrollmentNumber] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const fullName = data.get("fullName") as string;
    const fatherName = data.get("fatherName") as string | null;
    const email = data.get("email") as string;
    const mobile = data.get("mobile") as string;
    const cnic = data.get("cnic") as string | null;
    const address = data.get("address") as string | null;
    const course = data.get("course") as string;
    const batch = data.get("batch") as string | null;
    const qualification = data.get("qualification") as string | null;
    const religion = data.get("religion") as string | null;
    const bloodGroup = data.get("bloodGroup") as string | null;
    const password = data.get("password") as string;
    const confirmPassword = data.get("confirmPassword") as string;
    const enrollmentNo = (data.get("enrollmentNumber") as string)?.trim();

    if (!enrollmentNo) {
      setErrorMsg("Please enter the enrollment number.");
      setStatus("error");
      return;
    }
    if (!course) {
      setErrorMsg("Please select a course.");
      setStatus("error");
      return;
    }
    if (!batch) {
      setErrorMsg("Please select a batch.");
      setStatus("error");
      return;
    }
    if (!qualification) {
      setErrorMsg("Please select your qualification.");
      setStatus("error");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      // 1. Create the Firebase Auth account with the password set on this
      // form — this becomes the student's Student Portal login as soon as
      // their admission is submitted, so they don't have to register twice.
      const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      const uid = cred.user.uid;

      // 2. Upload files + record the application (issues the sequential
      // enrollment number server-side, then writes the `admissions` doc).
      const uploadData = new FormData();
      uploadData.append("uid", uid);
      uploadData.append("enrollmentNumber", enrollmentNo);
      uploadData.append("fullName", fullName);
      if (fatherName) uploadData.append("fatherName", fatherName);
      uploadData.append("email", email);
      uploadData.append("mobile", mobile);
      if (cnic) uploadData.append("cnic", cnic);
      if (address) uploadData.append("address", address);
      uploadData.append("course", course);
      if (batch) uploadData.append("batch", batch);
      if (qualification) uploadData.append("qualification", qualification);
      if (religion) uploadData.append("religion", religion);
      if (bloodGroup) uploadData.append("bloodGroup", bloodGroup);
      const photo = data.get("photo") as File | null;
      const document = data.get("document") as File | null;
      if (photo && photo.size > 0) uploadData.append("photo", photo);
      if (document && document.size > 0) uploadData.append("document", document);

      const res = await fetch("/api/admissions", { method: "POST", body: uploadData });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Submission failed");

      // 3. Create the student's portal profile while still signed in as the
      // just-created user, so they can log in with this admission's serial
      // number / email + password right away.
      await setDoc(doc(db, "students", uid), {
        uid,
        enrollmentNumber: result.enrollmentNumber,
        fullName,
        fatherName: fatherName || null,
        email,
        mobile,
        cnic: cnic || null,
        address: address || null,
        course,
        batch: batch || null,
        qualification: qualification || null,
        religion: religion || null,
        bloodGroup: bloodGroup || null,
        photoUrl: result.photoUrl,
        documentUrl: result.documentUrl,
        source: "admission",
        createdAt: serverTimestamp(),
      });

      setEnrollmentNumber(result.enrollmentNumber);
      setStatus("done");
      formRef.current?.reset();
      setPhotoName(null);
      setDocName(null);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, "").trim()
          : "Something went wrong.";
      setErrorMsg(message || "Could not complete submission.");
      setStatus("error");
    }
  }

  function startNewApplication() {
    setStatus("idle");
    setErrorMsg(null);
    setEnrollmentNumber(null);
    setFormKey((k) => k + 1);
  }

  if (status === "done") {
    return (
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-8 text-center">
        <CheckCircle2 size={44} className="text-emerald-500 mx-auto mb-4" />
        <h3 className="font-display font-bold text-navy text-xl mb-2">
          Application Submitted!
        </h3>
        <p className="text-sm text-navy/60 mb-4">
          Thank you for applying. Your enrollment number is:
        </p>
        <p className="font-display font-bold text-gold-dark text-2xl mb-6">
          {enrollmentNumber}
        </p>
        <p className="text-xs text-navy/45 mb-6">
          A student portal account has been created with the email &amp; password you
          entered — you can sign in any time to track your application.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Go to Student Portal
          </a>
          <button
            onClick={startNewApplication}
            className="inline-flex items-center justify-center gap-2 bg-white border border-navy/15 hover:border-navy/30 text-navy font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <RotateCcw size={15} /> Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      <div className="px-6 md:px-7 pt-6 md:pt-7 pb-5 border-b border-black/5">
        <h2 className="font-display font-bold text-navy text-xl mb-1">Admission Form</h2>
        <p className="text-sm text-navy/50">Fill out the form below to apply for admission.</p>
      </div>

      <form ref={formRef} key={formKey} onSubmit={handleSubmit} className="p-6 md:p-7 space-y-8">
        <FormSection icon={UserRound} title="Personal Information">
          <Field label="Enrollment Number" required hint="e.g. FSTI-2026-0001">
            <input
              name="enrollmentNumber"
              required
              placeholder="Enter enrollment number"
              className="input"
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <input name="fullName" required placeholder="Enter your full name" className="input" />
            </Field>
            <Field label="Father's Name" required>
              <input name="fatherName" required placeholder="Enter father's name" className="input" />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email Address" required>
              <input type="email" name="email" required placeholder="Enter your email" className="input" />
            </Field>
            <Field label="Mobile Number" required>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-black/10 bg-slate-50 text-sm text-navy/60">
                  +92
                </span>
                <input
                  name="mobile"
                  required
                  placeholder="300 1234567"
                  className="input rounded-l-none"
                />
              </div>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="CNIC/B-Form No." hint="Optional">
              <input name="cnic" placeholder="Enter your CNIC or B-Form number" className="input" />
            </Field>
            <Field label="Address" required>
              <input name="address" required placeholder="Enter your full address" className="input" />
            </Field>
          </div>
        </FormSection>

        <FormSection icon={GraduationCap} title="Course &amp; Academic Details">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Select Course" required>
              <PremiumSelect
                name="course"
                required
                placeholder="Select a course"
                options={courses.map((c) => ({ value: c.title, label: c.title }))}
              />
            </Field>
            <Field label="Select Batch" required>
              <PremiumSelect name="batch" required placeholder="Choose your batch" options={batches} />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Qualification" required>
              <PremiumSelect
                name="qualification"
                required
                placeholder="Select your qualification"
                options={qualifications}
              />
            </Field>
            <Field label="Religion" hint="Optional">
              <PremiumSelect name="religion" placeholder="Select religion" options={religions} />
            </Field>
          </div>

          <Field label="Blood Group" hint="Optional">
            <PremiumSelect name="bloodGroup" placeholder="Select blood group" options={bloodGroups} />
          </Field>
        </FormSection>

        <FormSection icon={FileStack} title="Upload Documents">
          <div className="grid sm:grid-cols-2 gap-4">
            <UploadField
              label="Upload Student Photo"
              hint="JPG, PNG (Max 2MB)"
              name="photo"
              accept="image/jpeg,image/png"
              fileName={photoName}
              onChange={setPhotoName}
            />
            <UploadField
              label="Upload Documents"
              hint="CNIC, Certificates (PDF/JPG/PNG)"
              name="document"
              accept=".pdf,image/jpeg,image/png"
              fileName={docName}
              onChange={setDocName}
            />
          </div>
        </FormSection>

        <FormSection icon={ShieldCheck} title="Account Security">
          <p className="text-xs text-navy/45 -mt-2">
            Set a password now — it doubles as your Student Portal login, so you can track
            this application as soon as you submit it.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Password" required>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Create a password"
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
            <Field label="Confirm Password" required>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Confirm password"
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
          </div>
        </FormSection>

        {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "Submitting..." : "Submit Application"} <Send size={16} />
        </button>
      </form>
    </div>
  );
}

function FormSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <span className="w-7 h-7 rounded-md bg-gold/10 flex items-center justify-center shrink-0">
          <Icon size={14} className="text-gold-dark" />
        </span>
        <h3 className="font-display font-bold text-navy text-sm uppercase tracking-wide">{title}</h3>
        <span className="flex-1 h-px bg-black/5" />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-navy/80 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="text-navy/35 font-normal text-xs"> ({hint})</span>}
      </span>
      {children}
    </label>
  );
}

function UploadField({
  label,
  hint,
  name,
  accept,
  fileName,
  onChange,
}: {
  label: string;
  hint: string;
  name: string;
  accept: string;
  fileName: string | null;
  onChange: (name: string | null) => void;
}) {
  return (
    <div className="border border-black/10 rounded-lg p-4 flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-navy">{label}</p>
        <p className="text-xs text-navy/40">{fileName ?? hint}</p>
      </div>
      <label className="inline-flex items-center gap-1.5 bg-navy hover:bg-navy-light text-white text-xs font-semibold px-3 py-2 rounded-md cursor-pointer shrink-0">
        <Upload size={13} /> Choose File
        <input
          type="file"
          name={name}
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0]?.name ?? null)}
        />
      </label>
    </div>
  );
}
