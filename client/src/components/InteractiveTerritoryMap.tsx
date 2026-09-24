import { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { BusinessProfile } from '../types';
import { MapPin, Star, Eye, Compass } from 'lucide-react';

interface TerritoryMapProps {
  leads: BusinessProfile[];
  selectedLead: BusinessProfile | null;
  onSelectLead: (lead: BusinessProfile) => void;
  onNavigateToAudit?: (lead: BusinessProfile) => void;
}

// Key reference coordinates for cities & districts
const CITY_CENTERS: Record<string, [number, number]> = {
  Bénin: [8.5, 2.3], // Overview of Benin
  Parakou: [9.3371, 2.6303],
  Cotonou: [6.3654, 2.4183],
  'Porto-Novo': [6.4969, 2.6289],
  Abidjan: [5.3600, -4.0083],
  Dakar: [14.7167, -17.4677],
};

// Realistic neighborhood anchor points in Parakou
const PARAKOU_NEIGHBORHOODS: [number, number][] = [
  [9.3371, 2.6303], // Titirou
  [9.3520, 2.6180], // Banikanni
  [9.3440, 2.6240], // Zongo / Grand Marché
  [9.3190, 2.6410], // Albarika / Université
  [9.3590, 2.6370], // Amanwambou
  [9.3480, 2.6120], // Guéma
  [9.3280, 2.6250], // Madina
];

// Realistic neighborhood anchor points in Cotonou
const COTONOU_NEIGHBORHOODS: [number, number][] = [
  [6.3530, 2.3990], // Haie Vive / Marina
  [6.3620, 2.4080], // Cadjehoun
  [6.3650, 2.4310], // Avenue Clozel / Ganhi
  [6.3720, 2.4550], // Akpakpa
  [6.3780, 2.4080], // Sainte-Rita
  [6.3580, 2.3680], // Fidjrossè Plage
  [6.3810, 2.3850], // Menontin
];

// Realistic neighborhood anchor points in Porto-Novo
const PORTO_NOVO_NEIGHBORHOODS: [number, number][] = [
  [6.4969, 2.6289], // Centre-Ville
  [6.5020, 2.6150], // Ouando
  [6.4850, 2.6320], // Avakpa
  [6.5110, 2.6080], // Djassin
];

/**
 * Deterministically distributes leads that don't have explicit lat/lng
 * so that markers are spread out naturally across real city districts
 * rather than all collapsing on the same single coordinate point.
 */
function resolveLeadCoordinates(lead: BusinessProfile, index: number): [number, number] {
  if (lead.lat && lead.lng) {
    return [lead.lat, lead.lng];
  }

  const city = lead.city || 'Parakou';
  let anchors = PARAKOU_NEIGHBORHOODS;
  if (city === 'Cotonou') anchors = COTONOU_NEIGHBORHOODS;
  else if (city === 'Porto-Novo') anchors = PORTO_NOVO_NEIGHBORHOODS;

  // Simple string hash for repeatable, stable placement
  let hash = 0;
  const str = lead.id + (lead.title || '');
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const anchorIndex = Math.abs(hash + index) % anchors.length;
  const base = anchors[anchorIndex];

  // Minor jitter (+- 200m) to prevent exact duplicates within the same district
  const jitterLat = ((Math.abs(hash % 100) - 50) / 100) * 0.003;
  const jitterLng = ((Math.abs((hash >> 4) % 100) - 50) / 100) * 0.003;

  return [base[0] + jitterLat, base[1] + jitterLng];
}

export const InteractiveTerritoryMap = ({
  leads,
  selectedLead,
  onSelectLead,
  onNavigateToAudit,
}: TerritoryMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeCity, setActiveCity] = useState<'Tous' | 'Parakou' | 'Cotonou' | 'Porto-Novo'>('Parakou');
  const [mapStyle, setMapStyle] = useState<'osm' | 'voyager' | 'satellite'>('osm');

  // Compute resolved coordinates for every lead
  const enrichedLeads = useMemo(() => {
    return leads.map((lead, idx) => ({
      ...lead,
      resolvedCoords: resolveLeadCoordinates(lead, idx),
    }));
  }, [leads]);

  // Filter leads based on selected city filter
  const visibleLeads = useMemo(() => {
    if (activeCity === 'Tous') return enrichedLeads;
    return enrichedLeads.filter((l) => (l.city || 'Parakou').toLowerCase() === activeCity.toLowerCase());
  }, [enrichedLeads, activeCity]);

  // Tile URL mapping
  const getTileConfig = (style: typeof mapStyle) => {
    switch (style) {
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          maxZoom: 18,
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye',
        };
      case 'voyager':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          maxZoom: 19,
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        };
      case 'osm':
      default:
        // OpenStreetMap: High contrast, vivid street names and building contours
        return {
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        };
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCoords = CITY_CENTERS.Parakou;
    const map = L.map(mapContainerRef.current, {
      center: initialCoords,
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const tileConf = getTileConfig(mapStyle);
    const tileLayer = L.tileLayer(tileConf.url, {
      maxZoom: tileConf.maxZoom,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    markersGroupRef.current = L.featureGroup().addTo(map);
    mapInstanceRef.current = map;

    // Resize handling & multiple invalidations to prevent blank tiles
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      markersGroupRef.current = null;
    };
  }, []);

  // Update Tile Style
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileConf = getTileConfig(mapStyle);
    const newLayer = L.tileLayer(tileConf.url, {
      maxZoom: tileConf.maxZoom,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = newLayer;
    map.invalidateSize();
  }, [mapStyle]);

  // Update Markers & Auto-frame Bounds
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    // Clear previous markers
    markersGroup.clearLayers();

    if (visibleLeads.length === 0) return;

    visibleLeads.forEach((lead) => {
      const [lat, lng] = lead.resolvedCoords;
      const isSelected = selectedLead?.id === lead.id;
      const isCreation = !lead.website;

      // Custom HTML Marker without Leaflet default border/box
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="relative group cursor-pointer" style="filter: drop-shadow(0 6px 14px rgba(15, 23, 42, 0.35));">
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center font-outfit font-black text-xs text-white transition-all duration-300 ${
              isSelected
                ? 'bg-[#EA580C] ring-4 ring-[#EA580C]/40 scale-125 z-50 shadow-xl'
                : isCreation
                ? 'bg-[#0F172A] hover:bg-[#EA580C] hover:scale-110 shadow-md'
                : 'bg-[#2563EB] hover:bg-[#EA580C] hover:scale-110 shadow-md'
            }">
              <span>${lead.title.substring(0, 2).toUpperCase()}</span>
            </div>
            
            <div class="absolute -top-2.5 -right-2.5 bg-[#FEF08A] text-[#0F172A] text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm flex items-center gap-0.5">
              <span>★</span><span>${lead.rating.toFixed(1)}</span>
            </div>

            ${
              isSelected
                ? '<div class="absolute -inset-1.5 rounded-2xl bg-[#EA580C] animate-ping opacity-35 pointer-events-none"></div>'
                : ''
            }
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -22],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Rich interactive Leaflet popup
      const popupHtml = `
        <div class="p-3.5 space-y-2.5 min-w-[220px] max-w-[280px] font-sans">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isCreation
                  ? 'bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA]'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }">
                ${isCreation ? 'Sans Site (300k)' : 'Refonte Éligible'}
              </span>
              <h4 class="font-outfit font-black text-sm text-[#0F172A] mt-1.5 leading-snug">
                ${lead.title}
              </h4>
              <p class="text-[11px] text-slate-500 font-medium">${lead.category}</p>
            </div>
            <div class="flex items-center gap-0.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
              <span>★</span><span>${lead.rating.toFixed(1)}</span>
            </div>
          </div>

          <div class="text-[11px] text-slate-600 space-y-1 border-t border-slate-100 pt-2">
            <p class="flex items-center gap-1.5">
              <span class="text-[#EA580C]">📍</span>
              <span class="truncate">${lead.address || lead.city}</span>
            </p>
            <p class="flex items-center gap-1.5">
              <span class="text-slate-400">📞</span>
              <span>${lead.phone}</span>
            </p>
          </div>

          <div class="pt-1">
            <button 
              id="popup-audit-btn-${lead.id}" 
              class="w-full py-2 px-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-outfit font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <span>Auditer Prospect</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectLead(lead);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-audit-btn-${lead.id}`);
        if (btn && onNavigateToAudit) {
          btn.onclick = () => onNavigateToAudit(lead);
        }
      });

      markersGroup.addLayer(marker);
    });

    // Auto-fit bounds so all visible pins are centered and visible!
    if (markersGroup.getLayers().length > 0) {
      const bounds = markersGroup.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 14,
        });
      }
    }
  }, [visibleLeads, selectedLead]);

  // Center on selected lead if it changes
  useEffect(() => {
    if (!selectedLead || !mapInstanceRef.current) return;
    const [lat, lng] = resolveLeadCoordinates(selectedLead, 0);
    mapInstanceRef.current.flyTo([lat, lng], 14, { duration: 0.8 });
  }, [selectedLead]);

  // Handle city button switch
  const handleCityChange = (city: typeof activeCity) => {
    setActiveCity(city);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (city === 'Tous') {
      const coords = CITY_CENTERS.Bénin;
      map.flyTo(coords, 7, { duration: 1.2 });
    } else {
      const coords = CITY_CENTERS[city];
      if (coords) {
        map.flyTo(coords, 13, { duration: 1 });
      }
    }
    setTimeout(() => map.invalidateSize(), 300);
  };

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-3xl overflow-hidden bg-slate-50 flex flex-col">
      {/* Map Leaflet Container */}
      <div ref={mapContainerRef} className="w-full flex-1 min-h-[520px] z-0" />

      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        {/* City Filter Pills */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-md pointer-events-auto">
          <div className="px-2 py-1 text-[11px] font-outfit font-black text-[#0F172A] flex items-center gap-1.5 uppercase">
            <Compass className="w-3.5 h-3.5 text-[#EA580C]" />
            <span className="hidden sm:inline">Ville :</span>
          </div>
          {(['Parakou', 'Cotonou', 'Porto-Novo', 'Tous'] as const).map((c) => (
            <button
              key={c}
              onClick={() => handleCityChange(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-outfit font-bold transition cursor-pointer ${
                activeCity === c
                  ? 'bg-[#0F172A] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-100'
              }`}
            >
              {c === 'Tous' ? 'Tout le Bénin' : c}
            </button>
          ))}
        </div>

        {/* Tile Style Selector (OSM / Voyager / Satellite) */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-md pointer-events-auto text-xs">
          <button
            onClick={() => setMapStyle('osm')}
            className={`px-3 py-1.5 rounded-xl font-outfit font-bold transition cursor-pointer flex items-center gap-1 ${
              mapStyle === 'osm' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F172A]'
            }`}
            title="OpenStreetMap - Rues colorées et bien visibles"
          >
            <span>Rues (OSM)</span>
          </button>
          <button
            onClick={() => setMapStyle('satellite')}
            className={`px-3 py-1.5 rounded-xl font-outfit font-bold transition cursor-pointer flex items-center gap-1 ${
              mapStyle === 'satellite' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F172A]'
            }`}
            title="Vue Satellite Réelle Haute Résolution"
          >
            <span>Satellite</span>
          </button>
          <button
            onClick={() => setMapStyle('voyager')}
            className={`px-3 py-1.5 rounded-xl font-outfit font-bold transition cursor-pointer flex items-center gap-1 ${
              mapStyle === 'voyager' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:text-[#0F172A]'
            }`}
            title="Style Clair Architectural Minimaliste"
          >
            <span>Minimal</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Info Card for currently selected lead */}
      {selectedLead && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-20 pointer-events-auto animate-in fade-in slide-in-from-bottom-2">
          <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-outfit font-black text-sm shrink-0 shadow-md">
                  {selectedLead.title.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-outfit font-black text-sm text-[#0F172A] uppercase leading-tight line-clamp-1">
                    {selectedLead.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#EA580C] shrink-0" />
                    <span className="truncate">{selectedLead.address || selectedLead.city}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[#0F172A] font-mono text-xs font-bold shrink-0">
                <Star className="w-3.5 h-3.5 text-[#FBBF24] fill-[#FBBF24]" />
                <span>{selectedLead.rating.toFixed(1)}</span>
                <span className="text-slate-400">({selectedLead.reviewsCount})</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-[11px] font-mono text-[#EA580C] font-bold">
                {selectedLead.website ? '✦ Refonte éligible' : '✦ Zéro site (Création 300 000 F)'}
              </span>

              {onNavigateToAudit && (
                <button
                  onClick={() => onNavigateToAudit(selectedLead)}
                  className="btn-primary text-xs !py-1.5 !px-3.5 !rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Auditer Vision</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveTerritoryMap;
