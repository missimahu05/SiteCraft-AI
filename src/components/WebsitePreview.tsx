import { useState } from 'react';
import type { BusinessProfile } from '../types';
import { ClaimBanner } from './ClaimBanner';
import { HeroSection } from './HeroSection';
import { MapPin, Clock, Phone, Star, ShieldCheck, CheckCircle2, Monitor, Tablet, Smartphone } from 'lucide-react';

interface WebsitePreviewProps {
  business: BusinessProfile;
  onClaimCheckout?: () => void;
  showDeviceBar?: boolean;
}

export const WebsitePreview = ({ business, onClaimCheckout, showDeviceBar = true }: WebsitePreviewProps) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const containerWidths = {
    desktop: 'w-full',
    tablet: 'max-w-3xl mx-auto shadow-2xl border-x border-zinc-800 rounded-xl overflow-hidden',
    mobile: 'max-w-sm mx-auto shadow-2xl border-x border-zinc-800 rounded-3xl overflow-hidden'
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden">
      {/* Top Device Bar */}
      {showDeviceBar && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-b border-zinc-800 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-zinc-300">
              https://{business.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-demo.vercel.app
            </span>
          </div>

          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded ${device === 'desktop' ? 'bg-zinc-800 text-white shadow-sm' : 'hover:text-white'}`}
              title="Desktop (1440px)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded ${device === 'tablet' ? 'bg-zinc-800 text-white shadow-sm' : 'hover:text-white'}`}
              title="Tablette (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded ${device === 'mobile' ? 'bg-zinc-800 text-white shadow-sm' : 'hover:text-white'}`}
              title="Smartphone (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Frame Container */}
      <div className="flex-1 overflow-y-auto bg-zinc-950 p-2 sm:p-4">
        <div className={`${containerWidths[device]} transition-all duration-300 bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-2xl`}>
          {/* 1. Claim Banner from Spec */}
          <ClaimBanner 
            businessName={business.title} 
            onClaim={onClaimCheckout}
          />

          {/* 2. Hero Section from Spec */}
          <HeroSection
            businessName={business.title}
            tagline={business.tagline}
            phone={business.phone}
            heroImage={business.photos[0] || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80'}
            rating={business.rating}
            reviewCount={business.reviewsCount}
          />

          {/* 3. Social Proof Bar */}
          <section className="bg-zinc-900/90 border-y border-zinc-800 py-6 px-6">
            <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-6 text-center text-xs sm:text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Établissement vérifié Google Maps</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-white">{business.rating} / 5</span>
                <span className="text-zinc-400">({business.reviewsCount} clients satisfaits)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Accueil & Devis immédiat</span>
              </div>
            </div>
          </section>

          {/* 4. Services / Offres */}
          <section id="reservation" className="py-16 px-6 max-w-5xl mx-auto">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Nos Spécialités & Services</h2>
              <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
                Découvrez nos prestations phares réalisées avec passion, rigueur et des ingrédients de première qualité.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {business.services.map((srv, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition flex flex-col justify-between group">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">{srv.name}</h3>
                      {srv.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          {srv.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-4">{srv.description}</p>
                  </div>
                  {srv.price && (
                    <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-zinc-500 font-mono">Tarif</span>
                      <span className="text-base font-bold text-white font-mono">{srv.price}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 5. Avis Clients */}
          <section className="py-14 px-6 bg-zinc-900/30 border-y border-zinc-900">
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest font-mono">Avis vérifiés</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Ce que disent nos clients</h2>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                {business.topReviews.map((rev, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-300 italic">"{rev.text}"</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800/80">
                      <span className="font-semibold text-zinc-300">{rev.author}</span>
                      <span>{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 6. Horaires & Contact */}
          <section className="py-16 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Nous Trouver & Horaires</h2>
              <div className="space-y-4 text-sm text-zinc-300">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-medium">Adresse</strong>
                    <p className="text-zinc-400">{business.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-medium">Téléphone</strong>
                    <a href={`tel:${business.phone}`} className="text-emerald-400 hover:underline">{business.phone}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block text-white font-medium">Heures d'ouverture</strong>
                    {business.openingHours.map((h, i) => (
                      <p key={i} className="text-xs text-zinc-400">{h}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Besoin d'un renseignement ?</h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xs">
                Appelez directement notre équipe pour une commande, un rendez-vous ou une question.
              </p>
              <a
                href={`tel:${business.phone.replace(/\s+/g, '')}`}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-500/25 transition"
              >
                Appeler le {business.phone}
              </a>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-8 px-6 bg-black border-t border-zinc-900 text-center text-xs text-zinc-500">
            <p>© 2026 {business.title} — Tous droits réservés. Site propulsé par SiteCraft-AI.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};
