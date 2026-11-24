import { ICON_NAMES } from "@/lib/iconMap";

// Describes how each `site_content/<key>` document is edited in
// /admin/page-content. Keys match the getters in lib/content.ts.

export type FieldDef = {
  key: string; // supports dotted paths, e.g. "primaryCta.label"
  label: string;
  type?: "text" | "textarea" | "list" | "select" | "image" | "number" | "checkbox";
  options?: string[];
  help?: string;
};
export type ItemsDef = {
  key: string;
  label: string;
  type: "items";
  /** Field key shown as each item's heading. */
  titleKey: string;
  addLabel: string;
  fields: FieldDef[];
};
export type SectionDef = { key: string; title: string; description: string; fields: (FieldDef | ItemsDef)[] };

const ctaFields = (prefix: string, name: string): FieldDef[] => [
  { key: `${prefix}.label`, label: `${name} button text` },
  { key: `${prefix}.href`, label: `${name} button link`, help: "e.g. /admissions or tel:+92…" },
];

const heroItems = (): ItemsDef => ({
  key: "slides",
  label: "Slides",
  type: "items",
  titleKey: "title",
  addLabel: "Add slide",
  fields: [
    { key: "eyebrow", label: "Small heading (eyebrow)" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "image", label: "Desktop image", type: "image" },
    { key: "mobileImage", label: "Mobile image (optional)", type: "image" },
    { key: "alt", label: "Image description (alt text)" },
    { key: "theme", label: "Text colour", type: "select", options: ["light", "dark"], help: "light = navy text on a bright image; dark = white text on a dark image" },
    { key: "focus", label: "Image focus", help: "CSS position, e.g. 70% center" },
    ...ctaFields("primaryCta", "Primary"),
    ...ctaFields("secondaryCta", "Secondary"),
  ],
});

