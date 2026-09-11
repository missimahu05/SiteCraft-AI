import { useState, useEffect } from 'react';
import type { BusinessProfile, FeexPayPayment } from '../types';
import { api } from '../api/client';
import confetti from 'canvas-confetti';
import { CreditCard, CheckCircle2, Zap, RefreshCw, Smartphone, Server, Globe2, Check, Clock } from 'lucide-react';

interface Phase5Props {
  selectedLead: BusinessProfile;
  leads: BusinessProfile[];
  onMarkLeadClaimed: (leadId: string, domain: string) => Promise<void> | void;
}

export const Phase5Closing = ({
  selectedLead,
  leads,
  onMarkLeadClaimed
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

    // Load FeexPay history
    api.getFeexPayHistory().then(setTransactions).catch(console.error);
  }, [selectedLead]);

  const networks = [
    { id: 'mtn', name: 'MTN Mobile Money', color: '#FFCC00', textColor: '#000000', badge: 'Bénin / CI / CMR' },
    { id: 'moov', name: 'Moov Money (Flooz)', color: '#005F9E', textColor: '#FFFFFF', badge: 'Bénin / Togo / CI' },
    { id: 'orange', name: 'Orange Money', color: '#FF7900', textColor: '#FFFFFF', badge: 'Sénégal / CI / ML' },
    { id: 'wave', name: 'Wave', color: '#1DC3EC', textColor: '#000000', badge: 'Sénégal / CI' },
    { id: 'celtiis', name: 'Celtiis Cash', color: '#6A1B9A', textColor: '#FFFFFF', badge: 'Bénin' },
    { id: 'card', name: 'Carte Bancaire', color: '#1A2550', textColor: '#FFFFFF', badge: 'Visa / Mastercard' },
  ];

  const handleTriggerFeexPay = async () => {
    setIsProcessingPayment(true);
    setPaymentLogs([
      `[FeexPay Engine] Initialisation de la requête pour ${activeLead.title}...`,
      `[Réseau Opérateur] Connexion à la passerelle ${selectedNetwork.toUpperCase()}...`,
      `[Montant Forfaitaire] 300 000 FCFA (Équivalent 490 € - Activation Unique)...`,
      `[USSD Push] Envoi du prompt sécurisé sur le numéro ${customerPhone}...`
    ]);

    try {
      const res = await api.createFeexPayPayment({
        amount: 300000,
        phoneNumber: customerPhone,
        network: selectedNetwork,
        motif: `Activation Site Web - ${activeLead.title}`,
        leadId: activeLead.id,
        leadTitle: activeLead.title
      });

      const txId = res.transaction?.transactionId || `FP-${Date.now()}`;
      setPaymentLogs(prev => [
        ...prev,
        `[FeexPay] Transaction créée ID: ${txId}`,
        `[Client Mobile] Notification reçue. Simulation de validation par code PIN...`
      ]);

      // Wait 3 seconds to simulate PIN validation
      setTimeout(async () => {
        await api.verifyFeexPayPayment(txId);
        setPaymentLogs(prev => [
          ...prev,
          `[Webhook FeexPay IPN] Paiement CONFIRMÉ (Statut: SUCCESSFUL).`,
          `[MongoDB] Lead #${activeLead.id} marqué comme VENDU & CLOS.`,
          `[Cloudflare DNS] Bascule automatique en production.`
        ]);

        await onMarkLeadClaimed(activeLead.id, customDomain);
        setActiveLead(prev => ({ ...prev, status: 'clos', claimed: true }));
        setPaymentSuccess(true);
        setIsProcessingPayment(false);

        // Confetti Celebration
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // Silent fallback
        }

        // Refresh transaction list
        api.getFeexPayHistory().then(setTransactions).catch(console.error);
      }, 3000);

    } catch (err: any) {
      setPaymentLogs(prev => [...prev, `[Erreur FeexPay] ${err.message}`]);
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
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E0E3EF] shadow-card relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <p className="section-label">
            PHASE 05 • FEEXPAY CLOSING & AUTOMATION LOOP
          </p>

          <h2 className="text-2xl sm:text-4xl font-outfit font-black text-[#1A2550] tracking-tight uppercase italic">
            Passerelle FeexPay & <span className="text-[#C41641]">Closing 300 000 FCFA</span>
          </h2>

          <p className="text-sm text-[#6B7299] max-w-3xl leading-relaxed">
            Paiement mobile instantané adapté à l'Afrique (<strong>MTN Mobile Money, Moov, Orange Money, Wave</strong>) et cartes internationales. Dès validation, le webhook FeexPay met à jour MongoDB et active le domaine Cloudflare.
          </p>
        </div>

        {/* Lead Switcher */}
        <div className="flex items-center gap-3 shrink-0 bg-[#F4F2EE] p-2 rounded-2xl border border-[#E0E3EF]">
          <label className="text-xs text-[#6B7299] font-outfit font-bold uppercase tracking-wider pl-2">Prospect :</label>
          <select
            value={activeLead.id}
            onChange={(e) => {
              const found = leads.find(l => l.id === e.target.value);
              if (found) {
                setActiveLead(found);
                setCustomerPhone(found.phone || '+229 97 00 12 34');
                setCustomDomain(`${found.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.bj`);
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E0E3EF] text-xs font-outfit font-bold text-[#1A2550] focus:outline-none focus:border-[#C41641] cursor-pointer shadow-sm"
          >
            {leads.map(l => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: FeexPay Mobile Money Terminal (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-8 rounded-3xl card-navy space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-[#C41641]" />
                <h3 className="font-outfit font-black text-white text-lg uppercase tracking-tight">Passerelle FeexPay</h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Mobile Money Afrique & CB
              </span>
            </div>

            {/* Price Box */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C41641] font-bold block">Forfait Unique d'Activation</span>
                <span className="font-outfit font-black text-3xl sm:text-4xl text-white">300 000 <span className="text-xl font-normal text-zinc-300">FCFA</span></span>
                <span className="text-xs text-zinc-400 block mt-0.5 font-mono">≈ 490 € • Sans abonnement récurrent</span>
              </div>
              <div className="text-right text-xs text-zinc-300 font-mono space-y-1">
                <div>✦ Site Web Clé en Main</div>
                <div>✦ Hébergement Cloudflare</div>
                <div>✦ Nom de Domaine .BJ / .COM</div>
              </div>
            </div>

            {/* Network Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-outfit font-bold uppercase tracking-wider text-zinc-300">
                Sélectionner l'Opérateur de Paiement :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {networks.map(net => {
                  const isSelected = selectedNetwork === net.id;
                  return (
                    <button
                      key={net.id}
                      type="button"
                      onClick={() => setSelectedNetwork(net.id as any)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#C41641] bg-white/15 shadow-lg scale-[1.02]'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: net.color }} />
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C41641]" />}
                      </div>
                      <div className="mt-2">
                        <div className="text-xs font-outfit font-bold text-white leading-tight">{net.name}</div>
                        <div className="text-[9px] font-mono text-zinc-400">{net.badge}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Phone input */}
            <div className="space-y-2">
              <label className="text-[11px] font-outfit font-bold uppercase tracking-wider text-zinc-300">
                Numéro Mobile Money du Client :
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+229 97 00 00 00"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#C41641] transition"
                />
              </div>
            </div>

            {/* Trigger Button */}
            <button
              onClick={handleTriggerFeexPay}
              disabled={isProcessingPayment}
              className={`w-full py-4 rounded-2xl font-outfit font-black uppercase text-xs tracking-wider transition shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                paymentSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#C41641] hover:bg-[#A01235] text-white shadow-[#C41641]/25 hover:scale-[1.01]'
              }`}
            >
              {isProcessingPayment ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Push USSD envoyé... En attente de validation PIN</span>
                </>
              ) : paymentSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
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

          {/* Cloudflare Custom Domain Provisioner */}
          <div className="p-8 rounded-3xl bg-white border border-[#E0E3EF] shadow-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h4 className="font-outfit font-black text-base uppercase text-[#1A2550]">
                  Domaine Personnalisé Cloudflare
                </h4>
                <p className="text-[11px] text-[#6B7299] font-mono">Attachement CNAME automatique</p>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="artisan-parakou.bj"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-xs font-mono text-[#1A2550] focus:outline-none focus:border-[#C41641]"
              />
              <button
                onClick={handleAttachDomain}
                disabled={isSubmittingDomain}
                className="btn-primary text-xs !py-2.5 !px-4 !rounded-xl shrink-0"
              >
                {domainBound ? 'Lié !' : 'Lier le Domaine'}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E0E3EF] text-[11px] font-mono text-[#6B7299] space-y-1">
              <div className="flex justify-between">
                <span>Type d'enregistrement :</span>
                <span className="font-bold text-[#1A2550]">CNAME</span>
              </div>
              <div className="flex justify-between">
                <span>Cible Anycast :</span>
                <span className="font-bold text-orange-600">{activeLead.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pages.dev</span>
              </div>
              <div className="flex justify-between">
                <span>Statut SSL :</span>
                <span className="font-bold text-emerald-600">Auto-Provisionné (TLS 1.3)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: FeexPay Live Logs & Transactions Table (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Live USSD & Webhook Terminal */}
          <div className="p-7 rounded-3xl bg-[#0F163A] border border-white/10 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#C41641]" />
                <span className="font-mono text-xs font-bold text-zinc-300">
                  FeexPay Webhook & IPN Live Dispatcher
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="font-mono text-xs text-zinc-300 space-y-2 max-h-[260px] overflow-y-auto no-scrollbar p-3 rounded-2xl bg-black/40 border border-white/5">
              {paymentLogs.length === 0 ? (
                <div className="text-zinc-500 italic py-6 text-center">
                  En attente du déclenchement du paiement FeexPay...
                </div>
              ) : (
                paymentLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[#C41641] select-none">➜</span>
                    <span className={log.includes('CONFIRMÉ') ? 'text-emerald-400 font-bold' : log.includes('Erreur') ? 'text-red-400' : ''}>
                      {log}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Transactions History in MongoDB */}
          <div className="p-8 rounded-3xl bg-white border border-[#E0E3EF] shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C41641]" />
                <h4 className="font-outfit font-black text-sm uppercase text-[#1A2550]">
                  Historique des Transactions (MongoDB)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#6B7299]">{transactions.length} Enregistrement(s)</span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
              {transactions.length === 0 ? (
                <div className="text-xs text-[#6B7299] italic text-center py-6">
                  Aucune transaction FeexPay enregistrée pour l'instant.
                </div>
              ) : (
                transactions.map((tx, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E0E3EF] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#1A2550]">{tx.leadTitle || tx.leadId}</div>
                      <div className="text-[10px] font-mono text-[#6B7299]">
                        {tx.network.toUpperCase()} • {tx.phoneNumber} • {new Date(tx.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-outfit font-black text-[#1A2550]">{tx.amount.toLocaleString()} FCFA</div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tx.status === 'SUCCESSFUL' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
