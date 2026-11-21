"use client";

import CrudManager from "@/components/admin/CrudManager";

export default function AdminTestimonialsPage() {
  return (
    <CrudManager
      title="Testimonials"
      description="Student quotes shown on the homepage."
      collectionName="site_testimonials"
      columns={["name", "role"]}
      fields={[
        { key: "name", label: "Student Name", required: true },
        { key: "role", label: "Role / Course", required: true, placeholder: "Graduate, Web Development" },
        { key: "quote", label: "Quote", type: "textarea", required: true },
        { key: "order", label: "Display Order", type: "number" },
      ]}
    />
  );
}