export const SECTIONS: SectionDef[] = [
  { key: "hero_home", title: "Home — hero slides", description: "The big banner slider at the top of the home page.", fields: [heroItems()] },
  {
    key: "home",
    title: "Home — page text",
    description: "Headings and text blocks on the home page.",
    fields: [
      { key: "popularEyebrow", label: "Popular courses — small heading" },
      { key: "popularTitle", label: "Popular courses — title" },
      { key: "aboutEyebrow", label: "About block — small heading" },
      { key: "aboutTitle", label: "About block — title" },
      { key: "aboutText", label: "About block — text", type: "textarea" },
      { key: "ctaTitle", label: "Bottom banner — title", help: "Leave empty to hide the banner." },
      { key: "ctaSubtitle", label: "Bottom banner — subtitle" },
      { key: "ctaButton", label: "Bottom banner — button text" },
      {
        key: "whyChooseUs",
        label: "Why choose us",
        type: "items",
        titleKey: "title",
        addLabel: "Add reason",
        fields: [
          { key: "title", label: "Title" },
          { key: "desc", label: "Description", type: "textarea" },
          { key: "icon", label: "Icon", type: "select", options: ICON_NAMES },
        ],
      } as ItemsDef,
    ],
  },
  {
    key: "about",
    title: "About page",
    description: "Mission, vision, values and leadership.",
    fields: [
      { key: "heroTagline", label: "Hero tagline" },
      { key: "heroDescription", label: "Hero description", type: "textarea" },
      { key: "whoEyebrow", label: "Who we are — small heading" },
      { key: "whoTitle", label: "Who we are — title" },
      { key: "whoText1", label: "Who we are — paragraph 1", type: "textarea" },
      { key: "whoText2", label: "Who we are — paragraph 2", type: "textarea" },
      { key: "mission", label: "Mission", type: "textarea" },
      { key: "vision", label: "Vision", type: "textarea" },
      { key: "values", label: "Values", type: "list", help: "One per line" },
      { key: "commitments", label: "Why choose us — commitments", type: "list", help: "One per line" },
      { key: "leadershipTitle", label: "Leadership — title" },
      { key: "leadershipText", label: "Leadership — text", type: "textarea" },
      {
        key: "leadership",
        label: "Leadership team",
        type: "items",
        titleKey: "name",
        addLabel: "Add person",
        fields: [
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "image", label: "Photo", type: "image" },
          { key: "bio", label: "Biography", type: "list", help: "One paragraph per line" },
        ],
      } as ItemsDef,
    ],
  },
  {
    key: "admissions",
    title: "Admissions",
    description: "Admission steps, required documents and batch timings (also used in the admission & registration forms).",
    fields: [
      {
        key: "process",
        label: "Admission process",
        type: "items",
        titleKey: "title",
        addLabel: "Add step",
        fields: [
          { key: "step", label: "Step number", type: "number" },
          { key: "title", label: "Title" },
          { key: "desc", label: "Description", type: "textarea" },
        ],
      } as ItemsDef,
      { key: "documents", label: "Required documents", type: "list", help: "One per line (first four show with icons)" },
      { key: "batches", label: "Batches", type: "list", help: "One per line — shown in the admission & registration forms" },
    ],
  },
  {
    key: "online_class",
    title: "Online classes — features",
    description: "Feature cards on the Online Classes page.",
    fields: [
      {
        key: "features",
        label: "Features",
        type: "items",
        titleKey: "title",
        addLabel: "Add feature",
        fields: [{ key: "title", label: "Title" }, { key: "desc", label: "Description", type: "textarea" }],
      } as ItemsDef,
    ],
  },
  {
    key: "course_highlights",
    title: "Course page — “Why choose FSTI”",
    description: "Bullet points shown on every course page.",
    fields: [{ key: "items", label: "Bullet points", type: "list", help: "One per line" }],
  },
  { key: "hero_press", title: "Printing Press — hero slides", description: "Banner slider on the Printing Press page.", fields: [heroItems()] },
  {
    key: "printing_press",
    title: "Printing Press — services",
    description: "Phone number, highlights, service lists and picture slider.",
    fields: [
      { key: "phone", label: "Press phone number", help: "Independent of the institute's main number." },
      {
        key: "highlights",
        label: "Highlights strip",
        type: "items",
        titleKey: "label",
        addLabel: "Add highlight",
        fields: [{ key: "label", label: "Label" }, { key: "icon", label: "Icon", type: "select", options: ICON_NAMES }],
      } as ItemsDef,
      { key: "printingServices", label: "Printing services", type: "list", help: "One per line" },
      { key: "largeFormatServices", label: "Large format services", type: "list", help: "One per line" },
      { key: "finishingServices", label: "Finishing & design services", type: "list", help: "One per line" },
      {
        key: "sliderImages",
        label: "Picture slider",
        type: "items",
        titleKey: "alt",
        addLabel: "Add picture",
        fields: [{ key: "src", label: "Image", type: "image" }, { key: "alt", label: "Image description (alt text)" }],
      } as ItemsDef,
    ],
  },
  {
    key: "navigation",
    title: "Navigation & footer links",
    description: "Header menu and footer quick links. “Printing Press” (/printing-press) is always shown last, highlighted.",
    fields: [
      {
        key: "navLinks",
        label: "Header menu",
        type: "items",
        titleKey: "label",
        addLabel: "Add link",
        fields: [{ key: "label", label: "Label" }, { key: "href", label: "Link", help: "e.g. /about" }],
      } as ItemsDef,
      {
        key: "footerLinks",
        label: "Footer quick links",
        type: "items",
        titleKey: "label",
        addLabel: "Add link",
        fields: [{ key: "label", label: "Label" }, { key: "href", label: "Link", help: "e.g. /about" }],
      } as ItemsDef,
    ],
  },
  {
    key: "social",
    title: "Social links",
    description: "Facebook, Twitter/X and YouTube get their own icons; anything else gets a globe.",
    fields: [
      {
        key: "links",
        label: "Links",
        type: "items",
        titleKey: "label",
        addLabel: "Add link",
        fields: [{ key: "label", label: "Name (Facebook, Twitter, YouTube…)" }, { key: "href", label: "URL" }],
      } as ItemsDef,
    ],
  },
  {
    key: "announcement",
    title: "Announcement bar",
    description: "Dismissible strip above the header on every public page.",
    fields: [
      { key: "enabled", label: "Show the announcement bar", type: "checkbox" },
      { key: "text", label: "Message" },
      { key: "linkLabel", label: "Link text" },
      { key: "href", label: "Link URL", help: "e.g. /demo-class" },
    ],
  },
];
