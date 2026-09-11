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
  const [stripeEvents, setStripeEvents] = useState<StripeEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Load dynamic data from real SQLite backend on mount
  useEffect(() => {
    async function initData() {
      try {
        const [loadedLeads, loadedEvents] = await Promise.all([
          api.getLeads(),
          api.getStripeEvents()
        ]);
        setLeads(loadedLeads);
        if (loadedLeads.length > 0) {
          setSelectedLead(loadedLeads[0]);
        }
        setStripeEvents(loadedEvents);
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
      const auditResult = await api.runAudit(leadId);
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
      const deployResult = await api.deployVercel(leadId);
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, deploymentUrl: deployResult.url, status: 'site_genere' } : l));
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, deploymentUrl: deployResult.url, status: 'site_genere' } : null);
      }
    } catch (err) {
      console.error('Error deploying site:', err);
    }
  };

  const handleTriggerPayment = async (leadId: string, domain: string) => {
    try {
      await api.checkoutStripe(leadId, domain);
      const events = await api.getStripeEvents();
      setStripeEvents(events);
      const refreshedLeads = await api.getLeads();
      setLeads(refreshedLeads);
      const current = refreshedLeads.find(l => l.id === leadId);
      if (current) setSelectedLead(current);
    } catch (err) {
      console.error('Error triggering stripe payment:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-zinc-400">Connexion au backend SQLite (http://localhost:3001)...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Header with KPI & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        leads={leads}
        stripeEvents={stripeEvents}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
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
                stripeEvents={stripeEvents}
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
