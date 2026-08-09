import BlogExplorer from "@/components/BlogExplorer";
import { Newspaper } from "lucide-react";

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy overflow-hidden rounded-b-[3rem]">
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-gold-dark via-gold to-gold-dark" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 md:py-10 relative z-10">
          <p className="text-white/50 text-xs mb-4">Home &gt; Blog</p>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="font-display font-extrabold text-white text-3xl md:text-4xl mb-3">Our Blog</h1>
              <p className="text-gold font-semibold mb-4">Insights. Ideas. Inspiration.</p>
              <p className="text-white/60 leading-relaxed max-w-md">
                Stay updated with the latest trends, tutorials, and insights from the world
                of technology and education.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-gradient-to-br from-navy-light to-navy-dark border border-white/10 flex items-center justify-center">
              <Newspaper size={56} className="text-white/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <BlogExplorer />
      </section>
    </>
  );
}
