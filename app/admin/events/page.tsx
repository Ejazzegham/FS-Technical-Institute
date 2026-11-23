"use client";

import CrudManager from "@/components/admin/CrudManager";

export default function AdminEventsPage() {
  return (
    <CrudManager
      title="Events & Highlights"
      description="Anything you add here appears instantly in the premium spotlight section on the home page. Upload a poster, a video, or just write text."
      collectionName="site_events"
      columns={["title", "badge", "eventDate", "status"]}
      fields={[
        { key: "title", label: "Headline", required: true, placeholder: "Free Web Development Workshop" },
        {
          key: "badge",
          label: "Highlight Label",
          type: "select",
          required: true,
          defaultValue: "Upcoming Event",
          options: ["Upcoming Event", "Live Now", "Admissions Open", "Announcement", "Workshop", "Seminar", "Result Declared", "Holiday Notice"],
        },
        {
          key: "description",
          label: "Details (text)",
          type: "textarea",
          placeholder: "A short description shown on the home page.",
        },
        {
          key: "mediaType",
          label: "Media Type",
          type: "select",
          required: true,
          defaultValue: "Image",
          options: ["Image", "Video", "Text only"],
          helpText: "Choose what the visitor sees first on the home page.",
        },
        {
          key: "imageUrl",
          label: "Poster / Image",
          type: "image",
          uploadFolder: "events",
          helpText: "JPG/PNG/WEBP (max 5 MB). For videos this is the cover image shown before play. 16:9 landscape looks best.",
        },
        {
          key: "videoUrl",
          label: "Video",
          type: "video",
          uploadFolder: "events",
          helpText: "Upload MP4/WEBM/MOV (max 50 MB) or paste a YouTube link. Only used when Media Type is Video.",
        },
        {
          key: "eventDate",
          label: "Event Date & Time",
          type: "datetime",
          helpText: "Optional. A live countdown is shown until this moment.",
        },
        { key: "venue", label: "Venue", placeholder: "FSTI Campus, Faisalabad" },
        { key: "ctaLabel", label: "Button Text", placeholder: "Register Now" },
        {
          key: "ctaHref",
          label: "Button Link",
          placeholder: "/admissions or https://wa.me/92300…",
          helpText: "Where the button goes. Use /admissions, /contact, or a full https:// link.",
        },
        {
          key: "expiresAt",
          label: "Auto-hide After",
          type: "datetime",
          helpText: "Optional. If empty, the event hides 24 hours after the Event Date. With no dates at all it stays until you hide or delete it.",
        },
        {
          key: "status",
          label: "Status",
          type: "select",
          required: true,
          defaultValue: "Live",
          options: ["Live", "Hidden"],
          helpText: "Hidden = saved but not shown on the website.",
        },
        { key: "order", label: "Display Order", type: "number", helpText: "Lower numbers show first. The first event is the big featured one." },
      ]}
    />
  );
}
