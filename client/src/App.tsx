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
      <div className="min-h-screen bg-[#F4F2EE] text-[#1A2550] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-[#1A2550] flex items-center justify-center font-black text-white text-2xl shadow-xl">
            SC<span className="text-[#C41641] text-3xl leading-none">.</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#C41641] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-outfit font-bold text-[#2D3553] tracking-wide">
            Initialisation de l'Agence Autonome SiteCraft (MongoDB & Cloudflare)...
          </p>
        </div>
      </div>
    );
  }

  const marqueeItems = [
    'Scraping Google Maps',
    'Audit Multimodal Vision GPT-4o',
    'Génération Frontend React (peintre-react)',
    'Déploiement Cloudflare Pages Anycast',
    'Passerelle FeexPay 300 000 FCFA',
    'Base de Données MongoDB'
  ];

  return (
    <div className="min-h-screen bg-[#F4F2EE] text-[#2D3553] flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Animated Blobs from peintre-react */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-5 w-[420px] h-[420px] rounded-full bg-[#1A2550]/[0.05] blur-[80px]" />
        <div className="absolute top-40 right-10 w-[380px] h-[380px] rounded-full bg-[#C41641]/[0.05] blur-[80px]" />
        <div className="absolute bottom-20 left-1/3 w-[450px] h-[450px] rounded-full bg-[#1A2550]/[0.04] blur-[90px]" />
      </div>

      {/* Top Floating Header with KPI & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        leads={leads}
        stripeEvents={stripeEvents}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Marquee Strip from peintre-react */}
      <div className="relative z-10 border-y border-[#E0E3EF] bg-white/70 backdrop-blur-sm py-2 overflow-hidden">
        <div className="flex gap-8 w-max animate-marquee">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-[11px] font-outfit font-extrabold uppercase tracking-widest text-[#6B7299] flex items-center gap-8 whitespace-nowrap">
              {item} <span className="text-[#C41641] text-xs">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 relative z-10">
        {selectedLead && (
          <>
            {activeTab === 'discovery' && (
              <Phase1Discovery
                leads={leads}
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
          </>
        )}
      </main>

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
