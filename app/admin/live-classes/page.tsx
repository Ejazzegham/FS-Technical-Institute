"use client";

import CrudManager from "@/components/admin/CrudManager";

export default function AdminLiveClassesPage() {
  return (
    <CrudManager
      title="Live Classes"
      description="Classes shown on the Online Class page's 'Live Classes' panel."
      collectionName="site_live_classes"
      columns={["title", "instructor", "time"]}
      fields={[
        { key: "title", label: "Class Title", required: true },
        { key: "courseTag", label: "Course Tag", required: true, placeholder: "WEB DEVELOPMENT" },
        { key: "instructor", label: "Instructor", required: true },
        { key: "time", label: "Time", required: true, placeholder: "10:00 AM - 11:30 AM" },
        { key: "studentsOnline", label: "Students Online", type: "number" },
        {
          key: "icon",
          label: "Icon",
          type: "select",
          required: true,
          options: ["code", "palette", "shield", "trending-up"],
        },
        { key: "order", label: "Display Order", type: "number" },
      ]}
    />
  );
}
