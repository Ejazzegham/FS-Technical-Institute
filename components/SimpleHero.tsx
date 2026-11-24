export default function SimpleHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative bg-gradient-to-br from-navy via-navy to-navy-dark overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-dark" />
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 md:py-20 text-center">
        <p className="text-gold text-xs font-bold tracking-widest mb-3">{eyebrow}</p>
        <h1 className="font-display font-bold text-white text-3xl md:text-4xl leading-tight mb-4">{title}</h1>
        <p className="text-white/65 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">{description}</p>
      </div>
    </section>
  );
}
