"use client";

import CrudManager from "@/components/admin/CrudManager";

export default function AdminInstructorsPage() {
  return (
    <CrudManager
      title="Faculty"
      description="Instructors shown on the Faculty page."
      collectionName="site_instructors"
      columns={["name", "title", "expertise"]}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "title", label: "Job title", required: true, placeholder: "Senior Web Development Instructor" },
        { key: "expertise", label: "Expertise", placeholder: "JavaScript, React, Node.js" },
        { key: "experience", label: "Experience", placeholder: "8+ years" },
        { key: "bio", label: "Short bio", type: "textarea", required: true },
        { key: "image", label: "Photo", type: "image", uploadFolder: "misc" },
        { key: "order", label: "Display Order", type: "number" },
      ]}
    />
  );
}
