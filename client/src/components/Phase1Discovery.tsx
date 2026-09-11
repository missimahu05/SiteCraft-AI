import { useState } from 'react';
import type { BusinessProfile } from '../types';
import { api } from '../api/client';
import { Search, Globe, Phone, Star, MapPin, CheckCircle2, AlertCircle, ArrowRight, Plus, Terminal } from 'lucide-react';

interface Phase1Props {
  leads: BusinessProfile[];
  onSelectLead: (lead: BusinessProfile) => void;
  onNavigateToAudit: (lead: BusinessProfile) => void;
  onAddNewLead: (newLead: BusinessProfile) => void;
}

export const Phase1Discovery = ({
  leads,
  onSelectLead,
  onNavigateToAudit,
  onAddNewLead
}: Phase1Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'creation' | 'refonte'>('all');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeTerminalLog, setScrapeTerminalLog] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for manual lead addition
  const [manualTitle, setManualTitle] = useState('');
  const [manualCategory, setManualCategory] = useState('');
  const [manualRating, setManualRating] = useState('4.5');
  const [manualReviews, setManualReviews] = useState('32');
  const [manualPhone, setManualPhone] = useState('01 45 67 89 10');
  const [manualAddress, setManualAddress] = useState('10 Rue Principale, Paris');
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
      `[Backend Engine] POST /api/scrape/maps -> Query: "${query}", City: "${location || 'Paris'}"`,
      `[Playwright Crawler] Inspecting Google Maps place results...`,
      `[DOM Extractor] Parsing: h1.DUwDvf, div.F7nice, phone, address, website...`,
      `[Algorithm Gate] Filter: Note ≥ 3.8★ & Avis ≥ 15...`,
      `[SQLite Database] Inserting discovered businesses into table 'leads'...`
    ]);

    try {
      const scraped = await api.scrapeMaps(query || 'Commerce', location || 'Paris', 2);
      if (scraped.length > 0) {
        scraped.forEach(l => onAddNewLead(l));
      }
      setScrapeTerminalLog(prev => [...prev, `[Success] ${scraped.length} nouveaux commerces enregistrés dans SQLite !`]);
    } catch (err: any) {
      setScrapeTerminalLog(prev => [...prev, `[Error] Erreur scraper: ${err.message}`]);
    } finally {
      setIsScraping(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle) return;

    const newLead: BusinessProfile = {
      id: `lead-${Date.now()}`,
      title: manualTitle,
      category: manualCategory || 'Commerce Local',
      rating: parseFloat(manualRating) || 4.5,
      reviewsCount: parseInt(manualReviews, 10) || 20,
      phone: manualPhone || '01 00 00 00 00',
      address: manualAddress || 'France',
      website: manualWebsite ? manualWebsite : null,
      photos: [
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80'
      ],
      tagline: 'Expertise locale et engagement qualité pour tous nos clients.',
      description: 'Établissement reconnu pour son savoir-faire et la satisfaction de sa clientèle.',
      openingHours: ['Lundi - Vendredi : 09h00 - 19h00'],
      services: [
        { name: 'Service Principal', description: 'Prestation complète sur-mesure', price: 'Sur devis' }
      ],
      topReviews: [
        { author: 'Client vérifié', rating: 5, text: 'Très satisfait de la prestation !', date: 'Récemment' }
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
            PHASE 01 • PLAYWRIGHT DISCOVERY ENGINE
          </p>

          <h2 className="text-2xl sm:text-4xl font-outfit font-black text-[#1A2550] tracking-tight uppercase italic">
            Scraping & Qualification <span className="text-[#C41641]">Google Maps</span>
          </h2>

          <p className="text-sm text-[#6B7299] max-w-3xl leading-relaxed">
            Filtrage algorithmique strict des commerces de proximité : <strong className="text-[#1A2550]">Avis Google ≥ 15</strong> (traction prouvée) et <strong className="text-[#1A2550]">Note ≥ 3.8/5.0</strong>. Détection immédiate du potentiel : opportunité de <em>création intégrale</em> (sans site) ou de <em>refonte moderne</em>.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un commerce</span>
        </button>
      </div>

      {/* Quick Search & Live Crawler Bar */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* Search Bar & Filters */}
        <div className="lg:col-span-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#6B7299]" />
            <input
              type="text"
              placeholder="Rechercher un commerce (ex: Boulangerie, Plombier, Paris, Bordeaux)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#E0E3EF] text-sm text-[#1A2550] placeholder-[#6B7299] focus:outline-none focus:border-[#C41641] shadow-sm transition font-medium"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-[#E0E3EF] text-xs shrink-0 shadow-sm">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-2 rounded-xl transition font-outfit font-bold cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#1A2550] text-white shadow-sm'
                  : 'text-[#6B7299] hover:text-[#1A2550]'
              }`}
            >
              Tous ({leads.length})
            </button>
            <button
              onClick={() => setFilterType('creation')}
              className={`px-3.5 py-2 rounded-xl transition font-outfit font-bold cursor-pointer ${
                filterType === 'creation'
                  ? 'bg-[#C41641] text-white shadow-sm'
                  : 'text-[#6B7299] hover:text-[#1A2550]'
              }`}
            >
              Création ({leads.filter(l => !l.website).length})
            </button>
            <button
              onClick={() => setFilterType('refonte')}
              className={`px-3.5 py-2 rounded-xl transition font-outfit font-bold cursor-pointer ${
                filterType === 'refonte'
                  ? 'bg-[#1A2550] text-white shadow-sm'
                  : 'text-[#6B7299] hover:text-[#1A2550]'
              }`}
            >
              Refonte ({leads.filter(l => !!l.website).length})
            </button>
          </div>
        </div>

        {/* Live Scraper Fast Triggers */}
        <div className="lg:col-span-4 flex items-center gap-2.5">
          <button
            disabled={isScraping}
            onClick={() => runSimulatedScraper('Boulangerie Paris')}
            className="flex-1 px-4 py-3 rounded-2xl bg-white hover:bg-[#F4F2EE] border border-[#E0E3EF] text-xs font-outfit font-bold text-[#1A2550] flex items-center justify-center gap-2 transition cursor-pointer shadow-sm hover:border-[#C41641] disabled:opacity-50"
          >
            <Terminal className="w-3.5 h-3.5 text-[#C41641]" />
            <span>Scrape Paris</span>
          </button>
          <button
            disabled={isScraping}
            onClick={() => runSimulatedScraper('Plombier Lyon')}
            className="flex-1 px-4 py-3 rounded-2xl bg-white hover:bg-[#F4F2EE] border border-[#E0E3EF] text-xs font-outfit font-bold text-[#1A2550] flex items-center justify-center gap-2 transition cursor-pointer shadow-sm hover:border-[#C41641] disabled:opacity-50"
          >
            <Terminal className="w-3.5 h-3.5 text-[#1A2550]" />
            <span>Scrape Lyon</span>
          </button>
        </div>
      </div>

      {/* Terminal Scraper Output Window */}
      {isScraping && (
        <div className="rounded-2xl bg-[#0F163A] border border-[#1A2550] overflow-hidden shadow-xl font-mono text-xs text-white">
          <div className="bg-[#0A0E27] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#C41641] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#FBBF24] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#10B981] inline-block" />
              <span className="ml-2 text-slate-400 text-[11px]">crawler_daemon.sh — Playwright headless</span>
            </div>
            <span className="flex items-center gap-1.5 text-[#C41641] text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#C41641] animate-ping" />
              Extraction active
            </span>
          </div>
          <div className="p-4 space-y-1.5 text-slate-300 bg-[#0F163A] max-h-48 overflow-y-auto">
            {scrapeTerminalLog.map((log, i) => (
              <p key={i} className="flex items-center gap-2">
                <span className="text-[#C41641] select-none">&gt;</span>
                <span>{log}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Leads Table / Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredLeads.map((lead) => {
          const isEligible = lead.rating >= 3.8 && lead.reviewsCount >= 15;
          const isCreation = !lead.website;

          return (
            <div
              key={lead.id}
              className="p-7 rounded-3xl card-peintre flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-4">
                {/* Header Badge & Category */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <span className="badge-brand">
                      {lead.category}
                    </span>
                    <h3 className="text-xl font-outfit font-black text-[#1A2550] leading-tight group-hover:text-[#C41641] transition-colors">
                      {lead.title}
                    </h3>
                  </div>

                  {isCreation ? (
                    <span className="badge-accent">
                      Création Complète
                    </span>
                  ) : (
                    <span className="badge-brand !bg-[#F4F2EE] !text-[#1A2550]">
                      Refonte Moderne
                    </span>
                  )}
                </div>

                {/* Rating and Reviews */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#D97706] bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 font-black font-outfit">
                    <Star className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                    <span className="text-sm">{lead.rating.toFixed(1)} / 5</span>
                  </div>
                  <span className="text-[#6B7299] font-medium">({lead.reviewsCount} avis Google)</span>

                  {isEligible ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs ml-auto">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Qualifié (≥3.8★)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[#C41641] font-semibold text-xs ml-auto">
                      <AlertCircle className="w-4 h-4" /> Non éligible
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs text-[#6B7299] pt-2 border-t border-[#F0F1F5]">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#C41641] shrink-0" />
                    <span className="truncate text-[#2D3553]">{lead.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#C41641] shrink-0" />
                    <span className="font-mono text-[#2D3553]">{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-[#C41641] shrink-0" />
                    {lead.website ? (
                      <span className="text-[#1A2550] font-medium truncate font-mono">{lead.website}</span>
                    ) : (
                      <span className="text-[#C41641] font-bold">Aucun site web (Vitrine vierge)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#F0F1F5] flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectLead(lead)}
                  className="text-xs text-[#6B7299] hover:text-[#1A2550] transition font-bold font-outfit cursor-pointer"
                >
                  Détails Profil
                </button>

                <button
                  onClick={() => onNavigateToAudit(lead)}
                  className="btn-primary text-xs !py-2.5 !px-5"
                >
                  <span>{lead.website ? 'Auditer Vision GPT-4o' : 'Générer le Site'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#0F163A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-[#E0E3EF] rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-outfit font-black text-[#1A2550] tracking-tight uppercase">Ajouter un commerce</h3>
                <p className="text-xs text-[#6B7299]">Insérer directement dans la base SQLite persistante</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-[#F4F2EE] hover:bg-[#E8EAF2] text-[#1A2550] flex items-center justify-center cursor-pointer transition font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#1A2550] font-outfit font-bold uppercase tracking-wider text-[10px]">Nom de l'établissement *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Boulangerie Les Délices de Paris"
                  value={manualTitle}
                  onChange={e => setManualTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-[#1A2550] text-sm focus:outline-none focus:border-[#C41641] transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[#1A2550] font-outfit font-bold uppercase tracking-wider text-[10px]">Catégorie</label>
                  <input
                    type="text"
                    placeholder="Ex: Artisan Boulanger"
                    value={manualCategory}
                    onChange={e => setManualCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-[#1A2550] focus:outline-none focus:border-[#C41641] transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#1A2550] font-outfit font-bold uppercase tracking-wider text-[10px]">Téléphone</label>
                  <input
                    type="text"
                    placeholder="Ex: 01 42 30 19 88"
                    value={manualPhone}
                    onChange={e => setManualPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-[#1A2550] focus:outline-none focus:border-[#C41641] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[#1A2550] font-outfit font-bold uppercase tracking-wider text-[10px]">Note Google (ex: 4.8)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={manualRating}
                    onChange={e => setManualRating(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-[#1A2550] focus:outline-none focus:border-[#C41641] font-mono transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#1A2550] font-outfit font-bold uppercase tracking-wider text-[10px]">Nombre d'avis</label>
                  <input
                    type="number"
                    value={manualReviews}
                    onChange={e => setManualReviews(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-[#1A2550] focus:outline-none focus:border-[#C41641] font-mono transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#1A2550] font-outfit font-bold uppercase tracking-wider text-[10px]">Adresse</label>
                <input
                  type="text"
                  placeholder="Ex: 56 Rue du Faubourg Saint-Antoine, Paris"
                  value={manualAddress}
                  onChange={e => setManualAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-[#1A2550] focus:outline-none focus:border-[#C41641] transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#1A2550] font-outfit font-bold uppercase tracking-wider text-[10px]">Site web existant (laisser vide si aucun)</label>
                <input
                  type="text"
                  placeholder="Ex: http://mon-ancien-site.fr"
                  value={manualWebsite}
                  onChange={e => setManualWebsite(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-[#1A2550] focus:outline-none focus:border-[#C41641] font-mono transition"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-ghost text-xs !py-2.5 !px-5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs !py-2.5 !px-5"
                >
                  Enregistrer dans SQLite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
