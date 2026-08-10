// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export type BlogCategory =
  | "Technology"
  | "Cyber Security"
  | "Digital Marketing"
  | "Career Development"
  | "Design"
  | "Institute News";

export type BlogPost = {
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  date: string;
  readTime: string;
};

// TODO: Replace with your real blog articles, or manage these from the admin panel later.
export const blogPosts: BlogPost[] = [
  {
    slug: "5-in-demand-tech-skills-2026",
    title: "5 In-Demand Tech Skills to Learn in 2026",
    category: "Technology",
    excerpt:
      "From web development to AI-assisted design tools, here are the skills employers are actively hiring for this year — and where to start learning them.",
    date: "Jul 28, 2026",
    readTime: "5 min read",
  },
  {
    slug: "protect-business-cyber-threats",
    title: "How to Protect Your Business From Common Cyber Threats",
    category: "Cyber Security",
    excerpt:
      "Phishing emails, weak passwords, and unpatched software cause most small-business breaches. A practical checklist to close the easy gaps first.",
    date: "Jul 21, 2026",
    readTime: "6 min read",
  },
  {
    slug: "social-media-marketing-trends",
    title: "Social Media Marketing Trends Every Small Business Should Know",
    category: "Digital Marketing",
    excerpt:
      "Short-form video, community-first content, and paid ad targeting keep shifting. Here's what's actually moving the needle for local businesses right now.",
    date: "Jul 14, 2026",
    readTime: "4 min read",
  },
  {
    slug: "student-to-professional-portfolio",
    title: "From Student to Professional: Building Your First Portfolio",
    category: "Career Development",
    excerpt:
      "A strong portfolio matters more than a long resume when you're starting out. What to include, what to leave out, and how to present it to employers.",
    date: "Jul 7, 2026",
    readTime: "5 min read",
  },
  {
    slug: "graphic-design-principles-beginners",
    title: "Principles of Good Graphic Design for Beginners",
    category: "Design",
    excerpt:
      "Color, contrast, alignment, and hierarchy — the four fundamentals that instantly make your designs look more professional, explained simply.",
    date: "Jun 30, 2026",
    readTime: "6 min read",
  },
  {
    slug: "fsti-new-batch-enrollment",
    title: "FSTI Announces New Batch Enrollment for MS Office & Web Development",
    category: "Institute News",
    excerpt:
      "Admissions are now open for our upcoming batch. Limited seats, flexible morning and evening timings, and certificates on completion.",
    date: "Jun 23, 2026",
    readTime: "3 min read",
  },
  {
    slug: "spoken-english-job-seekers",
    title: "Why Every Job Seeker Needs Spoken English Skills",
    category: "Career Development",
    excerpt:
      "Strong technical skills can still lose out at interview stage without confident communication. Why spoken English is worth prioritizing early.",
    date: "Jun 16, 2026",
    readTime: "4 min read",
  },
  {
    slug: "ai-tools-for-designers-2026",
    title: "AI Tools Every Designer Should Try in 2026",
    category: "Design",
    excerpt:
      "AI won't replace designers, but it will change your workflow. A look at tools worth adding to your process, and where human judgment still wins.",
    date: "Jun 9, 2026",
    readTime: "5 min read",
  },
];

export const blogCategoryCounts: { label: BlogCategory; count: number }[] = (
  ["Technology", "Cyber Security", "Digital Marketing", "Career Development", "Design", "Institute News"] as BlogCategory[]
).map((label) => ({
  label,
  count: blogPosts.filter((p) => p.category === label).length,
}));

export const popularPosts: BlogPost[] = [
  blogPosts[0],
  blogPosts[3],
  blogPosts[5],
];