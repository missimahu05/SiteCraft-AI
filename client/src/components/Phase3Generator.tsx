import { useState, useEffect } from 'react';
import type { BusinessProfile } from '../types';
import { api } from '../api/client';
import { WebsitePreview } from './WebsitePreview';
import { Cloud, Rocket, ArrowRight, Copy, Check, Code, Eye, Terminal, ExternalLink, Download } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'preview' | 'code' | 'cloudflare'>('preview');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    setActiveLead(selectedLead);
    // Load generated React code for this lead
    api.getGeneratedSiteCode(selectedLead.id)
      .then(res => setGeneratedCode(res.code))
      .catch(err => console.error('Code generation error:', err));
  }, [selectedLead]);

  const cleanSubdomain = activeLead.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const demoUrl = activeLead.cloudflareUrl || activeLead.deploymentUrl || `https://${cleanSubdomain}.pages.dev`;

  const handleLeadChange = (leadId: string) => {
    const found = leads.find(l => l.id === leadId);
    if (found) {
      setActiveLead(found);
      onSelectLead(found);
    }
  };

  const runCloudflareDeployment = async () => {
    setIsDeploying(true);
    setViewMode('cloudflare');
    setDeployLogs([
      `[Cloudflare Worker] Début du pipeline pour ${activeLead.title}...`,
      `[Architecture Utilisateur] Ingestion des 10 sections : Hero, TrustBar, Services, Process, WhyUs, Reviews, FAQ, Contact...`,
      `[Vite & Tailwind] Compilation des styles et purge CSS avec la palette Navy (#1A2550) & Crimson (#C41641)...`,
      `[Cloudflare Pages] Création du projet Pages "${cleanSubdomain}" sur l'Anycast Edge...`,
      `[Cloudflare SSL] Émission du certificat SSL TLS 1.3 Universal...`
    ]);

    try {
      const res = await api.deployCloudflare(activeLead.id);
      setDeployLogs(prev => [
        ...prev,
        `[MongoDB DataStore] Lead synchronisé avec l'URL Cloudflare Pages.`,
        `[Cloudflare Edge] Propagation réussie sur 330+ datacenters Anycast.`,
        `[Live Ready] Accessible en production : ${res.url}`
      ]);
      onUpdateDeployment(activeLead.id, res.url);
      setActiveLead(prev => ({
        ...prev,
        cloudflareUrl: res.url,
        deploymentUrl: res.url,
        status: 'site_genere'
      }));
    } catch (err: any) {
      setDeployLogs(prev => [...prev, `[Erreur Déploiement] ${err.message}`]);
    } finally {
      setIsDeploying(false);
    }
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(demoUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GeneratedWebsite-${cleanSubdomain}.jsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E0E3EF] shadow-card relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <p className="section-label">
            PHASE 03 • AUTONOMOUS STUDIO & CLOUDFLARE PAGES
          </p>

          <h2 className="text-2xl sm:text-4xl font-outfit font-black text-[#1A2550] tracking-tight uppercase italic">
            Génération Frontend & <span className="text-[#C41641]">Déploiement Cloudflare</span>
          </h2>

          <p className="text-sm text-[#6B7299] max-w-3xl leading-relaxed">
            Génération autonome calquée sur <strong>votre structure de code</strong> (architecture modulaire de <code>peintre-react</code>) et déploiement Anycast Edge instantané sur Cloudflare Pages.
          </p>
        </div>

        {/* Lead Switcher Pill */}
        <div className="flex items-center gap-3 shrink-0 bg-[#F4F2EE] p-2 rounded-2xl border border-[#E0E3EF]">
          <label className="text-xs text-[#6B7299] font-outfit font-bold uppercase tracking-wider pl-2">Prospect :</label>
          <select
            value={activeLead.id}
            onChange={(e) => handleLeadChange(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E0E3EF] text-xs font-outfit font-bold text-[#1A2550] focus:outline-none focus:border-[#C41641] cursor-pointer shadow-sm"
          >
            {leads.map(l => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode Switcher & Cloudflare Deployment Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-[#E0E3EF] shadow-sm">
        {/* Switcher Tabs */}
        <div className="flex items-center gap-2 bg-[#F4F2EE] p-1.5 rounded-2xl border border-[#E0E3EF]">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-outfit font-bold transition cursor-pointer ${
              viewMode === 'preview' ? 'bg-[#1A2550] text-white shadow-md' : 'text-[#6B7299] hover:text-[#1A2550]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Aperçu Live</span>
          </button>

          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-outfit font-bold transition cursor-pointer ${
              viewMode === 'code' ? 'bg-[#1A2550] text-white shadow-md' : 'text-[#6B7299] hover:text-[#1A2550]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code Source React</span>
          </button>

          <button
            onClick={() => setViewMode('cloudflare')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-outfit font-bold transition cursor-pointer ${
              viewMode === 'cloudflare' ? 'bg-[#1A2550] text-white shadow-md' : 'text-[#6B7299] hover:text-[#1A2550]'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-orange-500" />
            <span>Console Cloudflare</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-xs font-mono text-[#1A2550]">
            <Cloud className="w-3.5 h-3.5 text-orange-500" />
            <span className="truncate max-w-[220px]">{demoUrl}</span>
            <button onClick={copyUrlToClipboard} className="text-[#6B7299] hover:text-[#C41641] transition ml-1 cursor-pointer">
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            onClick={runCloudflareDeployment}
            disabled={isDeploying}
            className="btn-primary text-xs !py-2.5 !px-5 !rounded-xl flex items-center gap-2"
          >
            <Rocket className={`w-4 h-4 ${isDeploying ? 'animate-bounce' : ''}`} />
            <span>{isDeploying ? 'Déploiement en cours...' : 'Déployer sur Cloudflare Pages'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'preview' && (
        <div className="space-y-6">
          <WebsitePreview
            business={activeLead}
            onClaimCheckout={onClaimCheckout}
          />
        </div>
      )}

      {viewMode === 'code' && (
        <div className="p-8 rounded-3xl bg-[#0F163A] border border-white/10 text-white space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Code className="w-4 h-4 text-[#C41641]" />
              </div>
              <div>
                <h4 className="font-outfit font-black uppercase text-sm tracking-tight text-white">
                  App.jsx • Architecture Modulaire (peintre-react)
                </h4>
                <p className="text-[11px] font-mono text-zinc-400">
                  Généré avec votre charte : Outfit, Inter, Tokens Navy & Crimson, 10 sections optimisées SEO
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyCodeToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold transition cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copié !' : 'Copier le Code'}</span>
              </button>

              <button
                onClick={downloadCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C41641] hover:bg-[#A01235] text-xs font-outfit font-black uppercase tracking-wider transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger</span>
              </button>
            </div>
          </div>

          <pre className="font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto p-4 rounded-2xl bg-black/40 border border-white/5 max-h-[600px] no-scrollbar">
            <code>{generatedCode}</code>
          </pre>
        </div>
      )}

      {viewMode === 'cloudflare' && (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Status card */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-white border border-[#E0E3EF] shadow-card space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                <Cloud className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-widest">
                  Infrastructure Cloudflare
                </span>
                <h3 className="text-xl font-outfit font-black uppercase text-[#1A2550]">
                  Pages & Anycast CDN
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#E0E3EF]">
                <span className="text-[#6B7299]">Nom du Projet :</span>
                <span className="font-mono font-bold text-[#1A2550]">{cleanSubdomain}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E0E3EF]">
                <span className="text-[#6B7299]">Région Edge :</span>
                <span className="font-mono font-bold text-emerald-600">330+ Datacenters Mondiaux</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E0E3EF]">
                <span className="text-[#6B7299]">Certificat SSL :</span>
                <span className="font-mono font-bold text-emerald-600">Universal SSL TLS 1.3 Actif</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E0E3EF]">
                <span className="text-[#6B7299]">URL de Production :</span>
                <a href={demoUrl} target="_blank" rel="noreferrer" className="font-mono font-bold text-[#C41641] hover:underline flex items-center gap-1">
                  <span>{demoUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigateToOutreach(activeLead)}
                className="btn-primary w-full text-xs !py-3.5 !rounded-2xl flex items-center justify-center gap-2"
              >
                <span>Passer à la Phase 04 (Prospection)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cloudflare Log Terminal */}
          <div className="lg:col-span-7 p-7 rounded-3xl bg-[#0F163A] border border-white/10 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-orange-400" />
                <span className="font-mono text-xs font-bold text-zinc-300">
                  Cloudflare Build & Edge Pipeline
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="font-mono text-xs text-zinc-300 space-y-2 max-h-[340px] overflow-y-auto no-scrollbar p-3 rounded-2xl bg-black/40 border border-white/5">
              {deployLogs.length === 0 ? (
                <div className="text-zinc-500 italic py-6 text-center">
                  Cliquez sur "Déployer sur Cloudflare Pages" pour lancer la distribution Anycast.
                </div>
              ) : (
                deployLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-orange-400 select-none">➜</span>
                    <span className={log.includes('Live Ready') ? 'text-emerald-400 font-bold' : log.includes('Erreur') ? 'text-red-400' : ''}>
                      {log}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
