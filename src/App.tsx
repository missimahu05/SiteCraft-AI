import { useState } from 'react';
import { initialLeads } from './data/mockLeads';
import type { BusinessProfile, ActiveTab, StripeEvent } from './types';
import { Header } from './components/Header';
import { Phase1Discovery } from './components/Phase1Discovery';
import { Phase2Audit } from './components/Phase2Audit';
import { Phase3Generator } from './components/Phase3Generator';
import { Phase4Outreach } from './components/Phase4Outreach';
import { Phase5Closing } from './components/Phase5Closing';
import { PdfExportModal } from './components/PdfExportModal';

export function App() {
  const [leads, setLeads] = useState<BusinessProfile[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<BusinessProfile>(initialLeads[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('discovery');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const [stripeEvents, setStripeEvents] = useState<StripeEvent[]>([
    {
      id: 'evt_sample_01',
      type: 'checkout.session.completed',
      amount: 490,
      businessName: 'Boulangerie Artisanale Le Pain Doré',
      domain: 'boulangerie-lepaindore.fr',
      status: 'paid',
      timestamp: '14:23:10',
      webhookTriggered: {
        n8nWorkflow: true,
        domainTicket: true,
        twilioSms: true,
        prodTransition: true
      }
    }
  ]);

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

  const handleAddNewLead = (newLead: BusinessProfile) => {
    setLeads(prev => [newLead, ...prev]);
    setSelectedLead(newLead);
  };

  const handleUpdateLeadAudit = (leadId: string, auditData: any) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, audit: auditData, status: 'qualifie' } : l));
    if (selectedLead.id === leadId) {
      setSelectedLead(prev => ({ ...prev, audit: auditData, status: 'qualifie' }));
    }
  };

  const handleUpdateDeployment = (leadId: string, url: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, deploymentUrl: url, status: 'site_genere' } : l));
    if (selectedLead.id === leadId) {
      setSelectedLead(prev => ({ ...prev, deploymentUrl: url, status: 'site_genere' }));
    }
  };

  const handleAddStripeEvent = (event: StripeEvent) => {
    setStripeEvents(prev => [event, ...prev]);
  };

  const handleMarkLeadClaimed = (leadId: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, claimed: true, status: 'cloture' } : l));
    if (selectedLead.id === leadId) {
      setSelectedLead(prev => ({ ...prev, claimed: true, status: 'cloture' }));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Header with KPI & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        leads={leads}
        stripeEvents={stripeEvents}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
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
            onUpdateLeadAudit={handleUpdateLeadAudit}
            onNavigateToGenerator={handleNavigateToGenerator}
          />
        )}

        {activeTab === 'generator' && (
          <Phase3Generator
            selectedLead={selectedLead}
            leads={leads}
            onSelectLead={handleSelectLead}
            onUpdateDeployment={handleUpdateDeployment}
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
            onAddStripeEvent={handleAddStripeEvent}
            onMarkLeadClaimed={handleMarkLeadClaimed}
          />
        )}
      </main>

      {/* PDF Export Modal */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        leads={leads}
      />
    </div>
  );
}

export default App;
