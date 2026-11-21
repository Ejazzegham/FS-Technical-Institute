"use client";

import CrudManager from "@/components/admin/CrudManager";

export default function AdminSoftwarePage() {
  return (
    <CrudManager
      title="Software & Tools"
      description="Reference list of the software used for recording lectures and running online classes — for your own/staff reference, not shown on the public site."
      collectionName="site_software"
      columns={["name", "category", "purpose"]}
      fields={[
        { key: "name", label: "Software Name", required: true, placeholder: "e.g. OBS Studio" },
        {
          key: "category",
          label: "Used For",
          type: "select",
          required: true,
          options: ["Live Classes", "Recording Lectures", "Both"],
        },
        {
          key: "purpose",
          label: "What it's used for",
          type: "textarea",
          placeholder: "e.g. Screen + webcam recording for lecture videos",
        },
        { key: "website", label: "Website URL", type: "url", placeholder: "https://" },
      ]}
    />
  );
}
