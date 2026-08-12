"use client";

import CrudManager from "@/components/admin/CrudManager";

export default function AdminCertificatesPage() {
  return (
    <CrudManager
      title="Certificates"
      description="Records looked up on the public Verify Certificate page. The Serial Number is the document ID — it's what students search by."
      collectionName="certificates"
      idField="serialNumber"
      idTransform={(v) => v.toUpperCase()}
      columns={["serialNumber", "studentName", "course", "status"]}
      fields={[
        { key: "serialNumber", label: "Serial Number", required: true, placeholder: "FSTI-2026-0001", helpText: "This is what students enter on the Verify page. Will be uppercased." },
        { key: "photoUrl", label: "Student Photo URL", type: "url", helpText: "Paste a photo link (e.g. copy it from the student's record under Students). Shown on the public verification result." },
        { key: "studentName", label: "Student Name", required: true },
        { key: "fatherName", label: "Father's Name" },
        { key: "course", label: "Course", required: true },
        { key: "duration", label: "Duration" },
        { key: "batch", label: "Batch" },
        {
          key: "status",
          label: "Status",
          type: "select",
          required: true,
          options: ["Enrolled", "In Progress", "Completed", "Certified"],
        },
        { key: "marksObtained", label: "Marks Obtained", type: "number" },
        { key: "totalMarks", label: "Total Marks", type: "number" },
        { key: "grade", label: "Grade", placeholder: "A+" },
        { key: "startDate", label: "Start Date", placeholder: "January 2026" },
        { key: "completionDate", label: "Completion Date", placeholder: "June 2026" },
        { key: "certificateNumber", label: "Certificate Number" },
      ]}
    />
  );
}
