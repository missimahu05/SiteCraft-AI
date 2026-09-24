import { useState } from 'react';
import type { BusinessProfile } from '../types';
import { ClaimBanner } from './ClaimBanner';
import {
  MapPin,
  Clock,
  Phone,
  Star,
  Monitor,
  Tablet,
  Smartphone,
  Check,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';

interface WebsitePreviewProps {
  business: BusinessProfile;
  onClaimCheckout?: () => void;
  showDeviceBar?: boolean;
}

export const WebsitePreview = ({ business, onClaimCheckout, showDeviceBar = true }: WebsitePreviewProps) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const containerWidths = {
    desktop: 'w-full',
    tablet: 'max-w-2xl mx-auto shadow-2xl border-[10px] border-slate-800 rounded-[32px] overflow-hidden my-4',
    mobile: 'max-w-[390px] mx-auto shadow-2xl border-[12px] border-slate-900 rounded-[44px] overflow-hidden my-4 relative',
  };

  const slug = business.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const cloudflareUrl = business.cloudflareUrl || `https://${slug}.pages.dev`;
  const city = business.city || 'Bénin';

  const servicesList =
    business.services && business.services.length > 0
      ? business.services
      : [
          {
            name: 'Prestation Principale & Finitions',
            description: 'Intervention sur-mesure, respect rigoureux des normes et préparation minutieuse.',
            badge: 'Finition Pro',
          },
          {
            name: 'Rénovation & Travaux Spécifiques',
            description: 'Traitement de haute durabilité avec matériaux certifiés et équipements professionnels.',
            badge: 'Haute Résistance',
          },
          {
            name: 'Conseils & Accompagnement Déco',
            description: 'Étude personnalisée de votre projet avec devis transparent et sans mauvaise surprise.',
            badge: 'Sur Mesure',
          },
        ];

  const whyUsItems = [
    { title: `Établissement Local (${city})`, desc: 'Proximité immédiate et réactivité garantie.' },
    { title: 'Matériaux Certifiés A+', desc: 'Normes écologiques et qualité professionnelle.' },
    { title: 'Chantier Soigné & Nettoyé', desc: 'Protection intégrale des sols et propreté exemplaire.' },
    { title: 'Devis Ferme & Précis', desc: 'Engagement sur les prix et respect strict des délais.' },
  ];

  return (
    <div className="flex flex-col h-full glass-card overflow-hidden shadow-xl border border-white/80">
      {/* Top Device & Cloudflare URL Bar */}
      {showDeviceBar && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-slate-100/90 border-b border-slate-200 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">
              Cloudflare Anycast Edge
            </span>
            <span className="font-mono text-[#0F172A] font-semibold text-xs truncate max-w-xs sm:max-w-md flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-600" />
              {cloudflareUrl}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-outfit ${
                device === 'desktop' ? 'bg-[#0F172A] text-white shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Desktop (1440px)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-outfit ${
                device === 'tablet' ? 'bg-[#0F172A] text-white shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Tablette (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablette</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-outfit ${
                device === 'mobile' ? 'bg-[#0F172A] text-white shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Smartphone (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile (390px)</span>
            </button>
          </div>
        </div>
      )}

      {/* Frame Container */}
      <div className="flex-1 overflow-y-auto bg-slate-100/60 p-2 sm:p-5">
        <div className={`${containerWidths[device]} transition-all duration-300 bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200`}>
          {/* Mobile dynamic island / speaker simulation */}
          {device === 'mobile' && (
            <div className="bg-slate-900 pt-3 pb-2 px-6 flex justify-between items-center text-[10px] text-white font-mono">
              <span>9:41</span>
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* 1. Claim Banner */}
          <ClaimBanner businessName={business.title} onClaim={onClaimCheckout} />

          {/* 2. Scrolled Header */}
          <div className="border-b border-slate-200 px-5 py-3.5 flex items-center justify-between bg-white sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-outfit font-black text-sm shadow-sm">
                {business.title.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#EA580C] font-bold block uppercase tracking-wider">
                  Établissement Certifié à {city}
                </span>
                <span className="font-outfit font-black text-[#0F172A] text-sm uppercase line-clamp-1">
                  {business.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href={`tel:${business.phone}`}
                className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-bold text-[#0F172A] bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-200 transition"
              >
                <Phone className="w-3.5 h-3.5 text-[#EA580C]" />
                {business.phone}
              </a>
              <button onClick={onClaimCheckout} className="btn-primary text-xs !py-1.5 !px-3.5 !rounded-xl">
                Devis Gratuit
              </button>
            </div>
          </div>

          {/* 3. Hero Section */}
          <div className="p-6 sm:p-12 bg-gradient-to-b from-slate-50 to-white space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C] text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interventions Rapides à {city} & Région</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-outfit font-black tracking-tight text-[#0F172A] leading-tight">
              {business.title} <br className="hidden sm:inline" />
              <span className="text-[#EA580C]">à {city}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Excellence reconnue, respect strict des délais et finitions de premier ordre.
              Bénéficiez d'une intervention soignée et d'un accompagnement personnalisé pour votre projet.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onClaimCheckout}
                className="btn-primary text-xs !py-3 !px-5 !rounded-xl flex items-center gap-2"
              >
                <span>Demander mon devis gratuit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={`tel:${business.phone}`}
                className="btn-secondary text-xs !py-3 !px-5 !rounded-xl flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#EA580C]" />
                <span>{business.phone}</span>
              </a>
            </div>
          </div>

          {/* 4. Trust Bar */}
          <div className="py-5 px-6 bg-[#0F172A] text-white">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-outfit font-black text-amber-400">+10 Ans</div>
                <div className="text-[10px] text-slate-300 font-medium">Expérience locale</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-outfit font-black text-white">100%</div>
                <div className="text-[10px] text-slate-300 font-medium">Devis sous 24h</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-outfit font-black text-amber-400">{business.rating} ★</div>
                <div className="text-[10px] text-slate-300 font-medium">{business.reviewsCount} avis certifiés</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-outfit font-black text-white">Garantie</div>
                <div className="text-[10px] text-slate-300 font-medium">Sérénité totale</div>
              </div>
            </div>
          </div>

          {/* 5. Services Grid */}
          <div className="p-6 sm:p-10 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-outfit uppercase font-bold text-[#EA580C] tracking-widest block">
                Nos Prestations
              </span>
              <h3 className="text-xl sm:text-2xl font-outfit font-black text-[#0F172A]">
                Prestations & <span className="text-[#EA580C]">Savoir-Faire</span>
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {servicesList.map((service, idx) => (
                <div key={idx} className="glass-card p-5 space-y-3 relative group">
                  <span className="text-xs font-mono font-bold text-[#EA580C]">0{idx + 1}</span>
                  <h4 className="font-outfit font-black text-sm uppercase text-[#0F172A]">{service.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{service.description}</p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-[#EA580C] font-bold">
                      {service.badge || 'Devis gratuit'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. WhyUs Section */}
          <div className="p-6 sm:p-10 bg-slate-50 border-y border-slate-200 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-outfit uppercase font-bold text-[#EA580C] tracking-widest block">
                Pourquoi Nous Choisir
              </span>
              <h3 className="text-xl sm:text-2xl font-outfit font-black text-[#0F172A]">
                Nos Engagements <span className="text-[#EA580C]">Qualité</span>
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {whyUsItems.map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-sm">
                  <Check className="w-4 h-4 text-[#EA580C]" />
                  <h4 className="font-outfit font-bold text-xs uppercase text-[#0F172A]">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Reviews Section */}
          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-outfit uppercase font-bold text-[#EA580C] tracking-widest block">
                  Avis Vérifiés
                </span>
                <h3 className="text-xl sm:text-2xl font-outfit font-black text-[#0F172A]">
                  Ce que disent <span className="text-[#EA580C]">nos clients</span>
                </h3>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#0F172A] font-outfit font-bold text-xs">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{business.rating} / 5 Google Maps</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {(business.topReviews || []).map((r, i) => (
                <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex text-amber-400 text-xs">★★★★★</div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">"{r.text}"</p>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                    <span className="font-bold text-[#0F172A]">{r.author}</span>
                    <span className="text-slate-400 font-mono">{r.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Contact Direct */}
          <div className="p-6 sm:p-10 bg-[#0F172A] text-white">
            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                  Contact Direct
                </span>
                <h3 className="text-xl sm:text-2xl font-outfit font-black uppercase leading-tight">
                  Prêt à démarrer votre projet à <span className="text-orange-400">{city}</span> ?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Intervention rapide, devis détaillé sous 24h et conseils avisés.
                </p>
                <div className="space-y-1.5 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" /> {business.address}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" /> {business.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-orange-400 shrink-0" /> Lun - Sam : 07h30 - 19h00
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl text-slate-800 space-y-2.5 shadow-xl">
                <h4 className="font-outfit font-bold uppercase text-xs text-[#0F172A]">Devis gratuit en ligne</h4>
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                />
                <input
                  type="tel"
                  placeholder="Votre téléphone"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                />
                <textarea
                  placeholder="Détaillez brièvement votre besoin..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                />
                <button
                  onClick={onClaimCheckout}
                  className="w-full py-2.5 rounded-lg bg-[#EA580C] text-white font-outfit font-black uppercase text-xs tracking-wider hover:bg-[#C2410C] transition cursor-pointer"
                >
                  Envoyer ma demande
                </button>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="p-3 bg-slate-900 text-center text-[10px] text-slate-400 font-mono">
            Propulsé par SiteCraft.AI • Déployé sur Cloudflare Anycast CDN
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsitePreview;
