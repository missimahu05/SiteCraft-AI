import { useState } from 'react';
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

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Phase 4 : Mockup Automation & Prospection Multicanal</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Outreach Personnalisé
            </span>
          </div>
          <p className="text-sm text-zinc-400 max-w-3xl">
            Génération automatique du comparateur interactif <strong>« Avant / Après »</strong> et des modèles de prospection à froid ultra-personnalisés (Email, WhatsApp, SMS) avec lien de démo dynamique.
          </p>
        </div>

        {/* Lead Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs text-zinc-400">Commerce ciblé :</label>
          <select
            value={activeLead.id}
            onChange={(e) => handleLeadChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {leads.map(l => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Before / After Split Mockup (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
                <span>Gabarit Visuel « Avant / Après »</span>
              </div>
              <span className="text-xs text-zinc-500">Glissez le curseur au centre</span>
            </div>

            {/* Interactive Split View Container */}
            <div 
              className="relative aspect-[16/10] rounded-xl overflow-hidden select-none border border-zinc-800 shadow-2xl bg-zinc-950 cursor-ew-resize"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                setSliderPosition((x / rect.width) * 100);
              }}
            >
              {/* After: Modern Generated Prototype (Right / Full Background) */}
              <div className="absolute inset-0 bg-zinc-950 p-6 flex flex-col justify-center items-center text-center">
                <div className="w-full max-w-sm p-5 rounded-2xl bg-zinc-900/90 border border-emerald-500/40 shadow-2xl space-y-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 font-mono">
                    NOUVEAU SITE 2026 (SiteCraft-AI)
                  </span>
                  <h4 className="text-lg font-extrabold text-white leading-tight">{activeLead.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{activeLead.tagline}</p>
                  <div className="flex justify-center gap-2 pt-2">
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-bold text-xs shadow-md">
                      Appeler ({activeLead.phone})
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold">
                      ★ {activeLead.rating} / 5
                    </span>
                  </div>
                </div>
              </div>

              {/* Before: Old Outdated Site / Missing (Left clipped overlay) */}
              <div 
                className="absolute inset-0 bg-zinc-900 border-r-2 border-emerald-500 flex flex-col justify-center items-center text-center p-6"
                style={{ width: `${sliderPosition}%`, overflow: 'hidden' }}
              >
                <div className="w-full max-w-sm p-5 rounded-xl bg-zinc-950/90 border border-zinc-700 space-y-3 shrink-0">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/20 text-red-300 font-mono">
                    {activeLead.website ? 'ANCIEN SITE OBSOLÈTE' : 'ABSENCE DE SITE WEB'}
                  </span>
                  <p className="text-xs text-zinc-400">
                    {activeLead.website ? 'Design figé, non-responsive, zéro conversion mobile.' : 'Perte estimée de 40% des réservations directes.'}
                  </p>
                  <div className="text-[11px] text-zinc-500 font-mono italic">
                    {activeLead.website ? activeLead.website : 'Google Maps seul'}
                  </div>
                </div>
              </div>

              {/* Central Divider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)] pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                  ⮂
                </div>
              </div>

              {/* Badges Left/Right */}
              <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/70 backdrop-blur text-[10px] font-mono text-zinc-400 pointer-events-none">
                AVANT
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-emerald-950/80 backdrop-blur text-[10px] font-mono text-emerald-300 pointer-events-none">
                APRÈS (PROTOTYPE)
              </div>
            </div>

            {/* Hint */}
            <p className="text-xs text-zinc-500 text-center">
              Ce visuel comparatif peut être joint automatiquement en pièce jointe ou lien dynamique dans l'emailing.
            </p>
          </div>
        </div>

        {/* Right: Cold Outreach Message Center (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-zinc-500">Canal de Prospection</span>
              
              <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
                <button
                  onClick={() => setChannel('email')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md transition cursor-pointer ${channel === 'email' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'}`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>
                <button
                  onClick={() => setChannel('whatsapp')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md transition cursor-pointer ${channel === 'whatsapp' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'}`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => setChannel('sms')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md transition cursor-pointer ${channel === 'sms' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'}`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>SMS</span>
                </button>
              </div>
            </div>

            {/* Email Subject preview if email */}
            {channel === 'email' && (
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                <span className="text-zinc-500">Objet de l'email :</span>
                <p className="font-semibold text-white">{emailSubject}</p>
              </div>
            )}

            {/* Message Body Box */}
            <div className="relative">
              <textarea
                readOnly
                rows={channel === 'email' ? 14 : 6}
                value={currentContent}
                className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-sans leading-relaxed focus:outline-none resize-none font-mono"
              />

              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 pt-2">
              {channel === 'email' && (
                <button
                  onClick={handleOpenMailClient}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>Ouvrir dans mon logiciel mail</span>
                </button>
              )}

              <button
                onClick={() => onNavigateToClosing(activeLead)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <span>Phase 5 : Boucle Stripe & Closing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
