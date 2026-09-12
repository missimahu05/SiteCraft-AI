import type { ActiveTab, BusinessProfile, StripeEvent } from '../types';
import { MapPin, Eye, Cloud, Send, CreditCard, FileDown, Settings, Bot } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  leads: BusinessProfile[];
  stripeEvents?: StripeEvent[];
  onOpenPdfModal: () => void;
  onOpenSettings: () => void;
}

export const Header = ({
  activeTab,
  setActiveTab,
  leads,
  onOpenPdfModal,
  onOpenSettings
}: HeaderProps) => {
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.rating >= 3.8 && l.reviewsCount >= 15).length;
  const generatedSites = leads.filter(l => l.status === 'site_genere' || l.status === 'généré' || l.status === 'contacte' || l.status === 'clos').length;
  const closedCount = leads.filter(l => l.status === 'clos' || l.status === 'cloture').length;
  const revenueXof = closedCount * 300000; // 300 000 FCFA / site
  const revenueEur = closedCount * 490;

  const tabs: { id: ActiveTab; label: string; step: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'discovery', label: 'Discovery & Carte Maps', step: '01', icon: MapPin },
    { id: 'audit', label: 'Audit Vision & Scoring', step: '02', icon: Eye },
    { id: 'generator', label: 'Studio Cloudflare Pages', step: '03', icon: Cloud },
    { id: 'outreach', label: 'Mockup & Prospection', step: '04', icon: Send },
    { id: 'closing', label: 'FeexPay & Closing 490€', step: '05', icon: CreditCard },
    { id: 'swarm', label: 'Essaim IA Antigravity', step: '06', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-50 pt-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl border border-[#E0E3EF] shadow-[0_4px_25px_rgba(13,18,33,0.06)] px-6 py-4 flex flex-col gap-3.5">
        {/* Top Brand & KPI Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3.5 group cursor-pointer">
            <div className="w-11 h-11 bg-[#1A2550] rounded-xl flex items-center justify-center font-outfit font-black text-white text-base shadow-md tracking-tighter">
              SC<span className="text-[#C41641] text-lg leading-none">.</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-outfit font-black text-2xl tracking-tighter uppercase italic text-[#1A2550]">
                  SiteCraft<span className="text-[#C41641]">.AI</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest bg-[#FDF1F3] text-[#C41641] border border-[#C41641]/20 font-outfit uppercase">
                  Studio Autonome
                </span>
              </div>
              <p className="text-[11px] text-[#6B7299] font-medium hidden sm:block">
                Agence Web IA • Scraping Google Maps • Audit Vision • Cloudflare Pages • Closing FeexPay
              </p>
            </div>
          </div>

          {/* KPI Badges & Quick Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] flex items-center gap-2">
              <span className="text-[#6B7299] text-[11px] uppercase tracking-wider font-semibold">Leads :</span>
              <span className="font-outfit font-black text-[#1A2550] text-sm">{totalLeads}</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-[#FDF1F3] border border-[#C41641]/20 flex items-center gap-2">
              <span className="text-[#C41641] text-[11px] uppercase tracking-wider font-semibold">Qualifiés :</span>
              <span className="font-outfit font-black text-[#C41641] text-sm">{qualifiedLeads}</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-[#FFF4ED] border border-orange-200 flex items-center gap-2">
              <Cloud className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-orange-800 text-[11px] uppercase tracking-wider font-semibold">Cloudflare :</span>
              <span className="font-outfit font-black text-orange-600 text-sm">{generatedSites}</span>
            </div>

            {/* Live FeexPay Revenue Pill */}
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="text-emerald-800 text-[11px] uppercase tracking-wider font-semibold">FeexPay CA :</span>
              <span className="font-outfit font-black text-emerald-600 text-sm">
                {revenueXof > 0 ? `${revenueXof.toLocaleString()} F` : '0 F'} <span className="text-[10px] font-mono text-emerald-700">({revenueEur}€)</span>
              </span>
            </div>

            {/* Settings Modal Button */}
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F4F2EE] text-[#1A2550] font-outfit font-bold transition text-xs border border-[#E0E3EF] cursor-pointer shadow-sm"
              title="Configurer les clés d'API (MongoDB, Cloudflare, FeexPay, OpenAI)"
            >
              <Settings className="w-3.5 h-3.5 text-[#C41641]" />
              <span>APIs & BDD</span>
            </button>

            {/* PDF Export Button */}
            <button
              onClick={onOpenPdfModal}
              className="btn-primary text-xs !py-2 !px-4 !rounded-xl"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Dossier PDF</span>
            </button>
          </div>
        </div>

        {/* Bottom Phase Navigation Tabs Pill */}
        <div className="bg-[#F4F2EE] p-1.5 rounded-2xl border border-[#E0E3EF] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer font-outfit ${
                  isActive
                    ? 'bg-[#1A2550] text-white font-black shadow-md'
                    : 'text-[#6B7299] hover:text-[#1A2550] hover:bg-white font-bold'
                }`}
              >
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-[#C41641] text-white font-black' : 'bg-white text-[#6B7299]'
                }`}>
                  {tab.step}
                </span>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#6B7299]'}`} />
                <span className="tracking-tight uppercase">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
