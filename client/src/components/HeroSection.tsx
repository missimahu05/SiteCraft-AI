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
    <section className="relative min-h-[75vh] flex items-center justify-center bg-slate-50 text-slate-800 px-6 overflow-hidden">
      {/* Background soft image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-15 filter blur-[1px] scale-105" 
        style={{ backgroundImage: `url(${heroImage})` }} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-slate-50/80" />

      <div className="relative z-10 max-w-4xl text-center space-y-6 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C] text-xs font-outfit font-black tracking-wider uppercase shadow-sm">
          ★ {rating.toFixed(1)} / 5 ({reviewCount} avis certifiés Google Maps)
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-outfit font-black tracking-tight uppercase italic text-[#0F172A] leading-none">
          {businessName}
        </h1>

        <p className="text-base sm:text-xl text-[#2D3553] max-w-2xl mx-auto font-normal leading-relaxed">
          {tagline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-3">
          <a 
            href={`tel:${phone.replace(/\s+/g, '')}`} 
            className="btn-primary text-sm !py-3.5 !px-8"
          >
            Appeler en 1 Clic ({phone})
          </a>
          <a 
            href="#reservation" 
            className="btn-ghost text-sm !py-3.5 !px-8"
          >
            Consulter les prestations
          </a>
        </div>
      </div>
    </section>
  );
};
