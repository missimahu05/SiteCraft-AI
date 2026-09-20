import { useState, useEffect } from 'react';
import type { BusinessProfile } from '../types';
import { Copy, Check, Mail, MessageSquare, PhoneCall, ArrowRight, ArrowLeftRight } from 'lucide-react';

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
  onNavigateToClosing
}: Phase4Props) => {
  const [activeLead, setActiveLead] = useState<BusinessProfile>(selectedLead);
  const [channel, setChannel] = useState<'email' | 'whatsapp' | 'sms'>('email');
  const [copied, setCopied] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100 for Before / After slider

  useEffect(() => {
    setActiveLead(selectedLead);
  }, [selectedLead]);

  const handleLeadChange = (leadId: string) => {
    const found = leads.find(l => l.id === leadId);
    if (found) {
      setActiveLead(found);
      onSelectLead(found);
    }
  };

  const cleanSubdomain = activeLead.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const demoUrl = activeLead.deploymentUrl || `https://${cleanSubdomain}-demo.vercel.app`;

  // Email template strictly matching Section 5.2
  const emailSubject = `Démo de votre nouveau site pour ${activeLead.title}`;
  const emailBody = `Bonjour l'équipe de ${activeLead.title},

J'ai remarqué la superbe note de votre établissement sur Google Maps (${activeLead.rating.toFixed(1)}/5 étoiles pour ${activeLead.reviewsCount} avis !). C'est une excellente preuve de la qualité de votre travail.

En consultant votre présence en ligne, j'ai constaté que ${activeLead.website ? "votre site actuel ne mettait pas pleinement en valeur vos services sur smartphone" : "vous n'aviez pas encore de site web officiel"}.

Pour vous faire gagner du temps, notre agence a pré-généré une version moderne, responsive et prête à l'emploi pour votre commerce :

👉 Voir votre démonstration en direct : ${demoUrl}

Ce prototype intègre déjà :
• Vos coordonnées complètes et vos meilleurs avis clients Google Maps certifiés.
• Un bouton d'appel en 1 clic pour optimiser vos prises de contact directes.
• Un chargement ultra-rapide optimisé pour iPhone et Android.

Si ce résultat vous convient, nous pouvons connecter votre propre nom de domaine en 24h pour un forfait unique de 490 € (aucun abonnement récurrent mensuel).

Pouvons-nous en discuter 5 minutes cette semaine ?

Bien cordialement,
L'équipe SiteCraft-AI
Agence Digitale Locale
01 89 20 40 50`;

  const whatsappMessage = `Bonjour l'équipe de ${activeLead.title} ! Félicitations pour vos ${activeLead.reviewsCount} avis Google certifiés (${activeLead.rating}★). Nous avons conçu une version démo moderne et prête à l'emploi de votre site web pour booster vos appels : ${demoUrl} . Dites-nous ce que vous en pensez !`;

  const smsMessage = `Bonjour ${activeLead.title}, découvrez la nouvelle version moderne de votre site web générée par notre agence : ${demoUrl} (490 € tout compris, sans abonnement). Discutons-en 5 min !`;

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

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E0E3EF] shadow-card relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <p className="section-label">
            PHASE 04 • HIGH-CONVERSION OUTREACH AUTOMATION
          </p>

          <h2 className="text-2xl sm:text-4xl font-outfit font-black text-[#1A2550] tracking-tight uppercase italic">
            Mockup Automation & <span className="text-[#C41641]">Prospection Multicanal</span>
          </h2>

          <p className="text-sm text-[#6B7299] max-w-3xl leading-relaxed">
            Génération du comparateur interactif <strong>« Avant / Après »</strong> et de copies de prospection personnalisées injectant directement les avis Google certifiés et le lien de démonstration en direct.
          </p>
        </div>

        {/* Lead Switcher Pill */}
        <div className="flex items-center gap-3 shrink-0 bg-[#F4F2EE] p-2 rounded-2xl border border-[#E0E3EF]">
          <label className="text-xs text-[#6B7299] font-outfit font-bold uppercase tracking-wider pl-2">Prospect :</label>
          <select
            value={activeLead.id}
            onChange={(e) => handleLeadChange(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E0E3EF] text-xs font-outfit font-bold text-[#1A2550] focus:outline-none focus:border-[#C41641] cursor-pointer shadow-sm"
          >
            {leads.map(l => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Before / After Split Mockup (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-7 rounded-3xl card-peintre space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F1F5]">
              <div className="flex items-center gap-2.5 text-xs font-outfit text-[#1A2550]">
                <ArrowLeftRight className="w-4 h-4 text-[#C41641]" />
                <span className="font-bold uppercase tracking-wide">Gabarit Visuel « Avant / Après »</span>
              </div>
              <span className="text-[11px] text-[#6B7299] font-mono">Glissez le curseur horizontalement</span>
            </div>

            {/* Interactive Split View Container */}
            <div 
              className="relative aspect-[16/10] rounded-2xl overflow-hidden select-none border border-[#E0E3EF] shadow-card bg-[#F4F2EE] cursor-ew-resize group"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                setSliderPosition((x / rect.width) * 100);
              }}
            >
              {/* After: Modern Generated Prototype (Right / Full Background) */}
              <div className="absolute inset-0 bg-white p-8 flex flex-col justify-center items-center text-center">
                <div className="w-full max-w-sm p-6 rounded-2xl card-peintre border border-[#E0E3EF] shadow-card space-y-3.5">
                  <span className="badge-accent">
                    NOUVEAU SITE 2026 (SiteCraft-AI)
                  </span>
                  <h4 className="text-xl font-outfit font-black text-[#1A2550] leading-tight">{activeLead.title}</h4>
                  <p className="text-xs text-[#2D3553] leading-relaxed">{activeLead.tagline}</p>
                  <div className="flex justify-center items-center gap-2.5 pt-2">
                    <span className="px-4 py-2 rounded-xl bg-[#C41641] text-white font-outfit font-bold text-xs shadow-md uppercase tracking-tight">
                      Appeler ({activeLead.phone})
                    </span>
                    <span className="px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#E0E3EF] text-[#D97706] text-xs font-bold font-outfit">
                      ★ {activeLead.rating} / 5
                    </span>
                  </div>
                </div>
              </div>

              {/* Before: Old Outdated Site / Missing (Left clipped overlay) */}
              <div 
                className="absolute inset-0 bg-[#0F163A] border-r-2 border-[#C41641] flex flex-col justify-center items-center text-center p-8 text-white"
                style={{ width: `${sliderPosition}%`, overflow: 'hidden' }}
              >
                <div className="w-full max-w-sm p-6 rounded-2xl bg-black/60 border border-white/10 space-y-3 shrink-0">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 font-mono uppercase tracking-wider">
                    {activeLead.website ? 'ANCIEN SITE OBSOLÈTE' : 'ABSENCE DE SITE WEB'}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeLead.website ? 'Design figé, non-responsive, zéro conversion smartphone.' : 'Perte estimée de 40% des clients de passage.'}
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono italic">
                    {activeLead.website ? activeLead.website : 'Fiche Google Maps seule'}
                  </div>
                </div>
              </div>

              {/* Central Divider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-[#C41641] shadow-[0_0_15px_rgba(196,22,65,0.5)] pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#C41641] text-white flex items-center justify-center text-xs font-black shadow-accent">
                  ⮂
                </div>
              </div>

              {/* Badges Left/Right */}
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-xl bg-[#1A2550] text-white text-[10px] font-outfit font-bold pointer-events-none shadow-sm">
                AVANT
              </div>
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-xl bg-[#C41641] text-white text-[10px] font-outfit font-black pointer-events-none shadow-sm">
                APRÈS (PROTOTYPE)
              </div>
            </div>

            {/* Hint */}
            <p className="text-xs text-[#6B7299] text-center font-medium">
              Ce visuel comparatif peut être joint automatiquement en pièce jointe ou lien dynamique dans l'emailing.
            </p>
          </div>
        </div>

        {/* Right: Cold Outreach Message Center (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-7 rounded-3xl card-peintre space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F1F5]">
              <span className="text-[10px] font-outfit uppercase text-[#6B7299] font-bold tracking-widest">Canal de Prospection</span>
              
              <div className="flex items-center gap-1.5 bg-[#F4F2EE] p-1.5 rounded-2xl border border-[#E0E3EF] text-xs">
                <button
                  onClick={() => setChannel('email')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer font-outfit font-bold ${channel === 'email' ? 'bg-[#1A2550] text-white shadow-sm' : 'text-[#6B7299] hover:text-[#1A2550]'}`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>
                <button
                  onClick={() => setChannel('whatsapp')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer font-outfit font-bold ${channel === 'whatsapp' ? 'bg-[#C41641] text-white shadow-sm' : 'text-[#6B7299] hover:text-[#1A2550]'}`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => setChannel('sms')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer font-outfit font-bold ${channel === 'sms' ? 'bg-[#1A2550] text-white shadow-sm' : 'text-[#6B7299] hover:text-[#1A2550]'}`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>SMS</span>
                </button>
              </div>
            </div>

            {/* Email Subject preview if email */}
            {channel === 'email' && (
              <div className="p-4 rounded-2xl bg-[#F4F2EE] border border-[#E0E3EF] text-xs space-y-1">
                <span className="text-[#6B7299] font-outfit text-[10px] uppercase tracking-wider font-bold">Objet du courriel :</span>
                <p className="font-outfit font-black text-[#1A2550] text-sm">{emailSubject}</p>
              </div>
            )}

            {/* Message Body Box */}
            <div className="relative">
              <textarea
                readOnly
                rows={channel === 'email' ? 14 : 6}
                value={currentContent}
                className="w-full p-5 rounded-2xl bg-[#FAF9F6] border border-[#E0E3EF] text-xs text-[#2D3553] font-sans leading-relaxed focus:outline-none resize-none shadow-inner"
              />

              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F4F2EE] text-[#1A2550] text-xs font-outfit font-bold flex items-center gap-2 shadow-sm transition cursor-pointer border border-[#E0E3EF]"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#C41641]" />}
                <span>{copied ? 'Copié !' : 'Copier le texte'}</span>
              </button>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {channel === 'email' && (
                <button
                  onClick={handleOpenMailClient}
                  className="btn-ghost w-full sm:w-auto flex-1 !py-3.5 text-xs font-bold"
                >
                  <Mail className="w-4 h-4 text-[#C41641]" />
                  <span>Ouvrir client mail</span>
                </button>
              )}

              {channel === 'whatsapp' && (
                <button
                  onClick={handleOpenWhatsapp}
                  className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-outfit font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Envoyer sur WhatsApp</span>
                </button>
              )}

              {channel === 'sms' && (
                <button
                  onClick={handleOpenSms}
                  className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-[#1A2550] hover:bg-[#2D3553] text-white font-outfit font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#1A2550]/20"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Envoyer par SMS</span>
                </button>
              )}

              <button
                onClick={() => onNavigateToClosing(activeLead)}
                className="btn-primary w-full sm:w-auto flex-1 !py-3.5 text-xs font-black"
              >
                <span>Phase 05 : FeexPay & Closing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
