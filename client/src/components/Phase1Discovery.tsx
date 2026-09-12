import { useState } from 'react';
import type { BusinessProfile } from '../types';
import { api } from '../api/client';
import { InteractiveTerritoryMap } from './InteractiveTerritoryMap';
import { Search, Phone, Star, MapPin, ArrowRight, Plus, Terminal, Map as MapIcon, LayoutGrid, Layers } from 'lucide-react';

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
  onAddNewLead
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
  const [manualRating] = useState('4.8');
  const [manualReviews] = useState('42');
  const [manualPhone, setManualPhone] = useState('+229 97 00 12 34');
  const [manualAddress, setManualAddress] = useState('Quartier Titirou, Parakou');
  const [manualWebsite, setManualWebsite] = useState('');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      `[Antigravity ScoutAgent] POST /api/scrape/maps -> Query: "${query}", Location: "${location || 'Parakou'}"`,
      `[Playwright Crawler] Balayage du périmètre Google Maps & extraction des coordonnées...`,
      `[Qualification] Filtrage : Note ≥ 3.8★ & Avis ≥ 15 (potentiel commercial avéré)...`,
      `[MongoDB Engine] Synchronisation des fiches prospects géoréférencées...`
    ]);

    try {
      const scraped = await api.scrapeMaps(query || 'Artisan', location || 'Parakou', 2);
      if (scraped.length > 0) {
        scraped.forEach(l => onAddNewLead(l));
      }
      setScrapeTerminalLog(prev => [...prev, `[Succès] ${scraped.length} nouveaux prospects qualifiés injectés sur la carte !`]);
    } catch (err: any) {
      setScrapeTerminalLog(prev => [...prev, `[Erreur] ${err.message}`]);
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
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80'
      ],
      tagline: 'Expertise locale et engagement qualité pour tous nos clients.',
      description: 'Établissement reconnu pour son savoir-faire et la satisfaction de sa clientèle.',
      openingHours: ['Lundi - Samedi : 07h30 - 19h00'],
      services: [
        { name: 'Prestation Artisanale', description: 'Intervention sur-mesure de haute précision', price: 'Sur devis' }
      ],
      topReviews: [
        { author: 'Client vérifié', rating: 5, text: 'Très satisfait de la prestation et du professionnalisme !', date: 'Récemment' }
      ],
      status: manualWebsite ? 'opportunite_refonte' : 'opportunite_creation'
    };

    onAddNewLead(newLead);
    setShowAddModal(false);
    setManualTitle('');
    setManualWebsite('');
  };

  return (
    <div className="space-y-8">
      {/* Intro & Rules Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E0E3EF] shadow-card relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <p className="section-label">
            PHASE 01 • CARTOGRAPHIE & DÉTECTION GOOGLE MAPS
          </p>

          <h2 className="text-2xl sm:text-4xl font-outfit font-black text-[#1A2550] tracking-tight uppercase italic">
            Scraping & Qualification <span className="text-[#C41641]">Géolocalisée</span>
          </h2>

          <p className="text-sm text-[#6B7299] max-w-3xl leading-relaxed">
            Cartographie interactive en temps réel des artisans et commerces. Détection algorithmique des opportunités : <strong className="text-[#1A2550]">Note Google ≥ 3.8★</strong> avec <strong className="text-[#1A2550]">absence totale de site</strong> (création 300 000 FCFA) ou site obsolète (refonte).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-xs !py-3 !px-5"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un commerce</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search + Fast Triggers + Layout Toggle */}
      <div className="p-4 rounded-3xl bg-white border border-[#E0E3EF] shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#6B7299]" />
            <input
              type="text"
              placeholder="Rechercher par nom, métier ou ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#F4F2EE] border border-[#E0E3EF] text-xs text-[#1A2550] placeholder-[#6B7299] focus:outline-none focus:border-[#C41641] transition font-medium"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#F4F2EE] p-1 rounded-2xl border border-[#E0E3EF] text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl transition font-outfit font-bold cursor-pointer ${
                filterType === 'all' ? 'bg-[#1A2550] text-white shadow-sm' : 'text-[#6B7299] hover:text-[#1A2550]'
              }`}
            >
              Tous ({leads.length})
            </button>
            <button
              onClick={() => setFilterType('creation')}
              className={`px-3 py-1.5 rounded-xl transition font-outfit font-bold cursor-pointer ${
                filterType === 'creation' ? 'bg-[#C41641] text-white shadow-sm' : 'text-[#6B7299] hover:text-[#1A2550]'
              }`}
            >
              Sans Site ({leads.filter(l => !l.website).length})
            </button>
            <button
              onClick={() => setFilterType('refonte')}
              className={`px-3 py-1.5 rounded-xl transition font-outfit font-bold cursor-pointer ${
                filterType === 'refonte' ? 'bg-[#1A2550] text-white shadow-sm' : 'text-[#6B7299] hover:text-[#1A2550]'
              }`}
            >
              Refonte ({leads.filter(l => !!l.website).length})
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-[#F4F2EE] p-1 rounded-2xl border border-[#E0E3EF] text-xs">
            <button
              onClick={() => setViewLayout('both')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-outfit font-bold transition cursor-pointer ${
                viewLayout === 'both' ? 'bg-white text-[#1A2550] shadow-sm' : 'text-[#6B7299]'
              }`}
              title="Vue Mixte (Carte + Liste)"
            >
              <Layers className="w-3.5 h-3.5 text-[#C41641]" />
              <span>Mixte</span>
            </button>

            <button
              onClick={() => setViewLayout('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-outfit font-bold transition cursor-pointer ${
                viewLayout === 'map' ? 'bg-white text-[#1A2550] shadow-sm' : 'text-[#6B7299]'
              }`}
              title="Vue Carte Plein Écran"
            >
              <MapIcon className="w-3.5 h-3.5 text-[#1A2550]" />
              <span>Carte</span>
            </button>

            <button
              onClick={() => setViewLayout('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-outfit font-bold transition cursor-pointer ${
                viewLayout === 'grid' ? 'bg-white text-[#1A2550] shadow-sm' : 'text-[#6B7299]'
              }`}
              title="Vue Grille"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#1A2550]" />
              <span>Grille</span>
            </button>
          </div>

          {/* Fast Scout Triggers */}
          <div className="flex items-center gap-2">
            <button
              disabled={isScraping}
              onClick={() => runSimulatedScraper('Peintre Parakou')}
              className="px-3 py-2 rounded-xl bg-[#FDF1F3] hover:bg-[#FDF1F3]/80 border border-[#C41641]/20 text-xs font-outfit font-bold text-[#C41641] flex items-center gap-1.5 transition cursor-pointer"
            >
              <Terminal className="w-3 h-3 text-[#C41641]" />
              <span>Scout Parakou</span>
            </button>

            <button
              disabled={isScraping}
              onClick={() => runSimulatedScraper('Plombier Cotonou')}
              className="px-3 py-2 rounded-xl bg-[#E8EAF2] hover:bg-[#E8EAF2]/80 border border-[#1A2550]/20 text-xs font-outfit font-bold text-[#1A2550] flex items-center gap-1.5 transition cursor-pointer"
            >
              <Terminal className="w-3 h-3 text-[#1A2550]" />
              <span>Scout Cotonou</span>
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Scraper Output Window */}
      {isScraping && (
        <div className="rounded-3xl bg-[#0F163A] border border-white/10 overflow-hidden shadow-xl font-mono text-xs text-white">
          <div className="bg-[#0A0E27] px-5 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#C41641] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#FBBF24] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#10B981] inline-block" />
              <span className="ml-2 text-zinc-400 text-[11px]">scout_agent_crawler — Antigravity Agent Swarm</span>
            </div>
            <span className="flex items-center gap-1.5 text-[#C41641] text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#C41641] animate-ping" />
              Extraction active
            </span>
          </div>
          <div className="p-4 space-y-1.5 text-zinc-300 bg-[#0F163A] max-h-48 overflow-y-auto no-scrollbar">
            {scrapeTerminalLog.map((log, i) => (
              <p key={i} className="flex items-center gap-2">
                <span className="text-[#C41641] select-none">&gt;</span>
                <span>{log}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Map Display */}
      {(viewLayout === 'map' || viewLayout === 'both') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C41641]" />
              <span className="font-outfit font-black text-sm uppercase text-[#1A2550]">
                Radar Géographique des Prospects Détectés
              </span>
            </div>
            <span className="text-xs font-mono text-[#6B7299]">
              Cliquez sur un marqueur pour inspecter la fiche
            </span>
          </div>

          <InteractiveTerritoryMap
            leads={filteredLeads}
            selectedLead={selectedLead}
            onSelectLead={onSelectLead}
            onNavigateToAudit={onNavigateToAudit}
          />
        </div>
      )}

      {/* Prospect Cards Grid */}
      {(viewLayout === 'grid' || viewLayout === 'both') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="font-outfit font-black text-sm uppercase text-[#1A2550]">
              {filteredLeads.length} Commerce(s) Qualifié(s)
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;
              const hasNoWebsite = !lead.website;

              return (
                <div
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className={`card-peintre p-6 space-y-5 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected ? 'ring-2 ring-[#C41641] shadow-card-hover' : ''
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header: Monogram, Rating & Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#1A2550] text-white flex items-center justify-center font-outfit font-black text-base shadow-md shrink-0">
                          {lead.title.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#C41641] uppercase tracking-wider block">
                            {lead.category}
                          </span>
                          <h3 className="font-outfit font-black text-base text-[#1A2550] leading-tight line-clamp-1 uppercase">
                            {lead.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#1A2550] font-mono text-xs font-bold shrink-0">
                        <Star className="w-3.5 h-3.5 text-[#FBBF24] fill-[#FBBF24]" />
                        <span>{lead.rating}</span>
                        <span className="text-[#6B7299] text-[10px]">({lead.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-2 text-xs text-[#6B7299] pt-2 border-t border-[#F0F1F5]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#C41641] shrink-0" />
                        <span className="truncate">{lead.address || lead.city}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <Phone className="w-3.5 h-3.5 text-[#1A2550] shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="pt-1">
                      {hasNoWebsite ? (
                        <div className="p-3 rounded-2xl bg-[#FDF1F3] border border-[#C41641]/20 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#C41641] animate-ping" />
                            <span className="text-[11px] font-mono font-bold text-[#C41641]">✦ Opportunité Création</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#6B7299]">Zéro site web</span>
                        </div>
                      ) : (
                        <div className="p-3 rounded-2xl bg-[#E8EAF2] border border-[#1A2550]/20 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#1A2550]" />
                            <span className="text-[11px] font-mono font-bold text-[#1A2550]">Opportunité Refonte</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#6B7299] truncate max-w-[120px]">
                            {lead.website}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#F0F1F5] flex items-center justify-between gap-3">
                    <span className="text-[11px] font-outfit font-bold text-[#6B7299]">
                      {lead.status === 'clos' ? '🎉 Client Clos' : lead.status === 'site_genere' ? '🚀 Site Déployé' : 'À Auditer'}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToAudit(lead);
                      }}
                      className="btn-primary text-xs !py-2 !px-4 !rounded-xl flex items-center gap-1.5"
                    >
                      <span>Lancer Audit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#0F163A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-[#E0E3EF] rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <h3 className="text-xl font-outfit font-black uppercase text-[#1A2550]">
              Ajout Manuel d'un <span className="text-[#C41641]">Commerce</span>
            </h3>

            <form onSubmit={handleCreateManual} className="space-y-4 text-xs">
              <div>
                <label className="text-[#1A2550] font-bold block mb-1">Nom de l'établissement *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Atelier Peinture Parakou"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-[#1A2550]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1A2550] font-bold block mb-1">Corps de métier</label>
                  <input
                    type="text"
                    placeholder="Artisan Peintre"
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-[#1A2550]"
                  />
                </div>

                <div>
                  <label className="text-[#1A2550] font-bold block mb-1">Téléphone</label>
                  <input
                    type="text"
                    placeholder="+229 97 00 00 00"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-[#1A2550]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#1A2550] font-bold block mb-1">Adresse ou Ville</label>
                <input
                  type="text"
                  placeholder="Quartier Titirou, Parakou"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-[#1A2550]"
                />
              </div>

              <div>
                <label className="text-[#1A2550] font-bold block mb-1">Site Web actuel (Laisser vide si aucun)</label>
                <input
                  type="text"
                  placeholder="https://ancien-site.com"
                  value={manualWebsite}
                  onChange={(e) => setManualWebsite(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-[#1A2550]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-ghost text-xs !py-2.5 !px-4"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs !py-2.5 !px-5"
                >
                  Ajouter au Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
