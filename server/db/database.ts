import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const dataDir = path.resolve(process.cwd(), 'server/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'sitecraft.db');
export const db = new DatabaseSync(dbPath);

// Initialize Tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      rating REAL NOT NULL,
      reviews_count INTEGER NOT NULL,
      category TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      website TEXT,
      photos_json TEXT,
      tagline TEXT,
      description TEXT,
      opening_hours_json TEXT,
      services_json TEXT,
      top_reviews_json TEXT,
      status TEXT DEFAULT 'opportunite_creation',
      claimed INTEGER DEFAULT 0,
      deployment_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audits (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL,
      score_global REAL NOT NULL,
      criteres_json TEXT NOT NULL,
      defauts_majeurs_json TEXT NOT NULL,
      eligible_refonte INTEGER NOT NULL,
      audit_date TEXT NOT NULL,
      screenshot_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS stripe_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      amount INTEGER NOT NULL,
      business_name TEXT NOT NULL,
      domain TEXT NOT NULL,
      status TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      webhook_actions_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Seed default settings if not exists
  const countSettings = db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number };
  if (countSettings.count === 0) {
    const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    insertSetting.run('OPENAI_API_KEY', process.env.OPENAI_API_KEY || '');
    insertSetting.run('GEMINI_API_KEY', process.env.GEMINI_API_KEY || '');
    insertSetting.run('VERCEL_AUTH_TOKEN', process.env.VERCEL_AUTH_TOKEN || '');
    insertSetting.run('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY || '');
    insertSetting.run('RESEND_API_KEY', process.env.RESEND_API_KEY || '');
  }

  // Seed initial leads if empty
  const countLeads = db.prepare('SELECT COUNT(*) as count FROM leads').get() as { count: number };
  if (countLeads.count === 0) {
    seedInitialLeads();
  }
}

function seedInitialLeads() {
  const insertLead = db.prepare(`
    INSERT INTO leads (
      id, title, rating, reviews_count, category, phone, address, website,
      photos_json, tagline, description, opening_hours_json, services_json,
      top_reviews_json, status, claimed
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?
    )
  `);

  insertLead.run(
    'lead-1',
    'Boulangerie Artisanale Le Pain Doré',
    4.8,
    84,
    'Boulangerie-Pâtisserie',
    '01 43 28 92 10',
    '42 Rue de la Roquette, 75011 Paris',
    null,
    JSON.stringify([
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'
    ]),
    'Pains au levain naturel cuits sur pierre, viennoiseries 100% pur beurre et pâtisseries fines.',
    'Depuis 2012, notre atelier artisanal perpétue le savoir-faire de la tradition française avec des farines biologiques locales.',
    JSON.stringify([
      'Lundi - Vendredi : 06h30 - 20h00',
      'Samedi : 07h00 - 20h00',
      'Dimanche : 07h00 - 13h30'
    ]),
    JSON.stringify([
      { name: 'Baguette Tradition Label Rouge', description: 'Farine T65 sans additif, mie alvéolée et croûte croustillante', price: '1,40 €', badge: 'Best-Seller' },
      { name: 'Pain de Campagne au Levain', description: 'Fermentation lente, se conserve 5 jours', price: '4,50 €' },
      { name: 'Croissant Feuilleté Pur Beurre AOP', description: 'Beurre Charentes-Poitou AOP', price: '1,60 €' }
    ]),
    JSON.stringify([
      { author: 'Camille R.', rating: 5, text: 'La meilleure tradition du 11ème sans hésitation ! Les croissants sont divins.', date: 'Il y a 3 jours' },
      { author: 'Marc L.', rating: 5, text: 'Pain au levain exceptionnel qui se conserve parfaitement.', date: 'Il y a 1 semaine' }
    ]),
    'opportunite_creation',
    0
  );

  insertLead.run(
    'lead-2',
    'Garage Automobile Saint-Michel',
    4.6,
    112,
    'Mécanique & Carrosserie',
    '04 72 34 81 90',
    '18 Avenue Berthelot, 69007 Lyon',
    'http://garage-st-michel-lyon.pagesperso-orange.fr',
    JSON.stringify([
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80'
    ]),
    'Entretien multimarque, révision constructeur certifiée et diagnostic électronique de pointe.',
    'Garage indépendant depuis plus de 25 ans. Devis transparents sans surprise et pièces d’origine garanties.',
    JSON.stringify([
      'Lundi - Vendredi : 08h00 - 12h00 / 14h00 - 18h30',
      'Samedi & Dimanche : Fermé'
    ]),
    JSON.stringify([
      { name: 'Révision Complète avec Garantie', description: 'Vidange huile synthétique, filtres et 45 points de contrôle', price: 'Dès 129 €', badge: 'Populaire' },
      { name: 'Diagnostic Électronique OBD', description: 'Recherche de pannes et voyants moteur', price: '49 €' }
    ]),
    JSON.stringify([
      { author: 'David B.', rating: 5, text: 'Honnête, rapide et efficace. Facture conforme au devis initial.', date: 'Il y a 5 jours' }
    ]),
    'opportunite_refonte',
    0
  );

  // Add initial audit for lead-2
  const insertAudit = db.prepare(`
    INSERT INTO audits (
      id, lead_id, score_global, criteres_json, defauts_majeurs_json, eligible_refonte, audit_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertAudit.run(
    'audit-lead-2',
    'lead-2',
    4.2,
    JSON.stringify({ modernite: 3.5, lisibilite: 4.0, cta: 4.5, visuels: 4.8 }),
    JSON.stringify([
      'Site non responsive (inutilisable sur smartphone sans zoomer)',
      'Numéro de téléphone non cliquable en direct',
      'Design hébergé sur pagesperso obsolète depuis les années 2000'
    ]),
    1,
    '2026-09-11'
  );
}
