import type { ActiveTab, BusinessProfile, StripeEvent } from '../types';
import { Sparkles, MapPin, Eye, Code2, Send, CreditCard, FileDown, TrendingUp } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  leads: BusinessProfile[];
  stripeEvents: StripeEvent[];
  onOpenPdfModal: () => void;
}

export const Header = ({
  activeTab,
  setActiveTab,
  leads,
  stripeEvents,
  onOpenPdfModal
}: HeaderProps) => {
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.rating >= 3.8 && l.reviewsCount >= 15).length;
  const generatedSites = leads.filter(l => l.status === 'site_genere' || l.status === 'contacte' || l.status === 'cloture').length;
  const revenue = stripeEvents.filter(e => e.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'discovery', label: '1. Discovery & Scraping', icon: MapPin },
    { id: 'audit', label: '2. Audit Vision & Scoring', icon: Eye },
    { id: 'generator', label: '3. Studio Frontend & Vercel', icon: Code2 },
    { id: 'outreach', label: '4. Mockup & Prospection', icon: Send },
    { id: 'closing', label: '5. Stripe & Closing', icon: CreditCard },
  ];

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
      {/* Top Brand & Metrics Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">SiteCraft-AI</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                AUTONOMOUS AGENCY
              </span>
            </div>
            <p className="text-xs text-zinc-400">Pipeline de prospection, audit vision & génération web IA</p>
          </div>
        </div>

        {/* Agency KPIs */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-2">
            <span className="text-zinc-500">Leads identifiés :</span>
            <span className="font-bold text-white font-mono">{totalLeads}</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-2">
            <span className="text-zinc-500">Qualifiés (≥3.8★) :</span>
            <span className="font-bold text-emerald-400 font-mono">{qualifiedLeads}</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-2">
            <span className="text-zinc-500">Prototypes prêts :</span>
            <span className="font-bold text-teal-300 font-mono">{generatedSites}</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-400">Revenus Stripe :</span>
            <span className="font-bold text-emerald-400 font-mono">{revenue} €</span>
          </div>

          {/* PDF Export Button */}
          <button
            onClick={onOpenPdfModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition text-xs shadow-sm cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-teal-400" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
