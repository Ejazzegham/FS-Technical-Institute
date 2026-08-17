"use client";

import SubmissionList from "@/components/admin/SubmissionList";

export default function AdminAdmissionsSubmissionsPage() {
  return (
    <SubmissionList
      title="Admissions"
      description="Applications from the Admissions form. Click a row to edit, or use the status dropdown for a quick update."
      collectionName="admissions"
      statusField="status"
      statusOptions={["New", "Contacted", "Enrolled", "Rejected"]}
      rowHref={(row) => `/admin/submissions/admissions/${row._id}`}
      columns={[
        { key: "createdAt", label: "Received" },
        { key: "enrollmentNumber", label: "Enrollment #" },
        { key: "fullName", label: "Name" },
        { key: "email", label: "Email" },
        { key: "mobile", label: "Mobile" },
        { key: "course", label: "Course" },
        { key: "batch", label: "Batch" },
        { key: "qualification", label: "Qualification" },
        { key: "religion", label: "Religion" },
        { key: "bloodGroup", label: "Blood Group" },
        { key: "photoUrl", label: "Photo", link: true },
        { key: "documentUrl", label: "Document", link: true },
      ]}
    />
  );
}
