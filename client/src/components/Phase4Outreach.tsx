import { useState, useEffect } from 'react';
import type { BusinessProfile } from '../types';
import { MotionReveal } from './motion/MotionReveal';
import {
  Copy,
  Check,
  Mail,
  MessageSquare,
  PhoneCall,
  ArrowRight,
  ArrowLeftRight,
  Sparkles,
  Send,
  Star
} from 'lucide-react';

interface Phase4Props {
  selectedLead: BusinessProfile;
  leads: BusinessProfile[];
  onSelectLead: (lead: BusinessProfile) => void;
  onNavigateToClosing: (lead: BusinessProfile) => void;
}

export const Phase4Outreach = ({
  selectedLead,
  leads,
  onSelectLead,
  onNavigateToClosing,
}: Phase4Props) => {
  const [activeLead, setActiveLead] = useState<BusinessProfile>(selectedLead);
  const [channel, setChannel] = useState<'email' | 'whatsapp' | 'sms'>('email');
  const [copied, setCopied] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  useEffect(() => {
    setActiveLead(selectedLead);
  }, [selectedLead]);

  const handleLeadChange = (leadId: string) => {
    const found = leads.find((l) => l.id === leadId);
    if (found) {
      setActiveLead(found);
      onSelectLead(found);
    }
  };

  const cleanSubdomain = activeLead.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const demoUrl = activeLead.cloudflareUrl || activeLead.deploymentUrl || `https://${cleanSubdomain}.pages.dev`;

  const emailSubject = `Démo interactive de votre nouveau site : ${activeLead.title}`;
  const emailBody = `Bonjour l'équipe de ${activeLead.title},

J'ai remarqué l'excellente réputation de votre établissement sur Google Maps (${activeLead.rating.toFixed(1)}/5 étoiles sur ${activeLead.reviewsCount} avis certifiés). C'est un gage précieux de savoir-faire.

En consultant votre présence en ligne, j'ai constaté que ${activeLead.website ? "votre site actuel ne mettait pas suffisamment en valeur vos services sur mobile" : "vous n'aviez pas encore de site web dédié"}.

Pour vous faire gagner du temps, notre agence a pré-généré une version moderne, responsive et prête à l'emploi :

👉 Démonstration en direct : ${demoUrl}

Ce prototype intègre déjà :
• Vos coordonnées complètes et vos meilleurs avis Google Maps certifiés.
• Un bouton d'appel direct en 1 clic pour optimiser les prises de contact.
• Une vitesse de chargement instantanée sur smartphone (iOS & Android).

Si ce résultat vous convient, nous pouvons connecter votre nom de domaine officiel sous 24h pour un forfait unique de 300 000 FCFA (490 € - sans aucun abonnement mensuel).

Pouvons-nous en échanger 5 minutes cette semaine ?

Bien cordialement,
L'équipe SiteCraft.AI
Agence Digitale Autonome
+229 97 00 12 34`;

  const whatsappMessage = `Bonjour l'équipe de ${activeLead.title} ! Félicitations pour vos ${activeLead.reviewsCount} avis Google certifiés (${activeLead.rating}★). Nous avons pré-généré une vitrine démo moderne de votre activité pour booster vos appels : ${demoUrl} . Dites-nous ce que vous en pensez !`;

  const smsMessage = `Bonjour ${activeLead.title}, découvrez la nouvelle version moderne de votre site web générée par notre agence : ${demoUrl} (300 000 FCFA tout compris, sans abonnement). Discutons-en 5 min !`;

  const currentContent = channel === 'email' ? emailBody : channel === 'whatsapp' ? whatsappMessage : smsMessage;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMailClient = () => {
    const mailto = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailto, '_blank');
  };

  const handleOpenWhatsapp = () => {
    const cleanPhone = (activeLead.phone || '').replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, '_blank');
  };

  const handleOpenSms = () => {
    const cleanPhone = (activeLead.phone || '').replace(/[^0-9]/g, '');
    const smsUrl = `sms:${cleanPhone}?body=${encodeURIComponent(smsMessage)}`;
    window.open(smsUrl, '_blank');
  };

  const handleSliderMove = (clientX: number, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <MotionReveal direction="up" delay={0.05}>
        <div className="glass-card p-6 sm:p-8 relative overflow-hidden border border-white/80 shadow-md">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-pink-500/10 via-rose-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#EA580C] text-xs font-outfit font-extrabold uppercase tracking-widest">
                <Send className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Phase 04 • High-Conversion Outreach Automation</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-outfit font-black text-[#0F172A] tracking-tight uppercase">
                Mockup Automation & <span className="text-[#EA580C]">Prospection Multicanal</span>
              </h2>

              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                Comparateur visuel « Avant / Après » interactif et messages de prospection ultra-personnalisés
                fondés sur la preuve sociale Google Maps certifiée et le lien de démonstration en direct.
              </p>
            </div>

            {/* Lead Switcher Pill */}
            <div className="flex items-center gap-3 shrink-0 bg-slate-100/90 p-2 rounded-2xl border border-slate-200 shadow-sm">
              <label htmlFor="outreach-lead-select" className="text-xs text-slate-600 font-outfit font-bold uppercase tracking-wider pl-2">
                Prospect :
              </label>
              <select
                id="outreach-lead-select"
                value={activeLead.id}
                onChange={(e) => handleLeadChange(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-outfit font-bold text-[#0F172A] focus:outline-none focus:border-[#EA580C] cursor-pointer shadow-sm"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </MotionReveal>

      {/* Grid: Split Mockup vs Message Center */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Before / After Split (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <MotionReveal direction="up" delay={0.1}>
            <div className="glass-card p-5 sm:p-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2 text-xs font-outfit text-[#0F172A]">
                  <ArrowLeftRight className="w-4 h-4 text-[#EA580C]" />
                  <span className="font-extrabold uppercase tracking-wide">Comparateur Visuel « Avant / Après »</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Glissez pour comparer</span>
              </div>

              {/* Interactive Split View Container with touch support */}
              <div
                className="relative aspect-[16/10] rounded-2xl overflow-hidden select-none border border-slate-200 shadow-md bg-slate-100 cursor-ew-resize group"
                onMouseMove={(e) => handleSliderMove(e.clientX, e.currentTarget)}
                onTouchMove={(e) => {
                  if (e.touches.length > 0) {
                    handleSliderMove(e.touches[0].clientX, e.currentTarget);
                  }
                }}
              >
                {/* After: Modern Generated Website (Background) */}
                <div className="absolute inset-0 bg-white p-6 sm:p-8 flex flex-col justify-center items-center text-center">
                  <div className="w-full max-w-sm p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-lg space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA] tracking-wider">
                      <Sparkles className="w-3 h-3" /> Nouveau Site 2026 (SiteCraft.AI)
                    </span>
                    <h4 className="text-lg font-outfit font-black text-[#0F172A] leading-snug line-clamp-1">
                      {activeLead.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{activeLead.tagline}</p>
                    <div className="flex justify-center items-center gap-2 pt-2">
                      <span className="px-3.5 py-1.5 rounded-xl bg-[#EA580C] text-white font-outfit font-bold text-xs shadow-md uppercase">
                        Appel 1-Clic
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold font-outfit flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {activeLead.rating} / 5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Before: Old Outdated Site / Missing (Clipped overlay) */}
                <div
                  className="absolute inset-0 bg-[#0A0F1D] border-r-2 border-[#EA580C] flex flex-col justify-center items-center text-center p-6 text-white transition-none"
                  style={{ width: `${sliderPosition}%`, overflow: 'hidden' }}
                >
                  <div className="w-full max-w-sm p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2.5 shrink-0">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 font-mono uppercase tracking-wider">
                      {activeLead.website ? 'ANCIEN SITE OBSOLÈTE' : 'AUCUN SITE WEB'}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {activeLead.website
                        ? 'Design figé, non-responsive, perte de 40% des conversions mobiles.'
                        : 'Présence limitée à la fiche Maps, zéro devis en ligne.'}
                    </p>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {activeLead.website || 'about:blank'}
                    </div>
                  </div>
                </div>

                {/* Central Laser Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-[#EA580C] shadow-[0_0_15px_rgba(234,88,12,0.7)] pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#EA580C] text-white flex items-center justify-center text-xs font-black shadow-lg">
                    ⮂
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-outfit font-bold pointer-events-none">
                  AVANT
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-[#EA580C] text-white text-[10px] font-outfit font-extrabold pointer-events-none shadow-sm">
                  APRÈS (PROTOTYPE)
                </div>
              </div>

              <p className="text-xs text-slate-500 text-center font-medium">
                Ce visuel comparatif haute fidélité met immédiatement en confiance le décideur.
              </p>
            </div>
          </MotionReveal>
        </div>

        {/* Right: Cold Outreach Message Center (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <MotionReveal direction="up" delay={0.15}>
            <div className="glass-card p-5 sm:p-7 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
                <span className="text-xs font-outfit uppercase text-slate-500 font-bold tracking-wider">
                  Canal de Prospection
                </span>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    onClick={() => setChannel('email')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer font-outfit font-bold ${
                      channel === 'email' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </button>
                  <button
                    onClick={() => setChannel('whatsapp')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer font-outfit font-bold ${
                      channel === 'whatsapp' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => setChannel('sms')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer font-outfit font-bold ${
                      channel === 'sms' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>SMS</span>
                  </button>
                </div>
              </div>

              {/* Email Subject preview if email */}
              {channel === 'email' && (
                <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-1">
                  <span className="text-slate-500 font-outfit text-[10px] uppercase tracking-wider font-bold">
                    Objet de l'email :
                  </span>
                  <p className="font-outfit font-black text-[#0F172A] text-xs sm:text-sm">{emailSubject}</p>
                </div>
              )}

              {/* Message Body Box */}
              <div className="relative">
                <textarea
                  readOnly
                  rows={channel === 'email' ? 12 : 6}
                  value={currentContent}
                  className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-sans leading-relaxed focus:outline-none resize-none shadow-inner"
                />

                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-outfit font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer border border-slate-200"
                  aria-label="Copier le message"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#EA580C]" />}
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {channel === 'email' && (
                  <button
                    onClick={handleOpenMailClient}
                    className="btn-secondary flex-1 text-xs !py-3"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Ouvrir client mail</span>
                  </button>
                )}

                {channel === 'whatsapp' && (
                  <button
                    onClick={handleOpenWhatsapp}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-outfit font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Envoyer sur WhatsApp</span>
                  </button>
                )}

                {channel === 'sms' && (
                  <button
                    onClick={handleOpenSms}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-outfit font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Envoyer par SMS</span>
                  </button>
                )}

                <button
                  onClick={() => onNavigateToClosing(activeLead)}
                  className="btn-primary flex-1 text-xs !py-3"
                >
                  <span>Closing & FeexPay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </div>
  );
};

export default Phase4Outreach;
