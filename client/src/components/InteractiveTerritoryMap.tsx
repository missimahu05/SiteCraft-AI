import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { BusinessProfile } from '../types';
import { MapPin, Star, Eye, Layers } from 'lucide-react';

interface TerritoryMapProps {
  leads: BusinessProfile[];
  selectedLead: BusinessProfile | null;
  onSelectLead: (lead: BusinessProfile) => void;
  onNavigateToAudit?: (lead: BusinessProfile) => void;
}

export const InteractiveTerritoryMap = ({
  leads,
  selectedLead,
  onSelectLead,
  onNavigateToAudit
}: TerritoryMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [activeCity, setActiveCity] = useState<'Parakou' | 'Cotonou' | 'Porto-Novo' | 'Abidjan' | 'Dakar'>('Parakou');
  const [mapStyle, setMapStyle] = useState<'light' | 'dark' | 'street'>('light');

  const cityCoords: Record<string, [number, number]> = {
    'Parakou': [9.3371, 2.6303],
    'Cotonou': [6.3654, 2.4183],
    'Porto-Novo': [6.4969, 2.6289],
    'Abidjan': [5.3600, -4.0083],
    'Dakar': [14.7167, -17.4677]
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCoords = cityCoords[activeCity] || [9.3371, 2.6303];
      const map = L.map(mapContainerRef.current, {
        center: initialCoords,
        zoom: 13,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile layer
      const tileUrl = mapStyle === 'dark' 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Style
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    const tileUrl = mapStyle === 'dark' 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19
    }).addTo(mapInstanceRef.current);
  }, [mapStyle]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    leads.forEach(lead => {
      // Default coordinates fallback based on city or slight offset
      const base = cityCoords[lead.city || 'Parakou'] || [9.3371, 2.6303];
      const lat = lead.lat || base[0];
      const lng = lead.lng || base[1];

      const isSelected = selectedLead?.id === lead.id;

      // Custom div icon
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="relative group cursor-pointer">
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center font-outfit font-black text-xs shadow-xl transition-all duration-300 ${
              isSelected 
                ? 'bg-[#C41641] text-white ring-4 ring-[#C41641]/30 scale-125' 
                : 'bg-[#1A2550] text-white hover:scale-110 hover:bg-[#C41641]'
            }">
              <span>${lead.title.substring(0, 2).toUpperCase()}</span>
            </div>
            <div class="absolute -top-1.5 -right-1.5 bg-[#FBBF24] text-[#1A2550] text-[9px] font-mono font-bold px-1 rounded-full shadow">
              ★${lead.rating}
            </div>
            ${isSelected ? '<div class="absolute inset-0 rounded-2xl bg-[#C41641] animate-ping opacity-25"></div>' : ''}
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Popup
      marker.on('click', () => {
        onSelectLead(lead);
        map.flyTo([lat, lng], 14, { duration: 1 });
      });

      markersRef.current.push(marker);
    });
  }, [leads, selectedLead]);

  // Fly to selected city
  const handleCityChange = (city: typeof activeCity) => {
    setActiveCity(city);
    const coords = cityCoords[city];
    if (mapInstanceRef.current && coords) {
      mapInstanceRef.current.flyTo(coords, 13, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border border-[#E0E3EF] shadow-card bg-[#FAF9F6]">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Territory Selector */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-[#E0E3EF] shadow-lg pointer-events-auto">
          {(['Parakou', 'Cotonou', 'Porto-Novo', 'Abidjan', 'Dakar'] as const).map(c => (
            <button
              key={c}
              onClick={() => handleCityChange(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-outfit font-bold transition cursor-pointer ${
                activeCity === c 
                  ? 'bg-[#1A2550] text-white shadow-sm' 
                  : 'text-[#6B7299] hover:text-[#1A2550] hover:bg-[#F4F2EE]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Map Theme Toggle */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-[#E0E3EF] shadow-lg pointer-events-auto">
          <button
            onClick={() => setMapStyle(mapStyle === 'light' ? 'dark' : 'light')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold text-[#1A2550] hover:bg-[#F4F2EE] transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#C41641]" />
            <span>{mapStyle === 'light' ? 'Mode Sombre' : 'Mode Clair'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Prospect Card (if lead selected) */}
      {selectedLead && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-10 pointer-events-auto">
          <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E0E3EF] shadow-2xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#1A2550] text-white flex items-center justify-center font-outfit font-black text-sm shrink-0">
                  {selectedLead.title.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-outfit font-black text-sm text-[#1A2550] uppercase leading-tight line-clamp-1">
                    {selectedLead.title}
                  </h4>
                  <p className="text-[11px] text-[#6B7299] font-mono flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C41641]" />
                    <span className="truncate">{selectedLead.address || selectedLead.city}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[#1A2550] font-mono text-[10px] font-bold shrink-0">
                <Star className="w-3 h-3 text-[#FBBF24] fill-[#FBBF24]" />
                <span>{selectedLead.rating}</span>
                <span className="text-zinc-400">({selectedLead.reviewsCount})</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E0E3EF] text-xs">
              <span className="text-[11px] font-mono text-[#C41641] font-bold">
                {selectedLead.website ? 'Site obsolète' : '✦ Zéro site web'}
              </span>

              <div className="flex gap-2">
                {onNavigateToAudit && (
                  <button
                    onClick={() => onNavigateToAudit(selectedLead)}
                    className="btn-primary text-xs !py-1.5 !px-3 !rounded-xl flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lancer Audit</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
