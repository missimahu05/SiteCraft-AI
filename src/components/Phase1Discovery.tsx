import { useState } from 'react';
import type { BusinessProfile } from '../types';
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

  const runSimulatedScraper = (query: string) => {
    setIsScraping(true);
    setScrapeTerminalLog([
      `[Playwright] Launching chromium headless...`,
      `[Playwright] Navigating to Google Maps search: "${query}"`,
      `[Extractor] Parsing DOM elements: h1.DUwDvf, div.F7nice, phone, address...`,
      `[Rule Check] Testing criteria: Reviews >= 15 & Rating >= 3.8...`,
      `[Scraper] 1 new qualified business detected and added to pipeline!`
    ]);

    setTimeout(() => {
      const generatedId = `lead-${Date.now()}`;
      const newLead: BusinessProfile = {
        id: generatedId,
        title: query.includes('Boulangerie') ? 'Boulangerie Les Délices du Faubourg' : 'Plomberie Chauffage Express',
        rating: 4.8,
        reviewsCount: 42,
        category: query.includes('Boulangerie') ? 'Boulangerie' : 'Artisan Plombier',
        phone: '01 42 30 19 88',
        address: '56 Rue du Faubourg Saint-Antoine, 75012 Paris',
        website: query.includes('Boulangerie') ? null : 'http://plombier-depannage-idf.free.fr',
        photos: [
          'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
        ],
        tagline: 'Service artisanal réactif, devis gratuit et interventions garanties.',
        description: 'Professionnel certifié intervenant avec rigueur et des tarifs conventionnés transparents.',
        openingHours: ['Lundi - Samedi : 07h00 - 20h00', 'Dimanche : Fermé'],
        services: [
          { name: 'Intervention d\'urgence', description: 'Arrivée sous 45 min garantie', price: 'Dès 89 €' },
          { name: 'Installation & Rénovation', description: 'Matériel certifié NF', price: 'Sur devis' }
        ],
        topReviews: [
          { author: 'Guillaume T.', rating: 5, text: 'Travail impeccable et ponctualité exemplaire !', date: 'Hier' }
        ],
        status: query.includes('Boulangerie') ? 'opportunite_creation' : 'opportunite_refonte'
      };

      onAddNewLead(newLead);
      setIsScraping(false);
    }, 2000);
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
    <div className="space-y-6">
      {/* Intro & Rules Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Phase 1 : Scraping, Détection & Qualification Google Maps</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Automatisation Playwright
            </span>
          </div>
          <p className="text-sm text-zinc-400 max-w-3xl">
            Critères algorithmiques stricts : <strong>Avis Google ≥ 15</strong> (activité économique prouvée) et <strong>Note moyenne ≥ 3.8/5.0</strong>.
            Détection automatique des commerces <em>sans site web</em> (Opportunité Création) ou avec un <em>site obsolète</em> (Opportunité Refonte).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un commerce</span>
        </button>
      </div>

      {/* Quick Search & Scraper Launcher */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Rechercher par nom, ville, ou catégorie (ex: Boulangerie, Paris, Garage)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filterType === 'all' ? 'bg-zinc-800 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'}`}
            >
              Tous ({leads.length})
            </button>
            <button
              onClick={() => setFilterType('creation')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filterType === 'creation' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-zinc-400 hover:text-white'}`}
            >
              Création ({leads.filter(l => !l.website).length})
            </button>
            <button
              onClick={() => setFilterType('refonte')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filterType === 'refonte' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-zinc-400 hover:text-white'}`}
            >
              Refonte ({leads.filter(l => !!l.website).length})
            </button>
          </div>
        </div>

        {/* Live Scraper Launchers */}
        <div className="flex items-center gap-2">
          <button
            disabled={isScraping}
            onClick={() => runSimulatedScraper('Boulangerie Paris')}
            className="flex-1 px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scrape Paris</span>
          </button>
          <button
            disabled={isScraping}
            onClick={() => runSimulatedScraper('Plombier Lyon')}
            className="flex-1 px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            <Terminal className="w-3.5 h-3.5 text-teal-400" />
            <span>Scrape Lyon</span>
          </button>
        </div>
      </div>

      {/* Terminal Scraper Output */}
      {isScraping && (
        <div className="p-4 rounded-xl bg-black border border-emerald-500/30 text-emerald-400 font-mono text-xs space-y-1 shadow-lg">
          <div className="flex items-center gap-2 pb-1 border-b border-emerald-500/20 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Exécution Playwright en cours (scraper_maps.js)...</span>
          </div>
          {scrapeTerminalLog.map((log, i) => (
            <p key={i}>&gt; {log}</p>
          ))}
        </div>
      )}

      {/* Leads Table / Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredLeads.map((lead) => {
          const isEligible = lead.rating >= 3.8 && lead.reviewsCount >= 15;
          const isCreation = !lead.website;

          return (
            <div
              key={lead.id}
              className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">{lead.category}</span>
                    <h3 className="text-lg font-bold text-white leading-snug">{lead.title}</h3>
                  </div>

                  {isCreation ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                      Opportunité Création
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                      Opportunité Refonte
                    </span>
                  )}
                </div>

                {/* Rating and Reviews */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{lead.rating.toFixed(1)} / 5</span>
                  </div>
                  <span className="text-zinc-400">({lead.reviewsCount} avis certifiés)</span>

                  {isEligible ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Éligible (≥3.8★ & ≥15 avis)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 text-xs">
                      <AlertCircle className="w-3.5 h-3.5" /> Hors critères
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-zinc-400 pt-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">{lead.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    {lead.website ? (
                      <span className="text-zinc-300 truncate">{lead.website}</span>
                    ) : (
                      <span className="text-red-400 italic">Aucun site web officiel répertorié</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectLead(lead)}
                  className="text-xs text-zinc-400 hover:text-white transition font-medium cursor-pointer"
                >
                  Voir fiche complète
                </button>

                <button
                  onClick={() => onNavigateToAudit(lead)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <span>{lead.website ? 'Auditer avec Vision LLM' : 'Générer le Site'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Ajouter un nouveau commerce</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400">Nom de l'établissement *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Restaurant Le Bistrot Parisien"
                  value={manualTitle}
                  onChange={e => setManualTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400">Catégorie</label>
                  <input
                    type="text"
                    placeholder="Ex: Restaurant, Plombier..."
                    value={manualCategory}
                    onChange={e => setManualCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400">Téléphone</label>
                  <input
                    type="text"
                    placeholder="Ex: 01 42 00 00 00"
                    value={manualPhone}
                    onChange={e => setManualPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400">Note Google (ex: 4.8)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={manualRating}
                    onChange={e => setManualRating(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400">Nombre d'avis</label>
                  <input
                    type="number"
                    value={manualReviews}
                    onChange={e => setManualReviews(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Adresse complète</label>
                <input
                  type="text"
                  placeholder="Ex: 15 Rue de Rivoli, 75004 Paris"
                  value={manualAddress}
                  onChange={e => setManualAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Site web actuel (laisser vide si aucun)</label>
                <input
                  type="text"
                  placeholder="Ex: http://mon-vieux-site.fr"
                  value={manualWebsite}
                  onChange={e => setManualWebsite(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold cursor-pointer shadow-md"
                >
                  Enregistrer le Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
