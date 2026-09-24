import { useState } from 'react';
import type { ActiveTab, BusinessProfile, StripeEvent } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Eye,
  Cloud,
  Send,
  CreditCard,
  FileDown,
  Settings,
  Bot,
  Menu,
  X
} from 'lucide-react';

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
  onOpenSettings,
}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.rating >= 3.8 && l.reviewsCount >= 15).length;
  const generatedSites = leads.filter(
    l => l.status === 'site_genere' || l.status === 'généré' || l.status === 'contacte' || l.status === 'clos'
  ).length;
  const closedCount = leads.filter(l => l.status === 'clos' || l.status === 'cloture').length;
  const revenueXof = closedCount * 300000;

  const tabs: {
    id: ActiveTab;
    label: string;
    step: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'discovery', label: 'Discovery & Cartographie', step: '01', icon: MapPin },
    { id: 'audit', label: 'Audit Vision & Scoring LLM', step: '02', icon: Eye },
    { id: 'generator', label: 'Studio Cloudflare Anycast', step: '03', icon: Cloud },
    { id: 'outreach', label: 'Mockup & Prospection', step: '04', icon: Send },
    { id: 'closing', label: 'Closing & Passerelle FeexPay', step: '05', icon: CreditCard },
    { id: 'swarm', label: 'Essaim Autonome Antigravity', step: '06', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-50 pt-2 sm:pt-3 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200 shadow-[0_4px_25px_rgba(15,23,42,0.06)] px-4 sm:px-6 py-3 sm:py-3.5 flex flex-col gap-3">
        {/* Top Brand & KPI Bar */}
        <div className="flex items-center justify-between gap-3">
          {/* Brand Identity & FeexPay-inspired Sandbox Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center font-outfit font-black text-white text-sm shadow-sm">
                SC
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-outfit font-black tracking-tight text-[#0F172A] flex items-center gap-1 uppercase italic">
                    SiteCraft<span className="text-[#EA580C]">.AI</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA] uppercase">
                    Sandbox
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions Desk (FeexPay Dashboard Style) */}
          <div className="hidden lg:flex items-center gap-2.5 text-xs">
            {/* Leads Pill */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold">Leads :</span>
              <span className="font-outfit font-black text-[#0F172A] text-sm">{totalLeads}</span>
            </div>

            {/* Qualified Pill */}
            <div className="px-3 py-1.5 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
              <span className="text-[#EA580C] text-[11px] uppercase tracking-wider font-semibold">Qualifiés :</span>
              <span className="font-outfit font-black text-[#EA580C] text-sm">{qualifiedLeads}</span>
            </div>

            {/* Cloudflare Deployments */}
            <div className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-sky-900 text-[11px] uppercase tracking-wider font-semibold">Cloudflare :</span>
              <span className="font-outfit font-black text-sky-700 text-sm">{generatedSites}</span>
            </div>

            {/* FeexPay Total Balance with Yellow Highlight Badge */}
            <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 shadow-sm">
              <CreditCard className="w-3.5 h-3.5 text-[#EA580C]" />
              <span className="text-slate-600 text-[11px] uppercase tracking-wider font-bold">Total Balance :</span>
              <span className="px-2 py-0.5 rounded-md bg-[#FEF08A] text-slate-900 font-mono font-black text-xs border border-amber-300">
                {revenueXof > 0 ? `${revenueXof.toLocaleString('fr-FR')} F` : '0 F'}
              </span>
            </div>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-outfit font-bold transition text-xs border border-slate-200 shadow-sm cursor-pointer min-h-[38px]"
              title="Configurer les clés d'API (MongoDB, Cloudflare, FeexPay, OpenAI)"
              aria-label="Configurer les API"
            >
              <Settings className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>APIs</span>
            </button>

            {/* PDF Export Button */}
            <button
              onClick={onOpenPdfModal}
              className="btn-primary text-xs !py-1.5 !px-3.5 !rounded-xl !min-h-[38px]"
              aria-label="Exporter le dossier PDF d'audit"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Dossier PDF</span>
            </button>

            {/* User Avatar Circle (Jolidon Houngue) FeexPay Header Pattern */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#9333EA] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                JH
              </div>
              <span className="text-xs font-semibold text-slate-700 hidden xl:inline">Jolidon Houngue</span>
              <span className="text-xs">🇧🇯</span>
            </div>
          </div>

          {/* Mobile Right Controls: Hamburger + Settings */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-100 text-[#0F172A] hover:bg-slate-200 transition border border-slate-200"
              aria-label="Paramètres"
            >
              <Settings className="w-4 h-4 text-[#EA580C]" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shadow-md min-w-[44px] min-h-[44px]"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Phase Tabs with Animated Pill */}
        <nav
          className="hidden md:flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 relative items-center gap-1 overflow-x-auto no-scrollbar"
          aria-label="Navigation des phases du pipeline"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-outfit uppercase tracking-tight transition-all duration-200 cursor-pointer min-h-[42px] ${
                  isActive ? 'text-white font-black' : 'text-slate-600 hover:text-[#0F172A] font-bold hover:bg-white/60'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-[#EA580C] rounded-xl shadow-md z-[-1]"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                  }`}
                >
                  {tab.step}
                </span>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#EA580C]'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden pt-2 border-t border-[#E0E3EF] flex flex-col gap-2"
            >
              {/* Mobile KPIs */}
              <div className="grid grid-cols-2 gap-2 text-xs py-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Leads Totaux</span>
                  <span className="text-base font-outfit font-black text-[#0F172A]">{totalLeads}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex flex-col">
                  <span className="text-[10px] text-[#EA580C] uppercase font-semibold">Qualifiés</span>
                  <span className="text-base font-outfit font-black text-[#EA580C]">{qualifiedLeads}</span>
                </div>
              </div>

              {/* Mobile Tabs */}
              <div className="flex flex-col gap-1.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-outfit transition cursor-pointer min-h-[44px] ${
                        isActive
                          ? 'bg-[#0F172A] text-white font-extrabold shadow-sm'
                          : 'bg-white text-slate-700 font-bold hover:bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-[#EA580C] text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {tab.step}
                        </span>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#EA580C]' : 'text-slate-500'}`} />
                        <span>{tab.label}</span>
                      </div>
                      {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    onOpenPdfModal();
                    setMobileMenuOpen(false);
                  }}
                  className="btn-primary text-xs !py-2.5 !w-full"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Dossier PDF</span>
                </button>
                <button
                  onClick={() => {
                    onOpenSettings();
                    setMobileMenuOpen(false);
                  }}
                  className="btn-secondary text-xs !py-2.5 !w-full"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Clés d'API</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
