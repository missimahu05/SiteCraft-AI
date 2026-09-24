import { useState, useEffect } from 'react';
import type { BusinessProfile } from '../types';
import { api } from '../api/client';
import { MotionReveal } from './motion/MotionReveal';
import {
  Eye,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Lock,
  Smartphone,
  Monitor,
  Flame,
  Zap,
  Target
} from 'lucide-react';

interface Phase2Props {
  selectedLead: BusinessProfile;
  leads: BusinessProfile[];
  onSelectLead: (lead: BusinessProfile) => void;
  onUpdateLeadAudit: (leadId: string, audit: any) => void;
  onNavigateToGenerator: (lead: BusinessProfile) => void;
}

export const Phase2Audit = ({
  selectedLead,
  leads,
  onSelectLead,
  onUpdateLeadAudit,
  onNavigateToGenerator,
}: Phase2Props) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeLead, setActiveLead] = useState<BusinessProfile>(selectedLead);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    setActiveLead(selectedLead);
  }, [selectedLead]);

  const handleLeadChange = (leadId: string) => {
    const found = leads.find((l) => l.id === leadId);
    if (found) {
      setActiveLead(found);
      onSelectLead(found);
    }
  };

  const runVisionAudit = async () => {
    setIsAuditing(true);
    try {
      const newAudit = await api.runAudit(activeLead.id);
      onUpdateLeadAudit(activeLead.id, newAudit);
      setActiveLead((prev) => ({
        ...prev,
        audit: newAudit,
        status: 'qualifie',
      }));
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const audit = activeLead.audit;
  const isEligibleForRedesign = audit ? audit.score_global < 6.5 || audit.eligible_refonte : false;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <MotionReveal direction="up" delay={0.05}>
        <div className="glass-card p-6 sm:p-8 relative overflow-hidden border border-white/80 shadow-md">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/10 via-rose-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#EA580C] text-xs font-outfit font-extrabold uppercase tracking-widest">
                <Target className="w-3.5 h-3.5" />
                <span>Phase 02 • Multimodal Vision LLM Scoring</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-outfit font-black text-[#0F172A] tracking-tight uppercase">
                Audit Vision & <span className="text-[#EA580C]">Scoring Algorithmique</span>
              </h2>

              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                Capture de l'état réel et scoring multi-facteurs sur 4 critères décisifs. Règle stricte :
                si <strong className="text-slate-900 font-bold">Score &lt; 6.5/10</strong> ou absence totale de vitrine,
                l'établissement est instantanément certifié éligible pour la génération du nouveau site.
              </p>
            </div>

            {/* Lead Selector Dropdown */}
            <div className="flex items-center gap-3 shrink-0 bg-slate-100/90 p-2 rounded-2xl border border-slate-200 shadow-sm">
              <label htmlFor="lead-select" className="text-xs text-slate-600 font-outfit font-bold uppercase tracking-wider pl-2">
                Prospect :
              </label>
              <select
                id="lead-select"
                value={activeLead.id}
                onChange={(e) => handleLeadChange(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-outfit font-bold text-[#0F172A] focus:outline-none focus:border-[#EA580C] cursor-pointer shadow-sm"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title} ({l.website ? 'Avec site' : 'Sans site'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </MotionReveal>

      {/* Main Grid: Viewport Simulator vs Scoring Breakdown */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Viewport Simulation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <MotionReveal direction="up" delay={0.1}>
            <div className="glass-card p-5 sm:p-7 space-y-4">
              {/* Browser Window Chrome */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                  <span className="ml-2 text-xs font-mono text-slate-500 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span className="truncate max-w-[200px] sm:max-w-xs">{activeLead.website || 'https://non-existant.local'}</span>
                  </span>
                </div>

                {/* Desktop / Mobile toggle */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    onClick={() => setViewportMode('desktop')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-outfit font-bold transition cursor-pointer ${
                      viewportMode === 'desktop' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>1440px</span>
                  </button>
                  <button
                    onClick={() => setViewportMode('mobile')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-outfit font-bold transition cursor-pointer ${
                      viewportMode === 'mobile' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>390px</span>
                  </button>
                </div>
              </div>

              {/* Viewport Frame */}
              <div className="relative aspect-[16/10] bg-slate-900 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-center items-center text-center p-6 sm:p-10 group">
                {activeLead.website ? (
                  /* Outdated Site Visual Simulation */
                  <div className="w-full h-full p-6 bg-gradient-to-br from-amber-950/80 to-slate-900 border border-amber-500/30 rounded-xl flex flex-col items-center justify-center space-y-4 text-white">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 text-2xl font-outfit font-black">
                      90's
                    </div>
                    <div className="space-y-1.5 max-w-md">
                      <p className="font-outfit font-black text-base text-amber-300 uppercase tracking-tight">
                        Site Web Obsolète & Non-Optimisé
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Stack dépassée, temps de rendu supérieur à 4.5s sur mobile, aucun bouton d'appel direct,
                        mise en page non-responsive causant de l'abandon de panier.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 text-xs">
                      <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10 font-mono text-[10px]">
                        Lighthouse Perf: 28/100
                      </span>
                      <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-[10px]">
                        Temps de chargement &gt; 4.8s
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Missing Site Case */
                  <div className="w-full h-full p-6 bg-gradient-to-br from-orange-950/70 to-slate-900 border border-orange-500/30 rounded-xl flex flex-col items-center justify-center space-y-4 text-white">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-[#EA580C]">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5 max-w-md">
                      <h4 className="font-outfit font-black text-white text-lg tracking-tight uppercase">
                        Aucun Site Web Référencé
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Ce commerce jouit d'une forte notoriété locale ({activeLead.rating}★ pour {activeLead.reviewsCount} avis)
                        mais abandonne 100% du trafic de recherche aux concurrents équipés.
                      </p>
                    </div>
                    <span className="text-xs px-4 py-1.5 rounded-full bg-[#EA580C] text-white font-outfit font-black uppercase tracking-wider shadow-lg shadow-orange-900/50">
                      Opportunité Création Immédiate (300 000 FCFA)
                    </span>
                  </div>
                )}

                {/* Laser Scanning Animation Overlay */}
                {isAuditing && (
                  <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center space-y-4 text-white">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#EA580C] to-transparent animate-pulse shadow-[0_0_20px_#EA580C]" />
                    <div className="w-12 h-12 border-3 border-[#EA580C] border-t-transparent rounded-full animate-spin" />
                    <div className="text-center font-outfit text-xs text-white space-y-1">
                      <p className="font-black tracking-wider uppercase text-sm">Audit Vision Multimodale GPT-4o en cours...</p>
                      <p className="text-slate-400 text-[11px]">Évaluation Modernité • Lisibilité • CTA • Conversion</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Scan Trigger */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-xs text-slate-500 font-mono">
                  {audit ? `Dernier audit : ${audit.auditDate}` : 'En attente d\'analyse vision'}
                </span>

                <button
                  disabled={isAuditing}
                  onClick={runVisionAudit}
                  className="btn-primary text-xs !py-2.5 !px-4"
                  aria-label="Lancer l'audit vision multimodale"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                  <span>{audit ? 'Re-scanner Vision LLM' : 'Lancer l\'Audit Vision LLM'}</span>
                </button>
              </div>
            </div>
          </MotionReveal>
        </div>

        {/* Right: AI Score Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <MotionReveal direction="up" delay={0.15}>
            <div className="glass-card p-5 sm:p-7 space-y-6">
              {audit ? (
                <div className="space-y-6">
                  {/* Global Score Gauge */}
                  <div className="p-5 rounded-2xl bg-slate-100/90 border border-slate-200 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-outfit uppercase text-slate-500 font-bold tracking-widest">
                        Score Global Vision
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-5xl font-outfit font-black tracking-tight ${
                            audit.score_global < 6.5 ? 'text-[#EA580C]' : 'text-emerald-600'
                          }`}
                        >
                          {audit.score_global.toFixed(1)}
                        </span>
                        <span className="text-slate-500 text-sm font-bold">/ 10</span>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      {isEligibleForRedesign ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C] uppercase tracking-wider font-outfit">
                          <ShieldAlert className="w-3.5 h-3.5 text-[#EA580C]" /> Éligible Refonte
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 border border-emerald-200 text-emerald-700 uppercase tracking-wider font-outfit">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Site Conforme
                        </span>
                      )}
                      <p className="text-[10px] font-mono text-slate-500">Seuil de qualification : &lt; 6.5 / 10</p>
                    </div>
                  </div>

                  {/* 4 Key Criteria Bars */}
                  {(() => {
                    const criteres = audit.criteres || {
                      modernite: Math.round((audit.mobile || 35) / 10),
                      lisibilite: Math.round((audit.seo || 40) / 10),
                      cta: Math.round((audit.performance || 45) / 10),
                      visuels: 4,
                    };
                    const defauts = audit.defauts_majeurs || audit.points_faibles || [
                      'Absence de site moderne responsive pour smartphones',
                      'Aucun bouton d\'appel direct en 1 clic visible',
                      'Perte massive de clients locaux cherchant sur Google',
                    ];

                    return (
                      <>
                        <div className="space-y-3.5 text-xs">
                          <h4 className="font-outfit font-black text-[#0F172A] uppercase tracking-wider text-xs">
                            Décomposition des 4 Piliers
                          </h4>

                          <div className="space-y-1">
                            <div className="flex justify-between text-slate-700 font-semibold">
                              <span>1. Modernité Visuelle & Design System</span>
                              <span className="font-mono font-bold text-[#EA580C]">{criteres.modernite} / 10</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className="h-full bg-[#EA580C] rounded-full transition-all duration-700"
                                style={{ width: `${criteres.modernite * 10}%` }}
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-slate-700 font-semibold">
                              <span>2. Lisibilité & Fluidité Mobile</span>
                              <span className="font-mono font-bold text-[#EA580C]">{criteres.lisibilite} / 10</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className="h-full bg-[#EA580C] rounded-full transition-all duration-700"
                                style={{ width: `${criteres.lisibilite * 10}%` }}
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-slate-700 font-semibold">
                              <span>3. Clarté CTA & Conversion Directe</span>
                              <span className="font-mono font-bold text-[#C2410C]">{criteres.cta} / 10</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className="h-full bg-[#C2410C] rounded-full transition-all duration-700"
                                style={{ width: `${criteres.cta * 10}%` }}
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-slate-700 font-semibold">
                              <span>4. Avis Certifiés & Réputation Google</span>
                              <span className="font-mono font-bold text-[#0F172A]">{criteres.visuels} / 10</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className="h-full bg-[#0F172A] rounded-full transition-all duration-700"
                                style={{ width: `${criteres.visuels * 10}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Defauts list */}
                        <div className="space-y-2 pt-2">
                          <h4 className="font-outfit font-black text-[#0F172A] uppercase tracking-wider text-xs flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-[#EA580C]" />
                            <span>Défauts Majeurs Constatés</span>
                          </h4>
                          <div className="space-y-1.5">
                            {defauts.map((defaut: string, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 text-xs text-slate-700 p-2.5 rounded-xl bg-[#FFF7ED] border border-[#FED7AA]"
                              >
                                <span className="text-[#EA580C] font-black shrink-0">•</span>
                                <span className="leading-snug">{defaut}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}

                  {/* Forward button to Generator */}
                  <div className="pt-4 border-t border-slate-200">
                    <button
                      onClick={() => onNavigateToGenerator(activeLead)}
                      className="btn-primary w-full !py-3.5 text-sm"
                      aria-label="Transmettre au Studio Frontend"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Transmettre au Studio Frontend</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                    <Eye className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-outfit font-black text-[#0F172A] uppercase">
                      Aucun audit calculé
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Cliquez sur le bouton ci-dessous pour déclencher l'analyse visuelle multimodale par GPT-4o.
                    </p>
                  </div>
                  <button onClick={runVisionAudit} className="btn-primary mx-auto text-xs !py-2.5 !px-5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Démarrer l'analyse maintenant</span>
                  </button>
                </div>
              )}
            </div>
          </MotionReveal>
        </div>
      </div>
    </div>
  );
};

export default Phase2Audit;
