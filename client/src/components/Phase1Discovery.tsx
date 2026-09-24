import { useState } from 'react';
import type { BusinessProfile } from '../types';
import { api } from '../api/client';
import { InteractiveTerritoryMap } from './InteractiveTerritoryMap';
import { MotionReveal } from './motion/MotionReveal';
import {
  Search,
  Phone,
  Star,
  MapPin,
  ArrowRight,
  Plus,
  Terminal,
  Map as MapIcon,
  LayoutGrid,
  Layers,
  Sparkles,
  Globe,
  CheckCircle2,
  X,
  Building2
} from 'lucide-react';

interface Phase1Props {
  leads: BusinessProfile[];
  selectedLead?: BusinessProfile | null;
  onSelectLead: (lead: BusinessProfile) => void;
  onNavigateToAudit: (lead: BusinessProfile) => void;
  onAddNewLead: (newLead: BusinessProfile) => void;
}

export const Phase1Discovery = ({
  leads,
  selectedLead = null,
  onSelectLead,
  onNavigateToAudit,
  onAddNewLead,
}: Phase1Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'creation' | 'refonte'>('all');
  const [viewLayout, setViewLayout] = useState<'map' | 'grid' | 'both'>('both');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeTerminalLog, setScrapeTerminalLog] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for manual lead addition
  const [manualTitle, setManualTitle] = useState('');
  const [manualCategory, setManualCategory] = useState('');
  const [manualRating, setManualRating] = useState('4.8');
  const [manualReviews, setManualReviews] = useState('42');
  const [manualPhone, setManualPhone] = useState('+229 97 00 12 34');
  const [manualAddress, setManualAddress] = useState('Quartier Titirou, Parakou');
  const [manualWebsite, setManualWebsite] = useState('');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.address.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'creation') return !lead.website;
    if (filterType === 'refonte') return !!lead.website;
    return true;
  });

  const runSimulatedScraper = async (fullQuery: string) => {
    setIsScraping(true);
    const [query, location] = fullQuery.split(' ');
    setScrapeTerminalLog([
      `[Antigravity ScoutAgent] Initialisation crawler Google Maps API...`,
      `[Geofencing] Cible : "${query}" dans le secteur "${location || 'Parakou'}"`,
      `[Filtering Algorithm] Critères stricts : Note ≥ 3.8★ & Avis ≥ 15 (potentiel commercial vérifié)`,
      `[MongoDB Cloud Engine] Synchronisation des entités commerciales et scoring géographique...`,
    ]);

    try {
      const scraped = await api.scrapeMaps(query || 'Artisan', location || 'Parakou', 2);
      if (scraped.length > 0) {
        scraped.forEach((l) => onAddNewLead(l));
      }
      setScrapeTerminalLog((prev) => [
        ...prev,
        `[Succès] ${scraped.length} nouveaux prospects qualifiés injectés sur la carte et indexés dans MongoDB !`,
      ]);
    } catch (err: any) {
      setScrapeTerminalLog((prev) => [...prev, `[Erreur] ${err.message}`]);
    } finally {
      setIsScraping(false);
    }
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle) return;

    const newLead: BusinessProfile = {
      id: `lead-${Date.now()}`,
      title: manualTitle,
      category: manualCategory || 'Artisan Qualifié',
      rating: parseFloat(manualRating) || 4.8,
      reviewsCount: parseInt(manualReviews, 10) || 30,
      phone: manualPhone || '+229 97 00 00 00',
      address: manualAddress || 'Bénin',
      city: 'Parakou',
      website: manualWebsite ? manualWebsite : null,
      photos: [
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
      ],
      tagline: 'Expertise locale et engagement qualité pour tous nos clients.',
      description: 'Établissement reconnu pour son savoir-faire et la satisfaction de sa clientèle.',
      openingHours: ['Lundi - Samedi : 07h30 - 19h00'],
      services: [
        { name: 'Prestation Artisanale', description: 'Intervention sur-mesure de haute précision', price: 'Sur devis' },
      ],
      topReviews: [
        { author: 'Client vérifié', rating: 5, text: 'Très satisfait de la prestation et du professionnalisme !', date: 'Récemment' },
      ],
      status: manualWebsite ? 'opportunite_refonte' : 'opportunite_creation',
    };

    onAddNewLead(newLead);
    setShowAddModal(false);
    setManualTitle('');
    setManualWebsite('');
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner Architectural Sand & Slate */}
      <MotionReveal direction="up" delay={0.05}>
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 relative z-10">
            <div className="section-label">
              PHASE 01 • CARTOGRAPHIE & GÉOFENCING GOOGLE MAPS
            </div>

            <h2 className="text-2xl sm:text-4xl font-outfit font-black text-[#0F172A] tracking-tight uppercase italic">
              Scraping & Détection <span className="text-[#EA580C]">Géolocalisée</span>
            </h2>

            <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
              Cartographie interactive haute fidélité en temps réel. Détection algorithmique certifiée :
              <strong className="text-[#0F172A]"> Note Google ≥ 3.8★</strong> avec
              <strong className="text-[#0F172A]"> absence de site web</strong> (création forfaitaire 300 000 FCFA) ou site obsolète (refonte).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary text-xs !py-3 !px-5"
              aria-label="Ajouter manuellement un commerce"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un commerce</span>
            </button>
          </div>
        </div>
      </MotionReveal>

      {/* Control Bar: Search + Filters + Layout Toggle + Scout Presets */}
      <MotionReveal direction="up" delay={0.1}>
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, métier ou ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#EA580C] focus:bg-white transition font-medium"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl transition font-outfit font-bold cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-[#0F172A] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                Tous ({leads.length})
              </button>
              <button
                onClick={() => setFilterType('creation')}
                className={`px-3 py-1.5 rounded-xl transition font-outfit font-bold cursor-pointer ${
                  filterType === 'creation'
                    ? 'bg-[#EA580C] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                Sans Site ({leads.filter((l) => !l.website).length})
              </button>
              <button
                onClick={() => setFilterType('refonte')}
                className={`px-3 py-1.5 rounded-xl transition font-outfit font-bold cursor-pointer ${
                  filterType === 'refonte'
                    ? 'bg-[#0F172A] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                Refonte ({leads.filter((l) => !!l.website).length})
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
              <button
                onClick={() => setViewLayout('both')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-outfit font-bold transition cursor-pointer ${
                  viewLayout === 'both' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vue Mixte (Carte + Liste)"
              >
                <Layers className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Mixte</span>
              </button>

              <button
                onClick={() => setViewLayout('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-outfit font-bold transition cursor-pointer ${
                  viewLayout === 'map' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Carte Plein Écran"
              >
                <MapIcon className="w-3.5 h-3.5 text-[#0F172A]" />
                <span>Carte</span>
              </button>

              <button
                onClick={() => setViewLayout('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-outfit font-bold transition cursor-pointer ${
                  viewLayout === 'grid' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grille Seule"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#0F172A]" />
                <span>Grille</span>
              </button>
            </div>

            {/* Fast Scout Triggers */}
            <div className="flex items-center gap-2">
              <button
                disabled={isScraping}
                onClick={() => runSimulatedScraper('Peintre Parakou')}
                className="px-3 py-2 rounded-xl bg-[#FFF7ED] hover:bg-orange-100 border border-[#FED7AA] text-xs font-outfit font-bold text-[#EA580C] flex items-center gap-1.5 transition cursor-pointer"
                title="Lancer le scraping à Parakou"
              >
                <Terminal className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Scout Parakou</span>
              </button>

              <button
                disabled={isScraping}
                onClick={() => runSimulatedScraper('Plombier Cotonou')}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-outfit font-bold text-[#0F172A] flex items-center gap-1.5 transition cursor-pointer"
                title="Lancer le scraping à Cotonou"
              >
                <Terminal className="w-3.5 h-3.5 text-[#0F172A]" />
                <span>Scout Cotonou</span>
              </button>
            </div>
          </div>
        </div>
      </MotionReveal>

      {/* Terminal Scraper Console */}
      {isScraping && (
        <MotionReveal direction="up" delay={0.05}>
          <div className="rounded-3xl bg-[#0F172A] border border-white/10 overflow-hidden shadow-xl font-mono text-xs text-white">
            <div className="bg-[#020617] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EA580C] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#FBBF24] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#10B981] inline-block" />
                <span className="ml-2 text-zinc-400 text-[11px]">scout_agent_crawler • Google Maps API</span>
              </div>
              <span className="flex items-center gap-1.5 text-orange-400 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-ping" />
                Crawling géolocalisé en cours...
              </span>
            </div>
            <div className="p-4 space-y-1.5 max-h-48 overflow-y-auto">
              {scrapeTerminalLog.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 text-zinc-300">
                  <span className="text-[#EA580C] select-none">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </MotionReveal>
      )}

      {/* Map + List Split Layout */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Map Column (if 'map' or 'both') */}
        {(viewLayout === 'map' || viewLayout === 'both') && (
          <div className={`${viewLayout === 'map' ? 'lg:col-span-12 h-[640px]' : 'lg:col-span-6 h-[580px]'} sticky top-24`}>
            <div className="h-full rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-white">
              <InteractiveTerritoryMap
                leads={filteredLeads}
                selectedLead={selectedLead}
                onSelectLead={onSelectLead}
                onNavigateToAudit={onNavigateToAudit}
              />
            </div>
          </div>
        )}

        {/* Lead Cards List Column (if 'grid' or 'both') */}
        {(viewLayout === 'grid' || viewLayout === 'both') && (
          <div className={`${viewLayout === 'grid' ? 'lg:col-span-12' : 'lg:col-span-6'} space-y-4`}>
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-outfit font-bold uppercase tracking-wider text-slate-500">
                {filteredLeads.length} établissement{filteredLeads.length > 1 ? 's' : ''} répertorié{filteredLeads.length > 1 ? 's' : ''}
              </p>
              {selectedLead && (
                <span className="text-[11px] text-[#EA580C] font-bold flex items-center gap-1 font-outfit">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sélection : {selectedLead.title}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredLeads.map((lead) => {
                const isSelected = selectedLead?.id === lead.id;
                const isCreation = !lead.website;

                return (
                  <div
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className={`bg-white p-5 rounded-2xl cursor-pointer transition-all duration-300 relative flex flex-col justify-between group border ${
                      isSelected
                        ? 'border-[#EA580C] shadow-lg ring-2 ring-[#EA580C]/20 bg-orange-50/20'
                        : 'border-slate-200 hover:border-orange-300 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-outfit font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider border ${
                            isCreation
                              ? 'bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]'
                              : 'bg-slate-100 text-[#0F172A] border-slate-200'
                          }`}
                        >
                          {isCreation ? 'Sans Site (Création)' : 'Refonte Recommandée'}
                        </span>

                        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[#0F172A] text-xs font-bold font-mono">
                          <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                          <span>{lead.rating.toFixed(1)}</span>
                          <span className="text-slate-400">({lead.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Title & Category */}
                      <div>
                        <h3 className="font-outfit font-extrabold text-[#0F172A] text-base group-hover:text-[#EA580C] transition line-clamp-1">
                          {lead.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium line-clamp-1">{lead.category}</p>
                      </div>

                      {/* Address & Phone */}
                      <div className="space-y-1 text-xs text-slate-600 font-medium">
                        <div className="flex items-center gap-2 line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                          <span className="truncate">{lead.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lead.phone}</span>
                        </div>
                        {lead.website && (
                          <div className="flex items-center gap-2 text-[#0F172A]">
                            <Globe className="w-3.5 h-3.5 shrink-0 text-[#EA580C]" />
                            <span className="truncate text-[11px] font-mono">{lead.website.replace(/^https?:\/\//, '')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-outfit font-bold text-slate-500 group-hover:text-[#0F172A] transition">
                        {isCreation ? 'Opportunité 300 000 F' : 'Audit Qualité Requis'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToAudit(lead);
                        }}
                        className="btn-primary text-xs !py-1.5 !px-3.5 !rounded-xl"
                        aria-label={`Auditer ${lead.title}`}
                      >
                        <span>Auditer</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Manual Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition"
              aria-label="Fermer la boîte de dialogue"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[#EA580C] text-xs font-outfit font-extrabold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Nouveau Prospect</span>
              </div>
              <h3 className="text-xl font-outfit font-black text-[#0F172A]">
                Ajouter un commerce Google Maps
              </h3>
              <p className="text-xs text-slate-500">
                Saisissez les informations de l'établissement pour l'injecter immédiatement dans la base MongoDB.
              </p>
            </div>

            <form onSubmit={handleCreateManual} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#0F172A] font-bold mb-1">Nom de l'établissement *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Boulangerie Royale du Bénin"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#EA580C] focus:bg-white text-[#0F172A] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#0F172A] font-bold mb-1">Secteur d'activité</label>
                  <input
                    type="text"
                    placeholder="Ex : Boulangerie Pâtisserie"
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#EA580C] focus:bg-white text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-bold mb-1">Téléphone direct</label>
                  <input
                    type="text"
                    placeholder="+229 97 00 12 34"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#EA580C] focus:bg-white text-[#0F172A] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#0F172A] font-bold mb-1">Note Google (sur 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={manualRating}
                    onChange={(e) => setManualRating(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#EA580C] focus:bg-white text-[#0F172A] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-bold mb-1">Nombre d'avis Google</label>
                  <input
                    type="number"
                    min="0"
                    value={manualReviews}
                    onChange={(e) => setManualReviews(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#EA580C] focus:bg-white text-[#0F172A] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0F172A] font-bold mb-1">Adresse physique / Quartier</label>
                <input
                  type="text"
                  placeholder="Quartier Titirou, Parakou, Bénin"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#EA580C] focus:bg-white text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-[#0F172A] font-bold mb-1">
                  Site web existant (optionnel — laisser vide pour opportunité création)
                </label>
                <input
                  type="url"
                  placeholder="https://ancien-site.com"
                  value={manualWebsite}
                  onChange={(e) => setManualWebsite(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#EA580C] focus:bg-white text-[#0F172A] font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs !py-2.5 !px-5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Enregistrer & Qualifier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Phase1Discovery;
