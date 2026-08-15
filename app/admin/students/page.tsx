"use client";

import SubmissionList from "@/components/admin/SubmissionList";

export default function AdminStudentsPage() {
  return (
    <SubmissionList
      title="Students"
      description="Everyone who completed registration (created a portal account). Click a row to manage attendance & course progress."
      collectionName="students"
      rowHref={(row) => `/admin/students/${row._id}`}
      columns={[
        { key: "createdAt", label: "Registered" },
        { key: "enrollmentNumber", label: "Enrollment #" },
        { key: "fullName", label: "Name" },
        { key: "email", label: "Email" },
        { key: "mobile", label: "Mobile" },
        { key: "course", label: "Course" },
        { key: "batch", label: "Batch" },
        { key: "qualification", label: "Qualification" },
        { key: "attendancePercent", label: "Attendance %" },
        { key: "courseProgress", label: "Progress %" },
        { key: "source", label: "Source" },
        { key: "photoUrl", label: "Photo", link: true },
        { key: "documentUrl", label: "Document", link: true },
      ]}
    />
  );
}
