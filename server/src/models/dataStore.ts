import mongoose from 'mongoose';
import { LeadModel } from './Lead.js';
import { PaymentModel } from './Payment.js';
import { SettingModel } from './Setting.js';

// Realistic initial seed leads with exact geographic coordinates
const initialSeedLeads = [
  {
    id: 'lead-artisan-01',
    title: 'Atelier Peinture & Rénovation Parakou',
    category: 'Artisan Peintre & Décorateur',
    address: 'Quartier Titirou, Parakou, Bénin',
    city: 'Parakou',
    lat: 9.3371,
    lng: 2.6303,
    phone: '+229 97 00 12 34',
    website: '',
    rating: 4.9,
    reviewsCount: 42,
    photos: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800',
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800'
    ],
    screenshot_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800',
    audit: {
      score_global: '3.8',
      mobile: 32,
      seo: 40,
      performance: 45,
      points_forts: ['Fiche Google Maps vérifiée', 'Avis élogieux 4.9★', 'Artisan très recommandé'],
      points_faibles: ['Aucun site web actif', 'Manque de formulaire de devis 24h', 'Absence de galerie travaux']
    },
    generatedSite: {
      slug: 'atelier-peinture-parakou',
      cloudflareUrl: 'https://atelier-peinture-parakou.pages.dev',
      customDomain: '',
      status: 'deployed'
    },
    status: 'nouveau'
  },
  {
    id: 'lead-artisan-02',
    title: 'Menuiserie Ébénisterie d\'Art Borgou',
    category: 'Menuisier & Agenceur Bois',
    address: 'Quartier Banikanni, Parakou, Bénin',
    city: 'Parakou',
    lat: 9.3520,
    lng: 2.6180,
    phone: '+229 96 45 12 89',
    website: '',
    rating: 4.8,
    reviewsCount: 31,
    photos: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800'
    ],
    screenshot_url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800',
    audit: {
      score_global: '3.9',
      mobile: 25,
      seo: 38,
      performance: 42,
      points_forts: ['Fabrications sur-mesure de haute qualité', 'Très forte fidélité client'],
      points_faibles: ['Aucune présence web', 'Pas de catalogue digital en ligne']
    },
    generatedSite: {
      slug: 'menuiserie-art-borgou',
      cloudflareUrl: 'https://menuiserie-art-borgou.pages.dev',
      customDomain: '',
      status: 'deployed'
    },
    status: 'nouveau'
  },
  {
    id: 'lead-artisan-03',
    title: 'Garage Auto & Climatisation Express',
    category: 'Mécanique & Diagnostic Automobile',
    address: 'Grand Marché Zongo, Parakou, Bénin',
    city: 'Parakou',
    lat: 9.3440,
    lng: 2.6240,
    phone: '+229 97 88 55 21',
    website: '',
    rating: 4.7,
    reviewsCount: 54,
    photos: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=800'
    ],
    screenshot_url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=800',
    status: 'nouveau'
  },
  {
    id: 'lead-artisan-04',
    title: 'Plomberie Moderne & Dépannage Express',
    category: 'Plombier Sanitaire',
    address: 'Avenue Clozel, Cotonou, Bénin',
    city: 'Cotonou',
    lat: 6.3650,
    lng: 2.4310,
    phone: '+229 95 44 88 12',
    website: 'http://plomberie-cotonou-old.fr.st',
    rating: 4.7,
    reviewsCount: 38,
    photos: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800'
    ],
    screenshot_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800',
    audit: {
      score_global: '4.2',
      mobile: 38,
      seo: 42,
      performance: 35,
      points_forts: ['Réputation solide', 'Disponibilité 24/7'],
      points_faibles: ['Site obsolète non responsive', 'Pas de SSL HTTPS', 'Lenteur excessive sur mobile']
    },
    generatedSite: {
      slug: 'plomberie-express-cotonou',
      cloudflareUrl: 'https://plomberie-express-cotonou.pages.dev',
      customDomain: '',
      status: 'deployed'
    },
    status: 'nouveau'
  },
  {
    id: 'lead-artisan-05',
    title: 'Saveurs & Délices d\'Afrique',
    category: 'Restaurant & Traiteur Événementiel',
    address: 'Boulevard de la Marina, Cotonou, Bénin',
    city: 'Cotonou',
    lat: 6.3530,
    lng: 2.3990,
    phone: '+229 96 11 22 33',
    website: '',
    rating: 4.8,
    reviewsCount: 89,
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800'
    ],
    screenshot_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
    audit: {
      score_global: '4.0',
      mobile: 30,
      seo: 35,
      performance: 50,
      points_forts: ['Très forte affluence', 'Excellents avis clients'],
      points_faibles: ['Pas de menu interactif', 'Aucune réservation en ligne', 'Pas de commande à emporter']
    },
    generatedSite: {
      slug: 'saveurs-delices-afrique',
      cloudflareUrl: 'https://saveurs-delices-afrique.pages.dev',
      customDomain: '',
      status: 'deployed'
    },
    status: 'nouveau'
  },
  {
    id: 'lead-artisan-06',
    title: 'Couture & Stylisme Africain Élégance',
    category: 'Maison de Couture & Création Textile',
    address: 'Quartier Cadjehoun, Cotonou, Bénin',
    city: 'Cotonou',
    lat: 6.3620,
    lng: 2.4080,
    phone: '+229 97 12 34 56',
    website: '',
    rating: 4.9,
    reviewsCount: 65,
    photos: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800'
    ],
    screenshot_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800',
    status: 'nouveau'
  },
  {
    id: 'lead-artisan-07',
    title: 'Ferronnerie & Métallerie d\'Art Ouando',
    category: 'Artisan Ferronnier & Soudeur',
    address: 'Marché Ouando, Porto-Novo, Bénin',
    city: 'Porto-Novo',
    lat: 6.5020,
    lng: 2.6150,
    phone: '+229 94 33 22 11',
    website: '',
    rating: 4.8,
    reviewsCount: 28,
    photos: [
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=800'
    ],
    screenshot_url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=800',
    status: 'nouveau'
  }
];

