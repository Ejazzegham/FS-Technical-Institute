"use client";

import CrudManager from "@/components/admin/CrudManager";

export default function AdminRecordedLecturesPage() {
  return (
    <CrudManager
      title="Recorded Lectures"
      description="Videos shown on the Online Class page's 'Recorded Lectures' grid."
      collectionName="site_recorded_lectures"
      columns={["title", "category", "duration"]}
      fields={[
        { key: "title", label: "Title", required: true },
        {
          key: "category",
          label: "Category",
          type: "select",
          required: true,
          options: ["Web Development", "Graphic Design", "Cyber Security", "Digital Marketing"],
        },
        { key: "instructor", label: "Instructor", required: true },
        { key: "duration", label: "Duration", required: true, placeholder: "12:45" },
        { key: "order", label: "Display Order", type: "number" },
      ]}
    />
  );
}
