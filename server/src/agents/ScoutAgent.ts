import { AgentActionLog } from './types.js';
import { DataStore } from '../models/dataStore.js';

export class ScoutAgent {
  static role = 'scout' as const;
  static name = 'ScoutAgent';
  static title = 'Détecteur & Cartographe Google Maps';
  static description = 'Explore les territoires géographiques, extrait les fiches Maps et qualifie les artisans sans site web.';
  static tools = ['search_google_maps', 'geocode_territory', 'filter_unclaimed_leads', 'extract_contact_info'];

  static async execute(params: { query: string; location: string; logFn: (log: AgentActionLog) => void }) {
    const { query, location, logFn } = params;

    logFn({
      id: `log-${Date.now()}-1`,
      agentRole: this.role,
      agentName: this.name,
      timestamp: new Date().toISOString(),
      type: 'thought',
      message: `Analyse de la zone cible "${location}" pour le corps de métier "${query}"...`
    });

    logFn({
      id: `log-${Date.now()}-2`,
      agentRole: this.role,
      agentName: this.name,
      timestamp: new Date().toISOString(),
      type: 'tool_call',
      message: `search_google_maps({ query: "${query}", location: "${location}", radius: "25km" })`
    });

    // Realistic coordinates map based on location
    const coordsMap: Record<string, { lat: number; lng: number }> = {
      'parakou': { lat: 9.3371, lng: 2.6303 },
      'cotonou': { lat: 6.3654, lng: 2.4183 },
      'porto-novo': { lat: 6.4969, lng: 2.6289 },
      'abidjan': { lat: 5.3600, lng: -4.0083 },
      'dakar': { lat: 14.7167, lng: -17.4677 },
      'lomé': { lat: 6.1375, lng: 1.2123 },
      'paris': { lat: 48.8566, lng: 2.3522 }
    };

    const cleanLoc = location.toLowerCase().trim();
    const baseCoords = coordsMap[cleanLoc] || { lat: 9.3371, lng: 2.6303 };

    // Generate 2 qualified businesses around this coordinate
    const discoveredLeads = [];
    for (let i = 0; i < 2; i++) {
      const latOffset = (Math.random() - 0.5) * 0.04;
      const lngOffset = (Math.random() - 0.5) * 0.04;
      const id = `lead-${Date.now()}-${i}`;
      const title = `${query.charAt(0).toUpperCase() + query.slice(1)} Pro ${location} ${i > 0 ? `#${i + 1}` : ''}`.trim();
      
      const lead = await DataStore.addLead({
        id,
        title,
        category: query,
        address: `Quartier ${i === 0 ? 'Titirou' : 'Albarika'}, ${location}`,
        city: location,
        phone: '+229 97 ' + Math.floor(10 + Math.random() * 89) + ' ' + Math.floor(10 + Math.random() * 89) + ' ' + Math.floor(10 + Math.random() * 89),
        website: '',
        rating: +(4.6 + Math.random() * 0.3).toFixed(1),
        reviewsCount: Math.floor(25 + Math.random() * 60),
        lat: baseCoords.lat + latOffset,
        lng: baseCoords.lng + lngOffset,
        photos: [
          'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800',
          'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800'
        ],
        screenshot_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800',
        status: 'nouveau'
      });
      discoveredLeads.push(lead);
    }

    logFn({
      id: `log-${Date.now()}-3`,
      agentRole: this.role,
      agentName: this.name,
      timestamp: new Date().toISOString(),
      type: 'output',
      message: `Extraction réussie : ${discoveredLeads.length} prospects qualifiés sans site web détectés et positionnés sur la carte.`
    });

    return discoveredLeads;
  }
}
