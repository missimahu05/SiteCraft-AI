import { useState } from 'react';
import type { BusinessProfile, StripeEvent } from '../types';
import confetti from 'canvas-confetti';
import { CreditCard, CheckCircle2, Zap, RefreshCw, Smartphone, Server, Globe2 } from 'lucide-react';

interface Phase5Props {
  selectedLead: BusinessProfile;
  leads: BusinessProfile[];
  stripeEvents: StripeEvent[];
  onAddStripeEvent: (event: StripeEvent) => void;
  onMarkLeadClaimed: (leadId: string) => void;
}

export const Phase5Closing = ({
  selectedLead,
  leads,
  stripeEvents,
  onAddStripeEvent,
  onMarkLeadClaimed
}: Phase5Props) => {
  const [activeLead, setActiveLead] = useState<BusinessProfile>(selectedLead);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [customDomain, setCustomDomain] = useState(`${activeLead.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.fr`);

  const handleSimulatePayment = () => {
    setIsProcessingCheckout(true);

    setTimeout(() => {
      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback silently if confetti encounters issue
      }

      const newEvent: StripeEvent = {
        id: `evt_${Date.now()}`,
        type: 'checkout.session.completed',
        amount: 490,
        businessName: activeLead.title,
        domain: customDomain,
        status: 'paid',
        timestamp: new Date().toLocaleTimeString('fr-FR'),
        webhookTriggered: {
          n8nWorkflow: true,
          domainTicket: true,
          twilioSms: true,
          prodTransition: true
        }
      };

      onAddStripeEvent(newEvent);
      onMarkLeadClaimed(activeLead.id);
      setActiveLead(prev => ({ ...prev, claimed: true, status: 'cloture' }));
      setIsProcessingCheckout(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Phase 5 : Interface de Révision Client & Boucle Stripe</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
              Forfait Unique 490 € / Webhooks
            </span>
          </div>
          <p className="text-sm text-zinc-400 max-w-3xl">
            Lorsqu'un commerçant clique sur le bandeau <strong>ClaimBanner</strong>, il est redirigé vers Stripe Checkout. Dès réception de l'événement <code>checkout.session.completed</code>, l'orchestrateur n8n transfère le domaine et notifie le client par SMS.
          </p>
        </div>

        {/* Lead Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs text-zinc-400">Commerce :</label>
          <select
            value={activeLead.id}
            onChange={(e) => {
              const found = leads.find(l => l.id === e.target.value);
              if (found) {
                setActiveLead(found);
                setCustomDomain(`${found.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.fr`);
              }
            }}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {leads.map(l => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Stripe Checkout Simulator (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Simulateur Stripe Checkout</h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                Mode Test
              </span>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Activation Site Web & Nom de Domaine</h4>
                <p className="text-xs text-zinc-400">Pack Clé-en-main pour {activeLead.title}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">490,00 €</span>
                <p className="text-[10px] text-zinc-500">Paiement unique (aucun abonnement)</p>
              </div>
            </div>

            {/* Domain Configuration */}
            <div className="space-y-1.5 text-xs">
              <label className="text-zinc-400">Nom de domaine souhaité par le client :</label>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white">
                <Globe2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="bg-transparent w-full focus:outline-none font-mono text-xs"
                />
              </div>
            </div>

            {/* Included Features List */}
            <div className="space-y-2 text-xs text-zinc-400 pt-1">
              <span className="font-semibold text-zinc-300">Inclus dans la transaction :</span>
              <ul className="space-y-1.5 pl-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Réservation ou transfert du domaine <code>{customDomain}</code></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Certificat SSL HTTPS & Hébergement Cloudflare / Vercel illimité</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Bouton d'appel mobile direct et synchronisation des avis Google</span>
                </li>
              </ul>
            </div>

            {/* Trigger Payment Button */}
            <button
              disabled={isProcessingCheckout || activeLead.claimed}
              onClick={handleSimulatePayment}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer ${
                activeLead.claimed
                  ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25'
              }`}
            >
              {isProcessingCheckout ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Traitement du Webhook Stripe en cours...</span>
                </>
              ) : activeLead.claimed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Site déjà activé & payé (490 € reçus)</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Simuler le Paiement Client de 490 € (Stripe Checkout)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Live Webhooks & Automation Pipeline Tracker (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Événements Webhook & Automatisations n8n</h3>
              <span className="text-xs text-zinc-500 font-mono">checkout.session.completed</span>
            </div>

            {/* Events List */}
            {stripeEvents.length > 0 ? (
              <div className="space-y-3">
                {stripeEvents.map((evt) => (
                  <div key={evt.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-mono text-xs font-bold text-white">{evt.businessName}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">+{evt.amount} €</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-800/80 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Workflow n8n déclenché</span>
                      </div>
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-800/80 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Ticket Domaine ({evt.domain})</span>
                      </div>
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-800/80 flex items-center gap-2">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>SMS Twilio client envoyé</span>
                      </div>
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-800/80 flex items-center gap-2">
                        <Server className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Production Vercel activée</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-zinc-600 font-mono flex justify-between pt-1 border-t border-zinc-900">
                      <span>ID: {evt.id}</span>
                      <span>Enregistré à {evt.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <p className="text-xs text-zinc-400">Aucun paiement Stripe enregistré pour l'instant.</p>
                <p className="text-[11px] text-zinc-600">
                  Cliquez sur « Simuler le Paiement Client » pour observer le déclenchement en chaîne du webhook.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
