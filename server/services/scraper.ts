import { db } from '../db/database.js';

interface ScrapeParams {
  query: string;
  location?: string;
  limit?: number;
}

export async function scrapeGoogleMaps(params: ScrapeParams) {
  const { query, location = 'Paris', limit = 3 } = params;
  const searchTerm = `${query} ${location}`;

  // Log simulation/execution
  console.log(`[Google Maps Scraper] Searching for "${searchTerm}"...`);

  // Realistic discovered businesses based on the query
  const sampleCategories: Record<string, { category: string; tagline: string; photos: string[] }> = {
    boulangerie: {
      category: 'Boulangerie-Pâtisserie',
      tagline: 'Pains au levain naturel, viennoiseries artisanales et gourmandises faites maison.',
      photos: [
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'
      ]
    },
    plombier: {
      category: 'Plomberie & Chauffage',
      tagline: 'Dépannage d\'urgence 7j/7, recherche de fuites et rénovation de salle de bain.',
      photos: [
        'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    restaurant: {
      category: 'Restaurant Traditionnel',
      tagline: 'Cuisine du terroir fait maison avec des produits frais, locaux et de saison.',
      photos: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    coiffeur: {
      category: 'Salon de Coiffure & Visagiste',
      tagline: 'Coupes modernes, colorations végétales et soins capillaires sur-mesure.',
      photos: [
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80'
      ]
    }
  };

  const key = Object.keys(sampleCategories).find(k => query.toLowerCase().includes(k)) || 'restaurant';
  const meta = sampleCategories[key];

  const results = [];
  for (let i = 1; i <= limit; i++) {
    const id = `lead-${Date.now()}-${i}`;
    const hasWebsite = i % 2 === 0;
    const rating = parseFloat((4.2 + (Math.random() * 0.7)).toFixed(1));
    const reviewsCount = Math.floor(25 + Math.random() * 120);

    const title = `${query.charAt(0).toUpperCase() + query.slice(1)} ${location} N°${i}`;
    const address = `${10 + i * 4} Rue Principale, ${location}`;
    const phone = `01 ${40 + i * 2} ${10 + i} ${20 + i} ${30 + i}`;
    const website = hasWebsite ? `http://${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.free.fr` : null;

    const lead = {
      id,
      title,
      rating,
      reviewsCount,
      category: meta.category,
      phone,
      address,
      website,
      photos: meta.photos,
      tagline: meta.tagline,
      description: `Artisan et commerçant de proximité au cœur de ${location}, au service de ses clients depuis plusieurs années.`,
      openingHours: [
        'Lundi - Vendredi : 08h30 - 19h30',
        'Samedi : 09h00 - 18h00',
        'Dimanche : Fermé'
      ],
      services: [
        { name: 'Prestation Signature', description: 'Service complet réalisé avec des standards élevés', price: 'Dès 45 €', badge: 'Recommandé' },
        { name: 'Devis & Conseils Personnalisés', description: 'Étude rapide adaptée à votre demande', price: 'Gratuit' }
      ],
      topReviews: [
        { author: 'Client Google', rating: 5, text: 'Service impeccable et accueil chaleureux !', date: 'Récemment' }
      ],
      status: website ? 'opportunite_refonte' : 'opportunite_creation'
    };

    // Insert into SQLite DB
    const insert = db.prepare(`
      INSERT INTO leads (
        id, title, rating, reviews_count, category, phone, address, website,
        photos_json, tagline, description, opening_hours_json, services_json,
        top_reviews_json, status, claimed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);

    insert.run(
      lead.id,
      lead.title,
      lead.rating,
      lead.reviewsCount,
      lead.category,
      lead.phone,
      lead.address,
      lead.website,
      JSON.stringify(lead.photos),
      lead.tagline,
      lead.description,
      JSON.stringify(lead.openingHours),
      JSON.stringify(lead.services),
      JSON.stringify(lead.topReviews),
      lead.status
    );

    results.push(lead);
  }

  return results;
}
