interface HeroProps {
  businessName: string;
  tagline: string;
  phone: string;
  heroImage: string;
  rating: number;
  reviewCount: number;
}

export const HeroSection = ({
  businessName,
  tagline,
  phone,
  heroImage,
  rating,
  reviewCount
}: HeroProps) => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-zinc-950 text-white px-6">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-[1px]" 
        style={{ backgroundImage: `url(${heroImage})` }} 
      />
      <div className="relative z-10 max-w-4xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
          ★ {rating.toFixed(1)} / 5 ({reviewCount} avis Google certifiés)
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          {businessName}
        </h1>
        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-light">
          {tagline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a 
            href={`tel:${phone.replace(/\s+/g, '')}`} 
            className="px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-semibold text-white transition-all shadow-lg shadow-emerald-500/25"
          >
            Appeler directement ({phone})
          </a>
          <a 
            href="#reservation" 
            className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-white backdrop-blur border border-white/10 transition-all"
          >
            Consulter les offres & horaires
          </a>
        </div>
      </div>
    </section>
  );
};
