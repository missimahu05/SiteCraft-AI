import { useState, useEffect } from 'react';
import type { BusinessProfile } from '../types';
import { api } from '../api/client';
import { Eye, ShieldAlert, Sparkles, CheckCircle2, ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';

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
  onNavigateToGenerator
}: Phase2Props) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeLead, setActiveLead] = useState<BusinessProfile>(selectedLead);

  useEffect(() => {
    setActiveLead(selectedLead);
  }, [selectedLead]);

  const handleLeadChange = (leadId: string) => {
    const found = leads.find(l => l.id === leadId);
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
      setActiveLead(prev => ({
        ...prev,
        audit: newAudit,
        status: 'qualifie'
      }));
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const audit = activeLead.audit;
  const isEligibleForRedesign = audit ? (audit.score_global < 6.5 || audit.eligible_refonte) : false;

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E0E3EF] shadow-card relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <p className="section-label">
            PHASE 02 • MULTIMODAL VISION LLM SCORING
          </p>

          <h2 className="text-2xl sm:text-4xl font-outfit font-black text-[#1A2550] tracking-tight uppercase italic">
            Audit Vision & <span className="text-[#C41641]">Scoring Algorithmique</span>
          </h2>

          <p className="text-sm text-[#6B7299] max-w-3xl leading-relaxed">
            Évaluation automatique du viewport 1440×900 sur 4 critères clés. Règle absolue : si <strong className="text-[#1A2550]">Score &lt; 6.5</strong> ou absence totale de site web, le prospect est qualifié et transmis directement au studio de génération frontend.
          </p>
        </div>

        {/* Lead Selector Pill */}
        <div className="flex items-center gap-3 shrink-0 bg-[#F4F2EE] p-2 rounded-2xl border border-[#E0E3EF]">
          <label className="text-xs text-[#6B7299] font-outfit font-bold uppercase tracking-wider pl-2">Prospect :</label>
          <select
            value={activeLead.id}
            onChange={(e) => handleLeadChange(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E0E3EF] text-xs font-outfit font-bold text-[#1A2550] focus:outline-none focus:border-[#C41641] cursor-pointer shadow-sm"
          >
            {leads.map(l => (
              <option key={l.id} value={l.id}>{l.title} ({l.website ? 'Avec site' : 'Sans site'})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Capture / Viewport vs AI Score Breakdown */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Viewport Simulation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 sm:p-8 rounded-3xl card-peintre space-y-5">
            {/* Browser Mockup Chrome Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F1F5]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#C41641] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#FBBF24] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#10B981] inline-block" />
                <span className="ml-3 text-[11px] font-mono text-[#6B7299]">
                  Viewport 1440×900 px — Headless Playwright
                </span>
              </div>
              <span className="text-xs font-mono text-[#6B7299] truncate max-w-xs">
                {activeLead.website ? activeLead.website : 'about:blank'}
              </span>
            </div>

            {/* Viewport Frame */}
            <div className="relative aspect-[16/10] bg-[#FAF9F6] rounded-2xl border border-[#E0E3EF] overflow-hidden flex flex-col justify-center items-center text-center p-8 group">
              {activeLead.website ? (
                /* Outdated Site Simulation */
                <div className="w-full h-full p-6 bg-amber-50 border border-dashed border-amber-300 rounded-2xl flex flex-col items-center justify-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 text-2xl font-outfit font-black">
                    90's
                  </div>
                  <div className="space-y-1.5 max-w-md">
                    <p className="font-outfit font-black text-base text-amber-900 uppercase tracking-tight">Site Web Obsolète & Non-Optimisé</p>
                    <p className="text-xs text-[#6B7299] leading-relaxed">
                      Technologies datées, non-optimisé pour smartphones modernes, absence de call-to-action direct et aucun balisage schema.org.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="text-[10px] px-3 py-1 rounded-full bg-white text-[#1A2550] border border-amber-200 font-mono">PagesPerso / Free / Web1.0</span>
                    <span className="text-[10px] px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold">Temps de chargement &gt; 4.8s</span>
                  </div>
                </div>
              ) : (
                /* Missing Site */
                <div className="w-full h-full p-6 bg-[#FDF1F3] border border-dashed border-[#C41641]/30 rounded-2xl flex flex-col items-center justify-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#C41641]/10 border border-[#C41641]/30 flex items-center justify-center text-[#C41641]">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5 max-w-md">
                    <h4 className="font-outfit font-black text-[#1A2550] text-lg tracking-tight uppercase">Aucun Site Web Officiel</h4>
                    <p className="text-xs text-[#6B7299] leading-relaxed">
                      Ce commerce bénéficie d'une excellente réputation Google ({activeLead.rating}★) mais n'a aucune vitrine en ligne, perdant 40% des clients mobiles.
                    </p>
                  </div>
                  <span className="text-xs px-4 py-1.5 rounded-full bg-[#C41641] text-white font-outfit font-black uppercase tracking-wider shadow-sm">
                    Opportunité Création Immédiate
                  </span>
                </div>
              )}

              {/* Laser Scanning Animation Overlay */}
              {isAuditing && (
                <div className="absolute inset-0 bg-[#1A2550]/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 text-white">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C41641] to-transparent animate-pulse shadow-[0_0_20px_#C41641]" />
                  <div className="w-12 h-12 border-3 border-[#C41641] border-t-transparent rounded-full animate-spin" />
                  <div className="text-center font-outfit text-xs text-white space-y-1">
                    <p className="font-black tracking-wider uppercase text-sm">Audit Vision Multimodale en cours...</p>
                    <p className="text-slate-300 text-[11px]">Évaluation Modernité • Lisibilité • CTA • Visuels</p>
                  </div>
                </div>
              )}
            </div>

            {/* Trigger Scan Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#6B7299] font-mono">
                {audit ? `Audit horodaté : ${audit.auditDate}` : 'En attente d\'analyse vision'}
              </span>

              <button
                disabled={isAuditing}
                onClick={runVisionAudit}
                className="btn-primary text-xs !py-3"
              >
                <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
                <span>{audit ? 'Re-scanner Vision LLM' : 'Lancer l\'Audit Vision LLM'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI Score Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 sm:p-8 rounded-3xl card-peintre space-y-6 h-full flex flex-col justify-between">
            {audit ? (
              <div className="space-y-6">
                {/* Global Score Gauge Card */}
                <div className="p-6 rounded-2xl bg-[#F4F2EE] border border-[#E0E3EF] flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-outfit uppercase text-[#6B7299] font-bold tracking-widest">Score Global Vision</span>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-5xl font-outfit font-black tracking-tight ${
                        audit.score_global < 6.5 ? 'text-[#C41641]' : 'text-emerald-600'
                      }`}>
                        {audit.score_global.toFixed(1)}
                      </span>
                      <span className="text-[#6B7299] text-sm font-bold">/ 10</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    {isEligibleForRedesign ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#FDF1F3] border border-[#C41641]/30 text-[#C41641] uppercase tracking-wider font-outfit">
                        <ShieldAlert className="w-3.5 h-3.5 text-[#C41641]" /> Éligible Refonte
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 border border-emerald-200 text-emerald-700 uppercase tracking-wider font-outfit">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Site Conforme
                      </span>
                    )}
                    <p className="text-[10px] font-mono text-[#6B7299]">Seuil de refonte : &lt; 6.5 / 10</p>
                  </div>
                </div>

                {/* 4 Key Criteria Bars */}
                {(() => {
                  const criteres = audit.criteres || {
                    modernite: Math.round((audit.mobile || 35) / 10),
                    lisibilite: Math.round((audit.seo || 40) / 10),
                    cta: Math.round((audit.performance || 45) / 10),
                    visuels: 4
                  };
                  const defauts = audit.defauts_majeurs || audit.points_faibles || [
                    "Absence de site moderne responsive",
                    "Aucun formulaire de devis en ligne direct",
                    "Perte de prospects qualifiés sur mobile"
                  ];

                  return (
                    <>
                      <div className="space-y-4 text-xs">
                        <h4 className="font-outfit font-black text-[#1A2550] uppercase tracking-wider text-xs">
                          Décomposition des 4 Critères
                        </h4>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[#2D3553] font-medium">
                            <span>1. Modernité Visuelle (Typo, Palette, UI)</span>
                            <span className="font-mono font-bold text-[#C41641]">{criteres.modernite} / 10</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-[#F4F2EE] border border-[#E0E3EF] overflow-hidden">
                            <div 
                              className="h-full bg-[#C41641] rounded-full transition-all duration-1000" 
                              style={{ width: `${criteres.modernite * 10}%` }} 
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[#2D3553] font-medium">
                            <span>2. Lisibilité Mobile (Hiérarchie & Contraste)</span>
                            <span className="font-mono font-bold text-[#C41641]">{criteres.lisibilite} / 10</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-[#F4F2EE] border border-[#E0E3EF] overflow-hidden">
                            <div 
                              className="h-full bg-[#C41641] rounded-full transition-all duration-1000" 
                              style={{ width: `${criteres.lisibilite * 10}%` }} 
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[#2D3553] font-medium">
                            <span>3. Clarté CTA (Bouton d'appel en 1 clic)</span>
                            <span className="font-mono font-bold text-[#A01235]">{criteres.cta} / 10</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-[#F4F2EE] border border-[#E0E3EF] overflow-hidden">
                            <div 
                              className="h-full bg-[#A01235] rounded-full transition-all duration-1000" 
                              style={{ width: `${criteres.cta * 10}%` }} 
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[#2D3553] font-medium">
                            <span>4. Avis certifiés & Preuve Google</span>
                            <span className="font-mono font-bold text-[#1A2550]">{criteres.visuels} / 10</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-[#F4F2EE] border border-[#E0E3EF] overflow-hidden">
                            <div 
                              className="h-full bg-[#1A2550] rounded-full transition-all duration-1000" 
                              style={{ width: `${criteres.visuels * 10}%` }} 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Major Flaws */}
                      <div className="space-y-2.5">
                        <h4 className="font-outfit font-black text-[#1A2550] uppercase tracking-wider text-xs">
                          Défauts Majeurs Détectés
                        </h4>
                        <div className="space-y-2">
                          {defauts.map((defaut: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs text-[#2D3553] p-3 rounded-xl bg-[#FDF1F3] border border-[#C41641]/15">
                              <span className="text-[#C41641] font-black">•</span>
                              <span className="leading-relaxed">{defaut}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[#F4F2EE] border border-[#E0E3EF] flex items-center justify-center mx-auto text-[#C41641] shadow-sm">
                  <Eye className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-outfit font-black text-[#1A2550] uppercase">Aucun audit calculé</h4>
                  <p className="text-xs text-[#6B7299] max-w-xs mx-auto">
                    Cliquez sur « Lancer l'Audit Vision LLM » pour analyser automatiquement le viewport et obtenir les scores.
                  </p>
                </div>
                <button
                  onClick={runVisionAudit}
                  className="btn-primary mx-auto"
                >
                  Démarrer l'analyse maintenant
                </button>
              </div>
            )}

            {/* Action Forward */}
            {audit && (
              <div className="pt-5 border-t border-[#F0F1F5]">
                <button
                  onClick={() => onNavigateToGenerator(activeLead)}
                  className="btn-primary w-full !py-4 text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Transmettre au Studio Frontend</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
