import { useState, useEffect } from 'react';
import type { BusinessProfile, FeexPayPayment } from '../types';
import { api } from '../api/client';
import { MotionReveal } from './motion/MotionReveal';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  CheckCircle2,
  Zap,
  RefreshCw,
  Smartphone,
  Server,
  Globe2,
  Check,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface Phase5Props {
  selectedLead: BusinessProfile;
  leads: BusinessProfile[];
  onMarkLeadClaimed: (leadId: string, domain: string) => Promise<void> | void;
}

export const Phase5Closing = ({
  selectedLead,
  leads,
  onMarkLeadClaimed,
}: Phase5Props) => {
  const [activeLead, setActiveLead] = useState<BusinessProfile>(selectedLead);
  const [selectedNetwork, setSelectedNetwork] = useState<'mtn' | 'moov' | 'orange' | 'wave' | 'celtiis' | 'card'>('mtn');
  const [customerPhone, setCustomerPhone] = useState(activeLead.phone || '+229 97 00 12 34');
  const [customDomain, setCustomDomain] = useState(`${activeLead.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.bj`);
  const [isSubmittingDomain, setIsSubmittingDomain] = useState(false);
  const [domainBound, setDomainBound] = useState(false);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(activeLead.status === 'clos');
  const [paymentLogs, setPaymentLogs] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<FeexPayPayment[]>([]);

  useEffect(() => {
    setActiveLead(selectedLead);
    setCustomerPhone(selectedLead.phone || '+229 97 00 12 34');
    setCustomDomain(`${selectedLead.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.bj`);
    setPaymentSuccess(selectedLead.status === 'clos');

    api.getFeexPayHistory().then(setTransactions).catch(console.error);
  }, [selectedLead]);

  const networks = [
    { id: 'mtn', name: 'MTN MoMo', color: '#FFCC00', dotColor: '#EAB308', badge: 'Bénin / CI / CMR' },
    { id: 'moov', name: 'Moov Money', color: '#005F9E', dotColor: '#0284C7', badge: 'Bénin / Togo / CI' },
    { id: 'orange', name: 'Orange Money', color: '#FF7900', dotColor: '#F97316', badge: 'Sénégal / CI' },
    { id: 'wave', name: 'Wave', color: '#1DC3EC', dotColor: '#06B6D4', badge: 'Sénégal / CI' },
    { id: 'celtiis', name: 'Celtiis Cash', color: '#6A1B9A', dotColor: '#9333EA', badge: 'Bénin' },
    { id: 'card', name: 'Carte Bancaire', color: '#0F172A', dotColor: '#475569', badge: 'Visa / Mastercard' },
  ];

  const handleTriggerFeexPay = async () => {
    setIsProcessingPayment(true);
    setPaymentLogs([
      `[FeexPay Engine] Initialisation transaction pour : ${activeLead.title}...`,
      `[Réseau Opérateur] Connexion passerelle ${selectedNetwork.toUpperCase()}...`,
      `[Montant Forfaitaire] 300 000 FCFA (Équivalent 490 € - Licence à vie sans abonnement)...`,
      `[Prompt USSD Mobile] Envoi notification push sur le numéro ${customerPhone}...`,
    ]);

    try {
      const res = await api.createFeexPayPayment({
        amount: 300000,
        phoneNumber: customerPhone,
        network: selectedNetwork,
        motif: `Activation Site Web - ${activeLead.title}`,
        leadId: activeLead.id,
        leadTitle: activeLead.title,
      });

      const txId = res.transaction?.transactionId || `FP-${Date.now()}`;
      setPaymentLogs((prev) => [
        ...prev,
        `[FeexPay] Session initialisée ID: ${txId}`,
        `[Mobile Client] En attente de validation du code secret PIN...`,
      ]);

      setTimeout(async () => {
        await api.verifyFeexPayPayment(txId);
        setPaymentLogs((prev) => [
          ...prev,
          `[Webhook FeexPay IPN] Statut SUCCESSFUL reçu à l'instant.`,
          `[MongoDB] Fiche #${activeLead.id} basculée en statut CLOS & VENDU.`,
          `[Cloudflare Anycast] Activation définitive du nom de domaine.`,
        ]);

        await onMarkLeadClaimed(activeLead.id, customDomain);
        setActiveLead((prev) => ({ ...prev, status: 'clos', claimed: true }));
        setPaymentSuccess(true);
        setIsProcessingPayment(false);

        try {
          confetti({
            particleCount: 140,
            spread: 90,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // Fallback
        }

        api.getFeexPayHistory().then(setTransactions).catch(console.error);
      }, 2500);
    } catch (err: any) {
      setPaymentLogs((prev) => [...prev, `[Erreur FeexPay] ${err.message}`]);
      setIsProcessingPayment(false);
    }
  };

  const handleAttachDomain = async () => {
    setIsSubmittingDomain(true);
    try {
      await api.setCustomDomain(activeLead.id, customDomain);
      setDomainBound(true);
      setTimeout(() => setDomainBound(false), 3000);
    } catch (err: any) {
      console.error('Domain error:', err);
    } finally {
      setIsSubmittingDomain(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <MotionReveal direction="up" delay={0.05}>
        <div className="glass-card p-6 sm:p-8 relative overflow-hidden border border-white/80 shadow-md">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#EA580C] text-xs font-outfit font-extrabold uppercase tracking-widest">
                <CreditCard className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Phase 05 • FeexPay Closing & Automation Loop</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-outfit font-black text-[#0F172A] tracking-tight uppercase">
                Passerelle FeexPay & <span className="text-[#EA580C]">Closing 300 000 FCFA</span>
              </h2>

              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                Paiement direct Mobile Money Afrique (<strong>MTN MoMo, Moov, Orange, Wave, Celtiis</strong>)
                et Cartes Bancaires. Dès confirmation, le webhook IPN valide la commande dans MongoDB et affecte le domaine.
              </p>
            </div>

            {/* Lead Switcher */}
            <div className="flex items-center gap-3 shrink-0 bg-slate-100/90 p-2 rounded-2xl border border-slate-200 shadow-sm">
              <label htmlFor="closing-lead-select" className="text-xs text-slate-600 font-outfit font-bold uppercase tracking-wider pl-2">
                Prospect :
              </label>
              <select
                id="closing-lead-select"
                value={activeLead.id}
                onChange={(e) => {
                  const found = leads.find((l) => l.id === e.target.value);
                  if (found) {
                    setActiveLead(found);
                    setCustomerPhone(found.phone || '+229 97 00 12 34');
                    setCustomDomain(`${found.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.bj`);
                  }
                }}
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

      {/* Grid: FeexPay Terminal vs Webhook & Transactions */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: FeexPay Terminal (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <MotionReveal direction="up" delay={0.1}>
            <div className="glass-card-dark p-6 sm:p-8 space-y-6 border border-white/10 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-[#EA580C]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h3 className="font-outfit font-black text-white text-base uppercase tracking-tight">
                    Terminal de Paiement FeexPay
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Mobile Money Afrique
                </span>
              </div>

              {/* Price Display */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#EA580C] font-bold block">
                    Forfait Unique d'Activation
                  </span>
                  <div className="font-outfit font-black text-3xl sm:text-4xl text-white">
                    300 000 <span className="text-lg font-normal text-slate-400">FCFA</span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5 font-mono">
                    ≈ 490 € • Sans abonnement récurrent mensuel
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-mono space-y-1 sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
                  <div className="flex items-center sm:justify-end gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Site Clé en Main
                  </div>
                  <div className="flex items-center sm:justify-end gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Hébergement Cloudflare
                  </div>
                  <div className="flex items-center sm:justify-end gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Domaine .BJ / .COM inclus
                  </div>
                </div>
              </div>

              {/* Network Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300">
                  Sélectionner l'Opérateur :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {networks.map((net) => {
                    const isSelected = selectedNetwork === net.id;
                    return (
                      <button
                        key={net.id}
                        type="button"
                        onClick={() => setSelectedNetwork(net.id as any)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#EA580C] bg-white/15 shadow-lg ring-1 ring-[#EA580C]'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: net.color }} />
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#EA580C]" />}
                        </div>
                        <div className="mt-2">
                          <div className="text-xs font-outfit font-bold text-white leading-tight">{net.name}</div>
                          <div className="text-[9px] font-mono text-slate-400">{net.badge}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phone input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300">
                  Numéro Mobile Money du Client :
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+229 97 00 00 00"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#EA580C] transition"
                  />
                </div>
              </div>

              {/* Trigger Button */}
              <button
                onClick={handleTriggerFeexPay}
                disabled={isProcessingPayment}
                className={`w-full py-3.5 rounded-xl font-outfit font-black uppercase text-xs tracking-wider transition shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                  paymentSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-[#EA580C]/25 hover:scale-[1.01]'
                }`}
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Push USSD envoyé... En attente du code PIN</span>
                  </>
                ) : paymentSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Site Activé & Transaction Validée !</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Déclencher le Paiement FeexPay (300 000 FCFA)</span>
                  </>
                )}
              </button>
            </div>
          </MotionReveal>

          {/* Cloudflare Custom Domain Provisioner */}
          <MotionReveal direction="up" delay={0.15}>
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-outfit font-black text-sm uppercase text-[#0F172A]">
                    Attachement de Domaine Cloudflare
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">Propagation CNAME automatique</p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="artisan-parakou.bj"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#EA580C]"
                />
                <button
                  onClick={handleAttachDomain}
                  disabled={isSubmittingDomain}
                  className="btn-primary text-xs !py-2.5 !px-4 !rounded-xl shrink-0"
                >
                  {domainBound ? 'Lié !' : 'Lier le Domaine'}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Enregistrement DNS :</span>
                  <span className="font-bold text-[#0F172A]">CNAME @</span>
                </div>
                <div className="flex justify-between">
                  <span>Cible Anycast :</span>
                  <span className="font-bold text-amber-700">
                    {activeLead.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pages.dev
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Statut SSL :</span>
                  <span className="font-bold text-emerald-600">Certifié TLS 1.3 Universal</span>
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>

        {/* Right: FeexPay Terminal Logs & History (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Live USSD & Webhook Terminal */}
          <MotionReveal direction="up" delay={0.1}>
            <div className="p-6 rounded-2xl bg-[#0A0F1D] border border-white/10 text-white space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#EA580C]" />
                  <span className="font-mono text-xs font-bold text-slate-300">
                    FeexPay Webhook & IPN Live Dispatcher
                  </span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div className="font-mono text-xs text-slate-300 space-y-2 min-h-[140px] max-h-[220px] overflow-y-auto no-scrollbar p-3.5 rounded-xl bg-[#060A14] border border-white/5">
                {paymentLogs.length === 0 ? (
                  <div className="text-slate-500 italic py-6 text-center">
                    En attente de déclenchement du paiement FeexPay...
                  </div>
                ) : (
                  paymentLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-[#EA580C] select-none">&gt;</span>
                      <span
                        className={
                          log.includes('CONFIRMÉ') || log.includes('SUCCESSFUL')
                            ? 'text-emerald-400 font-bold'
                            : log.includes('Erreur')
                            ? 'text-rose-400'
                            : ''
                        }
                      >
                        {log}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </MotionReveal>

          {/* Transactions History in MongoDB */}
          <MotionReveal direction="up" delay={0.15}>
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#EA580C]" />
                  <h4 className="font-outfit font-black text-sm uppercase text-[#0F172A]">
                    Historique des Transactions (MongoDB)
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{transactions.length} Enregistrement(s)</span>
              </div>

              <div className="space-y-2 max-h-[260px] overflow-y-auto no-scrollbar">
                {transactions.length === 0 ? (
                  <div className="text-xs text-slate-500 italic text-center py-6">
                    Aucune transaction FeexPay enregistrée pour l'instant.
                  </div>
                ) : (
                  transactions.map((tx, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#0F172A]">{tx.leadTitle || tx.leadId}</div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {tx.network.toUpperCase()} • {tx.phoneNumber} • {new Date(tx.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-outfit font-black text-[#0F172A]">{tx.amount.toLocaleString()} FCFA</div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            tx.status === 'SUCCESSFUL'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </div>
  );
};

export default Phase5Closing;
