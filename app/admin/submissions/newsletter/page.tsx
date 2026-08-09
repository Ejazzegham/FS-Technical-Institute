"use client";

import SubmissionList from "@/components/admin/SubmissionList";

export default function AdminNewsletterSubmissionsPage() {
  return (
    <SubmissionList
      title="Newsletter Subscribers"
      description="Emails collected from the newsletter signup."
      collectionName="newsletter_subscribers"
      columns={[
        { key: "createdAt", label: "Subscribed" },
        { key: "email", label: "Email" },
      ]}
    />
  );
}
