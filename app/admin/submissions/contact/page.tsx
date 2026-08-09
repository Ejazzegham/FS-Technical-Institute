"use client";

import SubmissionList from "@/components/admin/SubmissionList";

export default function AdminContactSubmissionsPage() {
  return (
    <SubmissionList
      title="Contact Messages"
      description="Submissions from the Contact page form."
      collectionName="contact_requests"
      columns={[
        { key: "createdAt", label: "Received" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "course", label: "Course" },
        { key: "subject", label: "Subject" },
        { key: "message", label: "Message" },
      ]}
    />
  );
}
