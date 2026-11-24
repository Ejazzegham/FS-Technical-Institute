"use client";

import SubmissionList from "@/components/admin/SubmissionList";

export default function AdminDemoRequestsPage() {
  return (
    <SubmissionList
      title="Demo Class Requests"
      description="People who asked for a free demo class. Call them to confirm a slot, then update the status."
      collectionName="demo_requests"
      statusField="status"
      statusOptions={["New", "Contacted", "Scheduled", "Attended", "Enrolled", "Not interested"]}
      columns={[
        { key: "createdAt", label: "Received" },
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "course", label: "Course" },
        { key: "preferredTime", label: "Preferred time" },
        { key: "mode", label: "Mode" },
        { key: "message", label: "Message" },
      ]}
    />
  );
}