// In-memory store fallback
let memoryLeads: any[] = [...initialSeedLeads];
let memoryPayments: any[] = [];
let memorySettings: Record<string, string> = {
  MONGODB_URI: process.env.MONGODB_URI || '',
  CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN || '',
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID || '',
  FEEXPAY_API_KEY: process.env.FEEXPAY_API_KEY || '',
  FEEXPAY_SHOP_ID: process.env.FEEXPAY_SHOP_ID || '',
  FEEXPAY_MODE: process.env.FEEXPAY_MODE || 'TEST',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
};

function isMongoReady() {
  return mongoose.connection.readyState === 1;
}

export const DataStore = {
  // LEADS
  async getLeads(): Promise<any[]> {
    if (isMongoReady()) {
      try {
        // Ensure seed leads exist and have lat/lng coordinates
        for (const seed of initialSeedLeads) {
          await LeadModel.updateOne(
            { id: seed.id },
            { $set: { lat: seed.lat, lng: seed.lng, address: seed.address, city: seed.city } },
            { upsert: true }
          );
        }
        return await LeadModel.find().lean();
      } catch (err) {
        console.error('Mongo getLeads error, using memory:', err);
      }
    }
    return memoryLeads;
  },

  async getLeadById(id: string): Promise<any | null> {
    if (isMongoReady()) {
      try {
        return await LeadModel.findOne({ id }).lean();
      } catch (err) {
        console.error('Mongo getLeadById error:', err);
      }
    }
    return memoryLeads.find(l => l.id === id) || null;
  },

  async addLead(leadData: any): Promise<any> {
    const newLead = {
      ...leadData,
      id: leadData.id || `lead-${Date.now()}`,
      status: leadData.status || 'nouveau',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (isMongoReady()) {
      try {
        const created = await LeadModel.create(newLead);
        return created.toObject();
      } catch (err) {
        console.error('Mongo addLead error:', err);
      }
    }
    memoryLeads.unshift(newLead);
    return newLead;
  },

  async updateLead(id: string, updates: any): Promise<any | null> {
    if (isMongoReady()) {
      try {
        const updated = await LeadModel.findOneAndUpdate(
          { id },
          { $set: updates },
          { new: true }
        ).lean();
        if (updated) return updated;
      } catch (err) {
        console.error('Mongo updateLead error:', err);
      }
    }

    const idx = memoryLeads.findIndex(l => l.id === id);
    if (idx !== -1) {
      memoryLeads[idx] = { ...memoryLeads[idx], ...updates, updatedAt: new Date() };
      return memoryLeads[idx];
    }
    return null;
  },

  // PAYMENTS (FeexPay)
  async getPayments(): Promise<any[]> {
    if (isMongoReady()) {
      try {
        return await PaymentModel.find().sort({ createdAt: -1 }).lean();
      } catch (err) {
        console.error('Mongo getPayments error:', err);
      }
    }
    return memoryPayments;
  },

  async createPayment(paymentData: any): Promise<any> {
    const newPayment = {
      ...paymentData,
      transactionId: paymentData.transactionId || `FP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: paymentData.status || 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (isMongoReady()) {
      try {
        const created = await PaymentModel.create(newPayment);
        return created.toObject();
      } catch (err) {
        console.error('Mongo createPayment error:', err);
      }
    }
    memoryPayments.unshift(newPayment);
    return newPayment;
  },

  async updatePayment(transactionId: string, updates: any): Promise<any | null> {
    if (isMongoReady()) {
      try {
        const updated = await PaymentModel.findOneAndUpdate(
          { transactionId },
          { $set: updates },
          { new: true }
        ).lean();
        if (updated) return updated;
      } catch (err) {
        console.error('Mongo updatePayment error:', err);
      }
    }

    const idx = memoryPayments.findIndex(p => p.transactionId === transactionId);
    if (idx !== -1) {
      memoryPayments[idx] = { ...memoryPayments[idx], ...updates, updatedAt: new Date() };
      return memoryPayments[idx];
    }
    return null;
  },

  // SETTINGS
  async getSettings(): Promise<Record<string, string>> {
    if (isMongoReady()) {
      try {
        const docs = await SettingModel.find().lean();
        const res: Record<string, string> = { ...memorySettings };
        docs.forEach(d => { res[d.key] = d.value; });
        return res;
      } catch (err) {
        console.error('Mongo getSettings error:', err);
      }
    }
    return memorySettings;
  },

  async setSetting(key: string, value: string): Promise<void> {
    memorySettings[key] = value;
    if (isMongoReady()) {
      try {
        await SettingModel.findOneAndUpdate(
          { key },
          { $set: { key, value, updatedAt: new Date() } },
          { upsert: true }
        );
      } catch (err) {
        console.error('Mongo setSetting error:', err);
      }
    }
  }
};
