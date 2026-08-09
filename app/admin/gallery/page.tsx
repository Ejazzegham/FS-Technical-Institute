"use client";

import CrudManager from "@/components/admin/CrudManager";

export default function AdminGalleryPage() {
  return (
    <CrudManager
      title="Gallery"
      description="Photos and captions shown on the Gallery page."
      collectionName="site_gallery"
      columns={["caption", "category"]}
      fields={[
        {
          key: "category",
          label: "Category",
          type: "select",
          required: true,
          options: ["Classrooms", "Labs", "Events", "Workshops", "Achievements"],
        },
        { key: "caption", label: "Caption", type: "textarea", required: true },
        {
          key: "imageUrl",
          label: "Image URL",
          type: "url",
          placeholder: "https://...",
          helpText: "Optional — leave blank to use the default placeholder tile.",
        },
        { key: "order", label: "Display Order", type: "number", helpText: "Lower numbers show first." },
      ]}
    />
  );
}
