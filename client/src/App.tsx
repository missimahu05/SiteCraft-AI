import { useState, useEffect } from 'react';
import type { BusinessProfile, ActiveTab, StripeEvent } from './types';
import { api } from './api/client';
import { Header } from './components/Header';
import { Phase1Discovery } from './components/Phase1Discovery';
import { Phase2Audit } from './components/Phase2Audit';
import { Phase3Generator } from './components/Phase3Generator';
import { Phase4Outreach } from './components/Phase4Outreach';
import { Phase5Closing } from './components/Phase5Closing';
import { PdfExportModal } from './components/PdfExportModal';
import { SettingsModal } from './components/SettingsModal';
import { AntigravitySwarmPanel } from './components/AntigravitySwarmPanel';
import { MotionReveal } from './components/motion/MotionReveal';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

export function App() {
  const [leads, setLeads] = useState<BusinessProfile[]>([]);
  const [selectedLead, setSelectedLead] = useState<BusinessProfile | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('discovery');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [stripeEvents] = useState<StripeEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Load dynamic data from backend on mount
  useEffect(() => {
    async function initData() {
      try {
        const loadedLeads = await api.getLeads();
        setLeads(loadedLeads);
        if (loadedLeads.length > 0) {
          setSelectedLead(loadedLeads[0]);
        }
      } catch (err) {
        console.error('Error fetching initial data from backend:', err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  const handleSelectLead = (lead: BusinessProfile) => {
    setSelectedLead(lead);
  };

  const handleNavigateToAudit = (lead: BusinessProfile) => {
    setSelectedLead(lead);
    setActiveTab('audit');
  };

  const handleNavigateToGenerator = (lead: BusinessProfile) => {
    setSelectedLead(lead);
    setActiveTab('generator');
  };

  const handleNavigateToOutreach = (lead: BusinessProfile) => {
    setSelectedLead(lead);
    setActiveTab('outreach');
  };

  const handleNavigateToClosing = (lead: BusinessProfile) => {
    setSelectedLead(lead);
    setActiveTab('closing');
  };

  const handleAddNewLead = async (newLeadData: BusinessProfile) => {
    try {
      const created = await api.createLead(newLeadData);
      setLeads(prev => [created, ...prev]);
      setSelectedLead(created);
    } catch (err) {
      console.error('Error adding lead:', err);
    }
  };

  const handleUpdateLeadAudit = async (leadId: string) => {
    try {
      const res = await api.runAudit(leadId);
      const auditResult = res.audit || res;
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, audit: auditResult, status: 'qualifie' } : l));
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, audit: auditResult, status: 'qualifie' } : null);
      }
    } catch (err) {
      console.error('Error running audit:', err);
    }
  };

  const handleUpdateDeployment = async (leadId: string) => {
    try {
      const deployResult = await api.deployCloudflare(leadId);
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, cloudflareUrl: deployResult.url, deploymentUrl: deployResult.url, status: 'site_genere' } : l));
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, cloudflareUrl: deployResult.url, deploymentUrl: deployResult.url, status: 'site_genere' } : null);
      }
    } catch (err) {
      console.error('Error deploying site to Cloudflare:', err);
    }
  };

  const handleTriggerPayment = async (leadId: string, domain: string) => {
    try {
      await api.updateLead(leadId, { status: 'clos', customDomain: domain });
      const refreshedLeads = await api.getLeads();
      setLeads(refreshedLeads);
      const current = refreshedLeads.find(l => l.id === leadId);
      if (current) setSelectedLead(current);
    } catch (err) {
      console.error('Error updating lead closing:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center space-y-6 text-center max-w-md">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-[#0F172A] flex items-center justify-center font-outfit font-black text-white text-3xl shadow-2xl shadow-orange-500/20 border border-white/20 animate-pulse">
              SC<span className="text-[#EA580C]">.</span>
            </div>
            <div className="absolute -inset-1 rounded-3xl bg-[#EA580C] opacity-25 blur-xl -z-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-outfit font-black text-[#0F172A] tracking-tight">
              SiteCraft<span className="text-[#EA580C]">.AI</span>
            </h2>
            <p className="text-sm font-sans text-slate-500 font-medium">
              Connexion à MongoDB Atlas & synchronisation de la passerelle FeexPay...
            </p>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-mono text-[#0F172A] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span>Atlas MongoDB • Cloudflare Anycast • Passerelle FeexPay</span>
          </div>
        </div>
      </div>
    );
  }

  const marqueeItems = [
    'Scraping Géolocalisé Google Maps',
    'Audit Multimodal Vision GPT-4o',
    'Studio Haute Fidélité Cloudflare Anycast',
    'Passerelle FeexPay Mobile Money (300 000 FCFA)',
    'Essaim Autonome Antigravity v2.4',
    'Export Dossier Audit PDF Vectoriel',
    'Conformité WCAG AA & Core Web Vitals <1.2s'
  ];

  const closedCount = leads.filter(l => l.status === 'clos' || l.status === 'cloture').length;
  const revenueXof = closedCount * 300000;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans relative overflow-x-hidden selection:bg-[#EA580C] selection:text-white">
      {/* Background Animated Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-5 w-[480px] h-[480px] rounded-full bg-orange-500/[0.03] blur-[90px]" />
        <div className="absolute top-40 right-10 w-[420px] h-[420px] rounded-full bg-[#EA580C]/[0.03] blur-[90px]" />
        <div className="absolute bottom-20 left-1/3 w-[500px] h-[500px] rounded-full bg-slate-900/[0.02] blur-[100px]" />
      </div>

      {/* Floating Header with Telemetry & FeexPay Profile */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        leads={leads}
        stripeEvents={stripeEvents}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Architectural Marquee Ticker */}
      <div className="relative z-10 border-y border-slate-200 bg-white/90 backdrop-blur-md py-2 overflow-hidden my-2 shadow-sm">
        <div className="flex gap-10 w-max animate-marquee">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="text-[11px] font-outfit font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-6 whitespace-nowrap hover:text-[#0F172A] transition"
            >
              <span className="flex items-center gap-1.5 text-slate-800">
                <Sparkles className="w-3 h-3 text-[#EA580C]" />
                {item}
              </span>
              <span className="text-[#EA580C] text-xs">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Pipeline Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-5 relative z-10 space-y-4">
        {/* FeexPay Pending Validation Status Banner (Exact Design from FeexPay screenshot) */}
        <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="space-y-1.5 max-w-2xl">
            <h3 className="text-base sm:text-lg font-outfit font-black text-[#EA580C]">
              Pending validation
            </h3>
            <p className="text-xs sm:text-sm text-[#9A3412] font-medium leading-relaxed">
              Your application is being reviewed by our team. We will notify you once a decision has been made.
              Pipeline actif : Détection cartographique Parakou/Cotonou et encaissement MTN MoMo & Moov Money.
            </p>
          </div>

          <div className="mt-3.5 flex items-center gap-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-4 py-1.5 rounded-lg border border-[#FED7AA] bg-white hover:bg-orange-50 text-[#EA580C] text-xs font-outfit font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Status of my request</span>
              <span>&gt;</span>
            </button>
          </div>
        </div>

        {/* FeexPay Signature 3-Metric Overview Cards Row (Exact Design from FeexPay screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Card 1: Last 24h */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm relative flex items-center justify-between overflow-hidden">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Last 24h
              </span>
              <p className="text-[11px] text-slate-400">Prospects scannés récents</p>
            </div>
            <span className="text-3xl sm:text-4xl font-outfit font-black text-[#0F172A]">
              {leads.length}
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500/80 rounded-b-xl" />
          </div>

          {/* Card 2: Customers */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm relative flex items-center justify-between overflow-hidden">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Customers
              </span>
              <p className="text-[11px] text-slate-400">Artisans & Commerces cibles</p>
            </div>
            <span className="text-3xl sm:text-4xl font-outfit font-black text-[#0F172A]">
              {leads.filter(l => l.rating >= 3.8).length}
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-300 rounded-b-xl" />
          </div>

          {/* Card 3: Total Balance with FeexPay Yellow Badge */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm relative flex items-center justify-between overflow-hidden">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Balance
              </span>
              <p className="text-[11px] text-slate-400">Chiffre d'affaires collecté</p>
            </div>
            <div className="px-3.5 py-1 rounded bg-[#FEF08A] border border-amber-300 shadow-sm">
              <span className="text-xl sm:text-2xl font-mono font-black text-slate-900 tracking-tight">
                {revenueXof > 0 ? `${revenueXof.toLocaleString('fr-FR')} F` : '0'}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400 rounded-b-xl" />
          </div>
        </div>

        {selectedLead ? (
          <MotionReveal key={activeTab} direction="up" delay={0.05}>
            {activeTab === 'discovery' && (
              <Phase1Discovery
                leads={leads}
                selectedLead={selectedLead}
                onSelectLead={handleSelectLead}
                onNavigateToAudit={handleNavigateToAudit}
                onAddNewLead={handleAddNewLead}
              />
            )}

            {activeTab === 'audit' && (
              <Phase2Audit
                selectedLead={selectedLead}
                leads={leads}
                onSelectLead={handleSelectLead}
                onUpdateLeadAudit={() => handleUpdateLeadAudit(selectedLead.id)}
                onNavigateToGenerator={handleNavigateToGenerator}
              />
            )}

            {activeTab === 'generator' && (
              <Phase3Generator
                selectedLead={selectedLead}
                leads={leads}
                onSelectLead={handleSelectLead}
                onUpdateDeployment={() => handleUpdateDeployment(selectedLead.id)}
                onNavigateToOutreach={handleNavigateToOutreach}
                onClaimCheckout={() => handleNavigateToClosing(selectedLead)}
              />
            )}

            {activeTab === 'outreach' && (
              <Phase4Outreach
                selectedLead={selectedLead}
                leads={leads}
                onSelectLead={handleSelectLead}
                onNavigateToClosing={handleNavigateToClosing}
              />
            )}

            {activeTab === 'closing' && (
              <Phase5Closing
                selectedLead={selectedLead}
                leads={leads}
                onMarkLeadClaimed={(leadId, domain) => handleTriggerPayment(leadId, domain)}
              />
            )}

            {activeTab === 'swarm' && (
              <AntigravitySwarmPanel
                selectedLead={selectedLead}
                onRefreshLeads={async () => {
                  const refreshed = await api.getLeads();
                  setLeads(refreshed);
                }}
              />
            )}
          </MotionReveal>
        ) : (
          <div className="glass-card p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto my-12">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-200">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-outfit font-black text-[#0F172A]">Aucun prospect sélectionné</h3>
            <p className="text-sm text-slate-500">
              Démarrez la cartographie dans la Phase 01 pour explorer ou ajouter des commerces.
            </p>
          </div>
        )}
      </main>

      {/* Modern FeexPay Architectural Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/80 backdrop-blur-md py-5 px-4 sm:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-outfit font-black text-[#0F172A]">SiteCraft<span className="text-[#EA580C]">.AI</span></span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">Pipeline Autonome & Passerelle Mobile Money FeexPay</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Atlas MongoDB & FeexPay Opérationnels
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Cloudflare Anycast : ~18ms</span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-slate-400">v2.4.0</span>
          </div>
        </div>
      </footer>

      {/* PDF Export Modal */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        leads={leads}
      />

      {/* Settings Modal (API Keys) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
