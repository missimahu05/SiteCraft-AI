import { useState } from 'react';
import type { BusinessProfile } from '../types';
import { ClaimBanner } from './ClaimBanner';
import { MapPin, Clock, Phone, Star, Monitor, Tablet, Smartphone, Check, ArrowRight } from 'lucide-react';

interface WebsitePreviewProps {
  business: BusinessProfile;
  onClaimCheckout?: () => void;
  showDeviceBar?: boolean;
}

export const WebsitePreview = ({ business, onClaimCheckout, showDeviceBar = true }: WebsitePreviewProps) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const containerWidths = {
    desktop: 'w-full',
    tablet: 'max-w-3xl mx-auto shadow-2xl border-x border-[#E0E3EF] rounded-2xl overflow-hidden',
    mobile: 'max-w-sm mx-auto shadow-2xl border-x border-[#E0E3EF] rounded-3xl overflow-hidden'
  };

  const slug = business.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const cloudflareUrl = business.cloudflareUrl || `https://${slug}.pages.dev`;
  const city = business.city || 'Bénin';

  // Services tailored to category
  const servicesList = business.services && business.services.length > 0 ? business.services : [
    {
      name: 'Peinture Murs & Plafonds',
      description: 'Préparation méticuleuse, enduisage et application 2 couches finitions mates, satinées ou velours.',
      badge: 'Finition Pro'
    },
    {
      name: 'Boiseries & Menuiseries',
      description: 'Portes, plinthes, fenêtres et escaliers traités avec primaires d\'accrochage haute durabilité.',
      badge: 'Haute Résistance'
    },
    {
      name: 'Revêtements & Décoration',
      description: 'Pose soignée de revêtements modernes, papiers intissés et peintures décoratives sur mesure.',
      badge: 'Sur Mesure'
    }
  ];

  const whyUsItems = [
    { title: `Artisan 100% Local (${city})`, desc: 'Intervention directe et proximité sans intermédiaire.' },
    { title: 'Matériaux Certifiés A+', desc: 'Produits professionnels respectueux de votre santé.' },
    { title: 'Chantier Protégé & Propre', desc: 'Bâchage intégral et nettoyage complet après travaux.' },
    { title: 'Devis Ferme & Transparent', desc: 'Le prix validé est le prix payé, sans mauvaise surprise.' }
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-[#E0E3EF] shadow-card overflow-hidden">
      {/* Top Device & Cloudflare URL Bar */}
      {showDeviceBar && (
        <div className="flex items-center justify-between px-6 py-3 bg-[#F4F2EE] border-b border-[#E0E3EF] text-xs text-[#6B7299]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 font-mono text-[10px] font-bold">
              Cloudflare Anycast
            </span>
            <span className="font-mono text-[#1A2550] font-semibold text-xs truncate max-w-xs sm:max-w-md">
              {cloudflareUrl}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E0E3EF] shadow-sm">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-lg transition cursor-pointer ${device === 'desktop' ? 'bg-[#1A2550] text-white shadow-sm font-bold' : 'text-[#6B7299] hover:text-[#1A2550]'}`}
              title="Desktop (1440px)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded-lg transition cursor-pointer ${device === 'tablet' ? 'bg-[#1A2550] text-white shadow-sm font-bold' : 'text-[#6B7299] hover:text-[#1A2550]'}`}
              title="Tablette (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-lg transition cursor-pointer ${device === 'mobile' ? 'bg-[#1A2550] text-white shadow-sm font-bold' : 'text-[#6B7299] hover:text-[#1A2550]'}`}
              title="Smartphone (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Frame Container */}
      <div className="flex-1 overflow-y-auto bg-[#F4F2EE]/40 p-3 sm:p-5">
        <div className={`${containerWidths[device]} transition-all duration-300 bg-white border border-[#E0E3EF] rounded-3xl overflow-hidden shadow-card`}>
          {/* 1. Claim Banner */}
          <ClaimBanner 
            businessName={business.title} 
            onClaim={onClaimCheckout}
          />

          {/* 2. Scrolled Header (peintre-react style) */}
          <div className="border-b border-[#E0E3EF] px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1A2550] text-white flex items-center justify-center font-outfit font-black text-sm">
                {business.title.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#C41641] font-bold block uppercase tracking-wider">
                  Artisan Qualifié à {city}
                </span>
                <span className="font-outfit font-black text-[#1A2550] text-sm uppercase">
                  {business.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a href={`tel:${business.phone}`} className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-bold text-[#1A2550] bg-[#F4F2EE] px-3 py-1.5 rounded-full border border-[#E0E3EF]">
                <Phone className="w-3.5 h-3.5 text-[#C41641]" />
                {business.phone}
              </a>
              <button onClick={onClaimCheckout} className="btn-primary text-xs !py-2 !px-4 !rounded-xl">
                Devis Gratuit
              </button>
            </div>
          </div>

          {/* 3. Hero Section (peintre-react signature style) */}
          <div className="p-8 sm:p-14 bg-gradient-to-b from-[#FAF9F6] to-white space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FDF1F3] border border-[#C41641]/20 text-[#C41641] text-xs font-mono font-bold">
              <span>✦</span> <span>Interventions Rapides à {city} & Environs</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-outfit font-black italic tracking-tighter uppercase text-[#1A2550] leading-[1.08]">
              {business.title} <br className="hidden sm:inline" />
              <span className="text-[#C41641]">à {city}</span>
            </h1>

            <p className="text-sm sm:text-base text-[#6B7299] max-w-2xl leading-relaxed">
              Excellence artisanale, respect scrupuleux des délais et finitions haut de gamme. Recevez votre devis détaillé et sans engagement sous 24h.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={onClaimCheckout} className="btn-primary text-xs !py-3 !px-6 !rounded-2xl flex items-center gap-2">
                <span>Demander mon devis gratuit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a href={`tel:${business.phone}`} className="btn-ghost text-xs !py-3 !px-6 !rounded-2xl flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C41641]" />
                <span>{business.phone}</span>
              </a>
            </div>
          </div>

          {/* 4. Trust Bar */}
          <div className="py-6 px-6 bg-[#1A2550] text-white border-y border-[#1A2550]">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-outfit font-black text-[#FBBF24] italic">+15 Ans</div>
                <div className="text-[11px] text-zinc-300 font-medium">Expérience éprouvée</div>
              </div>
              <div>
                <div className="text-2xl font-outfit font-black text-white italic">100%</div>
                <div className="text-[11px] text-zinc-300 font-medium">Devis gratuit sous 24h</div>
              </div>
              <div>
                <div className="text-2xl font-outfit font-black text-[#FBBF24] italic">{business.rating} ★</div>
                <div className="text-[11px] text-zinc-300 font-medium">{business.reviewsCount} avis certifiés</div>
              </div>
              <div>
                <div className="text-2xl font-outfit font-black text-white italic">10 Ans</div>
                <div className="text-[11px] text-zinc-300 font-medium">Garantie & Sérénité</div>
              </div>
            </div>
          </div>

          {/* 5. Services Bento Grid */}
          <div className="p-8 sm:p-12 space-y-8">
            <div className="space-y-1">
              <p className="section-label">Nos Prestations</p>
              <h3 className="text-2xl font-outfit font-black italic uppercase text-[#1A2550]">
                Prestations & <span className="text-[#C41641]">Savoir-Faire</span>
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {servicesList.map((service, idx) => (
                <div key={idx} className="card-peintre p-6 space-y-3 relative group">
                  <span className="text-xs font-mono font-bold text-[#C41641]">0{idx + 1}</span>
                  <h4 className="font-outfit font-black text-base uppercase text-[#1A2550]">{service.name}</h4>
                  <p className="text-xs text-[#6B7299] leading-relaxed">{service.description}</p>
                  <div className="pt-2 border-t border-[#F0F1F5] flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-[#C41641] font-bold">{service.badge || 'Devis gratuit'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#1A2550] group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. WhyUs Section */}
          <div className="p-8 sm:p-12 bg-[#FAF9F6] border-y border-[#E0E3EF] space-y-8">
            <div className="space-y-1">
              <p className="section-label">Pourquoi nous choisir</p>
              <h3 className="text-2xl font-outfit font-black italic uppercase text-[#1A2550]">
                Nos Engagements <span className="text-[#C41641]">Qualité</span>
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {whyUsItems.map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-[#E0E3EF] space-y-2">
                  <Check className="w-4 h-4 text-[#C41641]" />
                  <h5 className="font-outfit font-bold text-xs uppercase text-[#1A2550]">{item.title}</h5>
                  <p className="text-[11px] text-[#6B7299] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Reviews Section */}
          <div className="p-8 sm:p-12 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-label">Avis Clients</p>
                <h3 className="text-2xl font-outfit font-black italic uppercase text-[#1A2550]">
                  Ce que disent <span className="text-[#C41641]">nos clients</span>
                </h3>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#1A2550] font-outfit font-bold text-xs">
                <Star className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" />
                <span>{business.rating} / 5 Google Maps</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {(business.topReviews || []).map((r, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-[#E0E3EF] shadow-sm space-y-3">
                  <div className="flex text-[#FBBF24] text-xs">★★★★★</div>
                  <p className="text-xs text-[#2D3553] italic leading-relaxed">"{r.text}"</p>
                  <div className="pt-2 border-t border-[#F0F1F5] flex justify-between items-center text-[11px]">
                    <span className="font-bold text-[#1A2550]">{r.author}</span>
                    <span className="text-[#6B7299] font-mono">{r.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Contact & Quote Form Card */}
          <div className="p-8 sm:p-12 bg-[#1A2550] text-white">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-[#C41641] uppercase tracking-wider">Contact Direct</span>
                <h3 className="text-2xl sm:text-3xl font-outfit font-black uppercase italic leading-tight">
                  Prêt à démarrer votre chantier à <span className="text-[#C41641]">{city}</span> ?
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Intervention rapide, conseils personnalisés et devis gratuit garanti sous 24h.
                </p>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#C41641]" /> {business.address}</div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#C41641]" /> {business.phone}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#C41641]" /> Lun - Sam : 07h30 - 19h00</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl text-[#2D3553] space-y-3 shadow-xl">
                <h4 className="font-outfit font-bold uppercase text-xs text-[#1A2550]">Demande de devis rapide</h4>
                <input type="text" placeholder="Votre nom" className="w-full px-3 py-2 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-xs" />
                <input type="tel" placeholder="Votre numéro" className="w-full px-3 py-2 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-xs" />
                <textarea placeholder="Votre projet..." rows={2} className="w-full px-3 py-2 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-xs" />
                <button onClick={onClaimCheckout} className="w-full py-2.5 rounded-xl bg-[#C41641] text-white font-outfit font-black uppercase text-xs tracking-wider">
                  Envoyer ma demande
                </button>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="p-4 bg-[#0F163A] text-center text-[10px] text-zinc-400 font-mono">
            Propulsé par SiteCraft-AI • Hébergé sur le CDN Cloudflare Anycast Edge
          </div>
        </div>
      </div>
    </div>
  );
};
