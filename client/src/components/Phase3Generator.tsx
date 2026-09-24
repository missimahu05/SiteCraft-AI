import { useState, useEffect } from 'react';
import type { BusinessProfile } from '../types';
import { api } from '../api/client';
import { WebsitePreview } from './WebsitePreview';
import { MotionReveal } from './motion/MotionReveal';
import {
  Cloud,
  Rocket,
  ArrowRight,
  Copy,
  Check,
  Code,
  Eye,
  Download,
  Globe2
} from 'lucide-react';

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
  onClaimCheckout,
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
    api
      .getGeneratedSiteCode(selectedLead.id)
      .then((res) => setGeneratedCode(res.code))
      .catch((err) => console.error('Code generation error:', err));
  }, [selectedLead]);

  const cleanSubdomain = activeLead.title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');
  const demoUrl = activeLead.cloudflareUrl || activeLead.deploymentUrl || `https://${cleanSubdomain}.pages.dev`;

  const handleLeadChange = (leadId: string) => {
    const found = leads.find((l) => l.id === leadId);
    if (found) {
      setActiveLead(found);
      onSelectLead(found);
    }
  };

  const runCloudflareDeployment = async () => {
    setIsDeploying(true);
    setViewMode('cloudflare');
    setDeployLogs([
      `[Cloudflare Worker Anycast] Initialisation du pipeline Edge pour ${activeLead.title}...`,
      `[Architecture Composants] Ingestion des 10 sections certifiées : Hero, Proof, Services, Process, Reviews, FAQ...`,
      `[Vite & Tailwind Purge] Compilation avec tokens sémantiques Ardoise (#0F172A) & FeexPay Orange (#EA580C)...`,
      `[Cloudflare Pages API] Création du projet Pages "${cleanSubdomain}"...`,
      `[SSL Handshake] Émission du certificat universel TLS 1.3 avec chiffrement ECDSA...`,
    ]);

    try {
      const res = await api.deployCloudflare(activeLead.id);
      setDeployLogs((prev) => [
        ...prev,
        `[MongoDB DataStore] Lead synchronisé avec l'URL Cloudflare Pages en production.`,
        `[Cloudflare Global Network] Propagation active sur 330+ points de présence Anycast.`,
        `[Live Ready] Site opérationnel à l'adresse : ${res.url}`,
      ]);
      onUpdateDeployment(activeLead.id, res.url);
      setActiveLead((prev) => ({
        ...prev,
        cloudflareUrl: res.url,
        deploymentUrl: res.url,
        status: 'site_genere',
      }));
    } catch (err: any) {
      setDeployLogs((prev) => [...prev, `[Erreur Déploiement] ${err.message}`]);
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

  const downloadHtml = async () => {
    try {
      const res = await api.getGeneratedSiteHtml(activeLead.id);
      const blob = new Blob([res.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `site-${cleanSubdomain}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading HTML:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <MotionReveal direction="up" delay={0.05}>
        <div className="glass-card p-6 sm:p-8 relative overflow-hidden border border-white/80 shadow-md">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 via-rose-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#EA580C] text-xs font-outfit font-extrabold uppercase tracking-widest">
                <Cloud className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Phase 03 • Autonomous Studio & Cloudflare Pages</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-outfit font-black text-[#0F172A] tracking-tight uppercase">
                Génération Frontend & <span className="text-[#EA580C]">Anycast Cloudflare</span>
              </h2>

              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                Génération autonome de site web haute performance responsive avec l'architecture de composants
                modulaires, optimisations Core Web Vitals (&lt;1.2s) et déploiement mondial Anycast Edge.
              </p>
            </div>

            {/* Lead Switcher Pill */}
            <div className="flex items-center gap-3 shrink-0 bg-slate-100/90 p-2 rounded-2xl border border-slate-200 shadow-sm">
              <label htmlFor="gen-lead-select" className="text-xs text-slate-600 font-outfit font-bold uppercase tracking-wider pl-2">
                Prospect :
              </label>
              <select
                id="gen-lead-select"
                value={activeLead.id}
                onChange={(e) => handleLeadChange(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-outfit font-bold text-[#0F172A] focus:outline-none focus:border-[#EA580C] cursor-pointer shadow-sm"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </MotionReveal>

      {/* Control Strip & Quick Deployment Bar */}
      <MotionReveal direction="up" delay={0.1}>
        <div className="glass-card p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-outfit font-bold transition cursor-pointer ${
                  viewMode === 'preview' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Aperçu Live</span>
              </button>

              <button
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-outfit font-bold transition cursor-pointer ${
                  viewMode === 'code' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Code React</span>
              </button>

              <button
                onClick={() => setViewMode('cloudflare')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-outfit font-bold transition cursor-pointer ${
                  viewMode === 'cloudflare' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Cloud className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Console Cloudflare</span>
              </button>
            </div>

            {/* Right Quick Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-[#0F172A]">
                <Globe2 className="w-3.5 h-3.5 text-cyan-600" />
                <span className="truncate max-w-[200px]">{demoUrl}</span>
                <button
                  onClick={copyUrlToClipboard}
                  className="text-slate-500 hover:text-[#EA580C] transition ml-1 cursor-pointer"
                  title="Copier l'URL"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                onClick={runCloudflareDeployment}
                disabled={isDeploying}
                className="btn-primary text-xs !py-2.5 !px-4 !rounded-xl"
                aria-label="Déployer sur Cloudflare Pages"
              >
                <Rocket className={`w-4 h-4 ${isDeploying ? 'animate-bounce' : ''}`} />
                <span>{isDeploying ? 'Déploiement en cours...' : 'Déployer sur Cloudflare'}</span>
              </button>

              <button
                onClick={() => onNavigateToOutreach(activeLead)}
                className="btn-secondary text-xs !py-2.5 !px-4"
                aria-label="Passer à la prospection"
              >
                <span>Prospection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </MotionReveal>

      {/* Main Content View Switcher */}
      {viewMode === 'preview' && (
        <MotionReveal direction="up" delay={0.15}>
          <div className="space-y-6">
            <WebsitePreview business={activeLead} onClaimCheckout={onClaimCheckout} />
          </div>
        </MotionReveal>
      )}

      {viewMode === 'code' && (
        <MotionReveal direction="up" delay={0.15}>
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0A0F1D] border border-white/10 text-white space-y-4 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Code className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h4 className="font-outfit font-black uppercase text-sm tracking-tight text-white">
                    App.jsx • Architecture Modulaire React
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400">
                    Tokens sémantiques Outfit & Inter • Primitives UI • Sections conversion
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={copyCodeToClipboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono font-bold transition cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copié !' : 'Copier'}</span>
                </button>

                <button
                  onClick={downloadCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-mono font-bold transition cursor-pointer"
                  title="Télécharger le code React"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>App.jsx</span>
                </button>

                <button
                  onClick={downloadHtml}
                  className="btn-primary text-xs !py-1.5 !px-3.5 !rounded-lg"
                  title="Télécharger le site complet en HTML autonome"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>HTML Autonome</span>
                </button>
              </div>
            </div>

            <div className="bg-[#060A14] p-4 rounded-xl border border-white/5 font-mono text-xs text-slate-300 max-h-[500px] overflow-y-auto leading-relaxed">
              <pre>{generatedCode || '// Chargement du code source React généré...'}</pre>
            </div>
          </div>
        </MotionReveal>
      )}

      {viewMode === 'cloudflare' && (
        <MotionReveal direction="up" delay={0.15}>
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0A0F1D] border border-white/10 text-white space-y-5 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-outfit font-black uppercase text-sm tracking-tight text-white flex items-center gap-2">
                    Console Anycast Cloudflare Pages
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400">
                    Projet : {cleanSubdomain} • Latence mondiale &lt; 20ms • TLS 1.3
                  </p>
                </div>
              </div>

              {activeLead.cloudflareUrl && (
                <a
                  href={activeLead.cloudflareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs !py-1.5 !px-3.5 !rounded-lg"
                >
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Ouvrir le Site en Ligne</span>
                </a>
              )}
            </div>

            <div className="bg-[#060A14] p-4 rounded-xl border border-white/5 font-mono text-xs text-slate-300 min-h-[220px] max-h-[380px] overflow-y-auto space-y-2">
              {deployLogs.length > 0 ? (
                deployLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 italic py-8 text-center">
                  Aucun log de déploiement pour le moment. Cliquez sur « Déployer sur Cloudflare » pour lancer la construction Anycast.
                </div>
              )}
            </div>
          </div>
        </MotionReveal>
      )}
    </div>
  );
};

export default Phase3Generator;
