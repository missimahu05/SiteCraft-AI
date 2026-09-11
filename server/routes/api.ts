import { Router } from 'express';
import { db } from '../db/database.js';
import { scrapeGoogleMaps } from '../services/scraper.js';
import { runVisionAudit } from '../services/auditVision.js';
import { deployToVercel } from '../services/vercelDeployer.js';
import { createStripeSession } from '../services/stripeService.js';

export const apiRouter = Router();

// ----------------- LEADS CRUD -----------------
apiRouter.get('/leads', (req, res) => {
  try {
    const rawLeads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all() as any[];
    const audits = db.prepare('SELECT * FROM audits').all() as any[];

    const auditMap = new Map();
    for (const a of audits) {
      auditMap.set(a.lead_id, {
        score_global: a.score_global,
        criteres: JSON.parse(a.criteres_json || '{}'),
        defauts_majeurs: JSON.parse(a.defauts_majeurs_json || '[]'),
        eligible_refonte: a.eligible_refonte === 1,
        auditDate: a.audit_date
      });
    }

    const formatted = rawLeads.map(l => ({
      id: l.id,
      title: l.title,
      rating: l.rating,
      reviewsCount: l.reviews_count,
      category: l.category,
      phone: l.phone,
      address: l.address,
      website: l.website,
      photos: JSON.parse(l.photos_json || '[]'),
      tagline: l.tagline || '',
      description: l.description || '',
      openingHours: JSON.parse(l.opening_hours_json || '[]'),
      services: JSON.parse(l.services_json || '[]'),
      topReviews: JSON.parse(l.top_reviews_json || '[]'),
      status: l.status,
      claimed: l.claimed === 1,
      deploymentUrl: l.deployment_url,
      audit: auditMap.get(l.id)
    }));

    res.json({ success: true, data: formatted });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/leads', (req, res) => {
  try {
    const lead = req.body;
    const id = lead.id || `lead-${Date.now()}`;

    const insert = db.prepare(`
      INSERT INTO leads (
        id, title, rating, reviews_count, category, phone, address, website,
        photos_json, tagline, description, opening_hours_json, services_json,
        top_reviews_json, status, claimed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);

    insert.run(
      id,
      lead.title,
      lead.rating || 4.5,
      lead.reviewsCount || 20,
      lead.category || 'Commerce Local',
      lead.phone || '',
      lead.address || '',
      lead.website || null,
      JSON.stringify(lead.photos || []),
      lead.tagline || 'Excellence et savoir-faire local.',
      lead.description || '',
      JSON.stringify(lead.openingHours || ['Lundi - Vendredi : 09h00 - 19h00']),
      JSON.stringify(lead.services || [{ name: 'Service Principal', description: 'Prestation complète', price: 'Sur devis' }]),
      JSON.stringify(lead.topReviews || [{ author: 'Client', rating: 5, text: 'Très satisfait', date: 'Récemment' }]),
      lead.website ? 'opportunite_refonte' : 'opportunite_creation'
    );

    res.json({ success: true, data: { ...lead, id } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/leads/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM leads WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- SCRAPER (PHASE 1) -----------------
apiRouter.post('/scrape/maps', async (req, res) => {
  try {
    const { query, location, limit } = req.body;
    const leads = await scrapeGoogleMaps({ query: query || 'Restaurant', location: location || 'Paris', limit: limit || 2 });
    res.json({ success: true, count: leads.length, data: leads });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- AUDIT VISION (PHASE 2) -----------------
apiRouter.post('/audit/vision', async (req, res) => {
  try {
    const { leadId } = req.body;
    if (!leadId) {
      return res.status(400).json({ success: false, error: 'leadId manquant' });
    }
    const audit = await runVisionAudit(leadId);
    res.json({ success: true, data: audit });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- DEPLOYMENT VERCEL (PHASE 3) -----------------
apiRouter.post('/deploy/vercel', async (req, res) => {
  try {
    const { leadId } = req.body;
    if (!leadId) {
      return res.status(400).json({ success: false, error: 'leadId manquant' });
    }
    const result = await deployToVercel(leadId);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- STRIPE & CLOSING (PHASE 5) -----------------
apiRouter.post('/stripe/checkout', async (req, res) => {
  try {
    const { leadId, domain } = req.body;
    if (!leadId) {
      return res.status(400).json({ success: false, error: 'leadId manquant' });
    }
    const result = await createStripeSession({ leadId, domain });
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/stripe/events', (req, res) => {
  try {
    const rawEvents = db.prepare('SELECT * FROM stripe_events ORDER BY created_at DESC').all() as any[];
    const formatted = rawEvents.map(e => ({
      id: e.id,
      type: e.event_type,
      amount: e.amount,
      businessName: e.business_name,
      domain: e.domain,
      status: e.status,
      timestamp: e.timestamp,
      webhookTriggered: JSON.parse(e.webhook_actions_json || '{}')
    }));
    res.json({ success: true, data: formatted });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- SETTINGS & API KEYS -----------------
apiRouter.get('/settings', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM settings').all() as any[];
    const settings: Record<string, string> = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }
    res.json({ success: true, data: settings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/settings', (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ success: false, error: 'Key requise' });

    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value || '');
    res.json({ success: true, key, value });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- AGGREGATED STATS -----------------
apiRouter.get('/stats', (req, res) => {
  try {
    const totalLeads = (db.prepare('SELECT COUNT(*) as c FROM leads').get() as any).c;
    const qualifiedLeads = (db.prepare('SELECT COUNT(*) as c FROM leads WHERE rating >= 3.8 AND reviews_count >= 15').get() as any).c;
    const generatedSites = (db.prepare("SELECT COUNT(*) as c FROM leads WHERE status IN ('site_genere', 'contacte', 'cloture')").get() as any).c;
    const revenue = (db.prepare("SELECT COALESCE(SUM(amount), 0) as s FROM stripe_events WHERE status = 'paid'").get() as any).s;

    res.json({
      success: true,
      data: {
        totalLeads,
        qualifiedLeads,
        generatedSites,
        revenue
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
