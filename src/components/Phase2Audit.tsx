import { useState } from 'react';
import type { BusinessProfile } from '../types';
import { Eye, ShieldAlert, Sparkles, CheckCircle2, ArrowRight, RefreshCw, Laptop, AlertTriangle } from 'lucide-react';

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

  const handleLeadChange = (leadId: string) => {
    const found = leads.find(l => l.id === leadId);
    if (found) {
      setActiveLead(found);
      onSelectLead(found);
    }
  };

  const runVisionAudit = () => {
    setIsAuditing(true);

    setTimeout(() => {
      // Realistic scoring based on whether they have a site or not
      const newAudit = {
        score_global: activeLead.website ? 4.6 : 2.8,
        criteres: {
          modernite: activeLead.website ? 4.0 : 2.0,
          lisibilite: activeLead.website ? 4.8 : 3.0,
          cta: activeLead.website ? 4.2 : 3.2,
          visuels: activeLead.website ? 5.4 : 3.0,
        },
        defauts_majeurs: activeLead.website ? [
          'Design non optimisé pour mobile (ratio d\'abandon estimé à 65%)',
          'Absence de bouton CTA d\'appel direct ou de réservation instantanée',
          'Typographie datée et faible hiérarchie des informations',
          'Aucune mise en avant des avis certifiés Google Maps'
        ] : [
          'Absence totale de site web officiel (perte de 40% des clients de passage)',
          'Aucune vitrine pour exposer les produits et les tarifs',
          'Les concurrents directs captent le trafic de recherche locale'
        ],
        eligible_refonte: true,
        auditDate: new Date().toISOString().split('T')[0]
      };

      onUpdateLeadAudit(activeLead.id, newAudit);
      setActiveLead(prev => ({
        ...prev,
        audit: newAudit,
        status: 'qualifie'
      }));
      setIsAuditing(false);
    }, 1800);
  };

  const audit = activeLead.audit;
  const isEligibleForRedesign = audit ? (audit.score_global < 6.5 || audit.eligible_refonte) : false;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Phase 2 : Audit Multimodal & Vision LLM Scoring</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30">
              GPT-4o / Claude Vision
            </span>
          </div>
          <p className="text-sm text-zinc-400 max-w-3xl">
            Évaluation automatique du viewport 1440×900 sur 4 critères clés. Règle algorithmique : si <strong>Score &lt; 6.5</strong> ou <strong>Éligible Refonte</strong>, le lead est immédiatement transmis au générateur frontend.
          </p>
        </div>

        {/* Lead selector */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs text-zinc-400">Prospect sélectionné :</label>
          <select
            value={activeLead.id}
            onChange={(e) => handleLeadChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {leads.map(l => (
              <option key={l.id} value={l.id}>{l.title} ({l.website ? 'Avec site' : 'Sans site'})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Capture / Viewport vs AI Score Breakdown */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Viewport Simulation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Laptop className="w-4 h-4 text-emerald-400" />
                <span>Viewport Capture (1440x900 px - Playwright)</span>
              </div>
              <span className="text-xs text-zinc-500">
                {activeLead.website ? activeLead.website : 'Aucun site existant'}
              </span>
            </div>

            {/* Viewport Frame */}
            <div className="relative aspect-[16/10] bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden flex flex-col justify-center items-center text-center p-6 group">
              {activeLead.website ? (
                /* Simulated Old Outdated Site */
                <div className="w-full h-full p-4 bg-amber-50/10 border border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-xl font-bold">
                    90's
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <p className="font-mono text-xs text-amber-300">Site Web Daté Détecté</p>
                    <p className="text-xs text-zinc-400">
                      Technologies obsolètes, design non-responsive, absence de balisage schema.org et zéro appel à l'action moderne.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">PagesPerso / Free / E-Monsite</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300">Temps chargement &gt; 4.5s</span>
                  </div>
                </div>
              ) : (
                /* Missing Site */
                <div className="w-full h-full p-4 bg-red-950/20 border border-dashed border-red-900/50 rounded-lg flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h4 className="font-bold text-white text-sm">Aucun Site Web Officiel</h4>
                    <p className="text-xs text-zinc-400">
                      Ce commerce bénéficie d'une excellente note Google ({activeLead.rating}★) mais ne possède aucune vitrine en ligne.
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                    Opportunité Création Majeure
                  </span>
                </div>
              )}

              {/* Scanning Overlay Animation */}
              {isAuditing && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
                  <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <div className="text-center font-mono text-xs text-emerald-400 space-y-1">
                    <p>Analyse Vision Multimodale en cours...</p>
                    <p className="text-zinc-500 text-[10px]">Évaluation Modernité • Lisibilité • CTA • Visuels</p>
                  </div>
                </div>
              )}
            </div>

            {/* Trigger Scan Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-500">
                {audit ? `Dernier audit : ${audit.auditDate}` : 'Aucun audit réalisé pour l\'instant'}
              </span>

              <button
                disabled={isAuditing}
                onClick={runVisionAudit}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold flex items-center gap-2 transition shadow-md cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                <span>{audit ? 'Re-scanner le site avec l\'IA' : 'Lancer l\'Audit Vision LLM'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI Score Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-5 h-full flex flex-col justify-between">
            {audit ? (
              <div className="space-y-5">
                {/* Global Score Gauge */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider">Score Global Vision</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-extrabold ${audit.score_global < 6.5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {audit.score_global.toFixed(1)}
                      </span>
                      <span className="text-zinc-500 text-sm">/ 10</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    {isEligibleForRedesign ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                        <ShieldAlert className="w-3.5 h-3.5" /> Éligible Refonte Automatique
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Site Conforme
                      </span>
                    )}
                    <p className="text-[10px] text-zinc-500">Seuil de refonte : &lt; 6.5 / 10</p>
                  </div>
                </div>

                {/* 4 Key Criteria Bars */}
                <div className="space-y-3 text-xs">
                  <h4 className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px] font-mono">Détail des 4 critères</h4>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-zinc-400">
                      <span>1. Modernité Visuelle (Typo, Espacements, Palette)</span>
                      <span className="font-mono font-bold text-white">{audit.criteres.modernite} / 10</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${audit.criteres.modernite * 10}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-zinc-400">
                      <span>2. Lisibilité Mobile (Hiérarchie & Contraste)</span>
                      <span className="font-mono font-bold text-white">{audit.criteres.lisibilite} / 10</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${audit.criteres.lisibilite * 10}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-zinc-400">
                      <span>3. Clarté CTA (Bouton d'action ou appel en 1 clic)</span>
                      <span className="font-mono font-bold text-white">{audit.criteres.cta} / 10</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full" style={{ width: `${audit.criteres.cta * 10}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-zinc-400">
                      <span>4. Mise en valeur des produits & avis clients</span>
                      <span className="font-mono font-bold text-white">{audit.criteres.visuels} / 10</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${audit.criteres.visuels * 10}%` }} />
                    </div>
                  </div>
                </div>

                {/* Major Flaws */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px] font-mono">Défauts majeurs identifiés</h4>
                  <div className="space-y-1.5">
                    {audit.defauts_majeurs.map((defaut, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-400 p-2 rounded-lg bg-zinc-950 border border-zinc-800/80">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{defaut}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                  <Eye className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Aucun audit calculé</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Cliquez sur « Lancer l'Audit Vision LLM » pour analyser automatiquement le site et générer les scores.
                </p>
                <button
                  onClick={runVisionAudit}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold cursor-pointer shadow-md"
                >
                  Démarrer l'analyse maintenant
                </button>
              </div>
            )}

            {/* Action Forward */}
            {audit && (
              <div className="pt-4 border-t border-zinc-800">
                <button
                  onClick={() => onNavigateToGenerator(activeLead)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Déclencher la Génération Frontend Autonome</span>
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
