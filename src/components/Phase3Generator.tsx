import { useState, useEffect } from 'react';
import type { BusinessProfile } from '../types';
import { api } from '../api/client';
import { WebsitePreview } from './WebsitePreview';
import { Globe, Rocket, CheckCircle2, ArrowRight, Terminal, Copy, Check } from 'lucide-react';

interface Phase3Props {
  selectedLead: BusinessProfile;
  leads: BusinessProfile[];
  onSelectLead: (lead: BusinessProfile) => void;
  onUpdateDeployment: (leadId: string, url: string) => void;
  onNavigateToOutreach: (lead: BusinessProfile) => void;
  onClaimCheckout: () => void;
}

export const Phase3Generator = ({
  selectedLead,
  leads,
  onSelectLead,
  onUpdateDeployment,
  onNavigateToOutreach,
  onClaimCheckout
}: Phase3Props) => {
  const [activeLead, setActiveLead] = useState<BusinessProfile>(selectedLead);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    setActiveLead(selectedLead);
  }, [selectedLead]);

  const cleanSubdomain = activeLead.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const demoUrl = activeLead.deploymentUrl || `https://${cleanSubdomain}-demo.vercel.app`;

  const handleLeadChange = (leadId: string) => {
    const found = leads.find(l => l.id === leadId);
    if (found) {
      setActiveLead(found);
      onSelectLead(found);
    }
  };

  const runVercelDeployment = async () => {
    setIsDeploying(true);
    setDeployLogs([
      `[Vercel Deployer] POST /api/deploy/vercel -> Project: "${cleanSubdomain}-demo"`,
      `[Assembler] Ingesting profile JSON into HeroSection.tsx & ClaimBanner.tsx...`,
      `[Tailwind Engine] Compiling Tailwind CSS utilities & dynamic color palettes...`,
      `[SSG Engine] Generating static HTML with optimized Google Maps ratings & photos...`,
      `[Edge Network] Propagating deployment to 300+ global PoPs...`
    ]);

    try {
      const res = await api.deployVercel(activeLead.id);
      setDeployLogs(prev => [
        ...prev,
        `[SQLite Database] Updated lead status to 'site_genere' and saved URL.`,
        `[Deployment Complete] Live URL ready: ${res.url}`
      ]);
      onUpdateDeployment(activeLead.id, res.url);
      setActiveLead(prev => ({
        ...prev,
        deploymentUrl: res.url,
        status: 'site_genere'
      }));
    } catch (err: any) {
      setDeployLogs(prev => [...prev, `[Deployment Error] ${err.message}`]);
    } finally {
      setIsDeploying(false);
    }
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(demoUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Phase 3 : Génération Frontend Autonome & Déploiement Vercel</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
              Next.js 14 / Tailwind / Vercel API
            </span>
          </div>
          <p className="text-sm text-zinc-400 max-w-3xl">
            Assemblage instantané des composants modulaires (HeroSection, ClaimBanner, Avis certifiés, Offres & Horaires) à partir du profil JSON Google Maps.
          </p>
        </div>

        {/* Lead Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs text-zinc-400">Prospect actif :</label>
          <select
            value={activeLead.id}
            onChange={(e) => handleLeadChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {leads.map(l => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Deployment Controller & Code Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Status Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-zinc-500">Statut Vercel</span>
              {activeLead.deploymentUrl ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> En ligne & Actif
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  En attente de déploiement
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white text-base">{activeLead.title}</h3>
              <p className="text-xs text-zinc-400">{activeLead.category} • {activeLead.address}</p>
            </div>

            {/* URL Display */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs truncate">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-zinc-300 truncate">{demoUrl}</span>
              </div>
              <button
                onClick={copyUrlToClipboard}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer shrink-0"
                title="Copier l'URL"
              >
                {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Deploy Trigger Button */}
            <button
              disabled={isDeploying}
              onClick={runVercelDeployment}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer disabled:opacity-50"
            >
              <Rocket className={`w-4 h-4 ${isDeploying ? 'animate-bounce' : ''}`} />
              <span>{isDeploying ? 'Déploiement Vercel en cours...' : (activeLead.deploymentUrl ? 'Re-déployer le prototype' : 'Déployer sur Vercel API')}</span>
            </button>
          </div>

          {/* Vercel Terminal Logs */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2 text-zinc-400 border-b border-zinc-800 pb-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vercel Deploy Engine (Node.js API)</span>
            </div>

            <div className="space-y-1 text-zinc-400 max-h-48 overflow-y-auto">
              {deployLogs.length > 0 ? (
                deployLogs.map((log, i) => (
                  <p key={i} className={i === deployLogs.length - 1 ? 'text-emerald-400 font-bold' : ''}>
                    &gt; {log}
                  </p>
                ))
              ) : (
                <p className="text-zinc-600 italic">&gt; En attente du déclenchement Vercel...</p>
              )}
            </div>
          </div>

          {/* Forward to Phase 4 */}
          <div className="pt-2">
            <button
              onClick={() => onNavigateToOutreach(activeLead)}
              className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Passer à la Phase 4 : Mockup & Prospection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Interactive Live Showcase Preview (8 cols) */}
        <div className="lg:col-span-8 h-[800px]">
          <WebsitePreview
            business={activeLead}
            onClaimCheckout={onClaimCheckout}
            showDeviceBar={true}
          />
        </div>
      </div>
    </div>
  );
};
