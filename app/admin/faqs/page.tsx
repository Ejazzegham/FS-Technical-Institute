"use client";

import CrudManager from "@/components/admin/CrudManager";

export default function AdminFaqsPage() {
  return (
    <CrudManager
      title="FAQs"
      description="Questions shown on the FAQ page and the home page (they also help your Google search appearance)."
      collectionName="site_faqs"
      columns={["question", "category"]}
      fields={[
        { key: "question", label: "Question", required: true },
        { key: "answer", label: "Answer", type: "textarea", required: true },
        { key: "category", label: "Category", placeholder: "Admissions, Fees, Courses, Classes…", helpText: "FAQs with the same category are grouped together." },
        { key: "order", label: "Display Order", type: "number" },
      ]}
    />
  );
}
