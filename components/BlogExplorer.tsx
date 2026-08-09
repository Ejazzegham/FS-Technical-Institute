"use client";

import { useMemo, useState } from "react";
import {
  LayoutGrid,
  Cpu,
  Users2,
  Palette,
  TrendingUp,
  Search,
  User,
  Clock,
  ArrowRight,
} from "lucide-react";
import { blogPosts, blogCategoryCounts, popularPosts, type BlogCategory } from "@/lib/data";

const filterCategories: { label: "All Posts" | BlogCategory; icon: typeof Cpu }[] = [
  { label: "All Posts", icon: LayoutGrid },
  { label: "Technology", icon: Cpu },
  { label: "Career Development", icon: Users2 },
  { label: "Design", icon: Palette },
  { label: "Digital Marketing", icon: TrendingUp },
];

const categoryColors: Record<BlogCategory, string> = {
  Technology: "text-sky-700",
  "Cyber Security": "text-teal-700",
  "Digital Marketing": "text-fuchsia-700",
  "Career Development": "text-amber-700",
  Design: "text-purple-700",
  "Institute News": "text-indigo-700",
};

const gradients: Record<BlogCategory, string> = {
  Technology: "from-sky-900 to-slate-900",
  "Cyber Security": "from-teal-900 to-slate-900",
  "Digital Marketing": "from-fuchsia-900 to-slate-900",
  "Career Development": "from-amber-900 to-slate-900",
  Design: "from-purple-900 to-slate-900",
  "Institute News": "from-indigo-900 to-slate-900",
};

export default function BlogExplorer() {
  const [active, setActive] = useState<"All Posts" | BlogCategory>("All Posts");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return blogPosts.filter((p) => {
      const matchesCategory = active === "All Posts" || p.category === active;
      const matchesQuery =
        query.trim() === "" || p.title.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [active, query]);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-3">
          {filterCategories.map((cat) => {
            const isActive = active === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActive(cat.label)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-navy text-white"
                    : "bg-white text-navy/70 border border-black/10 hover:border-gold hover:text-navy"
                }`}
              >
                <cat.icon size={15} className={isActive ? "text-gold" : "text-navy/50"} />
                {cat.label}
              </button>
            );
          })}
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="input pl-9"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-navy/50 text-sm py-10">
              No articles match your search.
            </p>
          )}
          {filtered.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-xl border border-black/5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden"
            >
              <div className={`h-36 bg-gradient-to-br ${gradients[post.category]}`} />
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs mb-2">
                  <span className={`font-semibold uppercase tracking-wide ${categoryColors[post.category]}`}>
                    {post.category}
                  </span>
                  <span className="text-navy/30">•</span>
                  <span className="text-navy/40">{post.date}</span>
                </div>
                <h3 className="font-display font-bold text-navy text-base mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-navy/55 leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-navy/40 mb-3">
                  <span className="flex items-center gap-1">
                    <User size={12} /> By Admin
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold-dark transition-colors"
                >
                  Read More <ArrowRight size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <BlogSidebar />
      </div>
    </>
  );
}

function BlogSidebar() {
  return (
    <aside className="space-y-6">
      <div className="bg-white rounded-xl border border-black/5 shadow-sm p-6">
        <h3 className="font-display font-bold text-navy text-lg mb-4">Categories</h3>
        <ul className="space-y-2.5 text-sm">
          {blogCategoryCounts.map((c) => (
            <li key={c.label} className="flex items-center justify-between text-navy/65">
              <span>{c.label}</span>
              <span className="text-navy/35">{c.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl border border-black/5 shadow-sm p-6">
        <h3 className="font-display font-bold text-navy text-lg mb-4">Popular Posts</h3>
        <ul className="space-y-4">
          {popularPosts.map((p) => (
            <li key={p.title} className="flex gap-3">
              <span className="w-14 h-14 rounded-lg bg-gradient-to-br from-navy to-navy-dark shrink-0" />
              <div>
                <p className="text-sm font-semibold text-navy leading-snug">{p.title}</p>
                <p className="text-xs text-navy/40 mt-1">{p.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-navy rounded-xl p-6">
        <h3 className="font-display font-bold text-white text-lg mb-2">
          Subscribe to Our Newsletter
        </h3>
        <p className="text-white/55 text-sm mb-4">
          Get the latest updates, tips, and news delivered straight to your inbox.
        </p>
        <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="input"
          />
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-navy font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Subscribe <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </aside>
  );
}
