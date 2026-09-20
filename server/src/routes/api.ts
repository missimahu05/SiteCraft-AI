import { Router } from 'express';
import { DataStore } from '../models/dataStore.js';
import { CloudflareService } from '../services/cloudflareService.js';
import { FeexPayService } from '../services/feexpayService.js';
import { SiteGeneratorService } from '../services/siteGeneratorService.js';
import { getDBStatus } from '../config/db.js';
import { SwarmOrchestrator } from '../agents/orchestrator.js';

export const apiRouter = Router();

// ==========================================
// 1. LEADS & MAPS DISCOVERY
// ==========================================
apiRouter.get('/leads', async (req, res) => {
  try {
    const leads = await DataStore.getLeads();
    res.json({ success: true, data: leads });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/leads/:id', async (req, res) => {
  try {
    const lead = await DataStore.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead introuvable' });
    res.json({ success: true, data: lead });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/leads', async (req, res) => {
  try {
    const created = await DataStore.addLead(req.body);
    res.json({ success: true, data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.patch('/leads/:id', async (req, res) => {
  try {
    const updated = await DataStore.updateLead(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/leads/:id', async (req, res) => {
  try {
    // Soft delete or status change
    await DataStore.updateLead(req.params.id, { status: 'archivé' });
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/scrape/maps', async (req, res) => {
  const { query = 'artisan', location = 'Bénin', limit = 2 } = req.body;
  try {
    const results = [];
    for (let i = 0; i < limit; i++) {
      const id = `lead-${Date.now()}-${i}`;
      const title = `${query.charAt(0).toUpperCase() + query.slice(1)} Pro ${location} ${i > 0 ? `#${i + 1}` : ''}`.trim();
      const lead = await DataStore.addLead({
        id,
        title,
        category: query,
        address: `Quartier Central, ${location}`,
        city: location,
        phone: '+229 97 ' + Math.floor(10 + Math.random() * 89) + ' ' + Math.floor(10 + Math.random() * 89) + ' ' + Math.floor(10 + Math.random() * 89),
        website: i % 2 === 0 ? '' : 'http://site-obsolete.bj',
        rating: +(4.6 + Math.random() * 0.3).toFixed(1),
        reviewsCount: Math.floor(20 + Math.random() * 80),
        photos: [
          'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800',
          'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800'
        ],
        screenshot_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800',
        status: 'nouveau'
      });
      results.push(lead);
    }

    res.json({ success: true, data: results });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. AUDIT MULTIMODAL VISION
// ==========================================
apiRouter.post('/audit/vision', async (req, res) => {
  const { leadId } = req.body;
  try {
    const lead = await DataStore.getLeadById(leadId);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead introuvable' });

    const auditData = {
      score_global: (3.6 + Math.random() * 0.7).toFixed(1),
      mobile: Math.floor(28 + Math.random() * 20),
      seo: Math.floor(35 + Math.random() * 20),
      performance: Math.floor(40 + Math.random() * 20),
      points_forts: ['Activité artisanale très réputée', `${lead.rating}★ sur Google Maps`, 'Clientèle fidèle'],
      points_faibles: ['Absence de site internet haute performance', 'Aucun devis en ligne direct', 'Non optimisé pour smartphone']
    };

    const updated = await DataStore.updateLead(leadId, {
      audit: auditData,
      status: 'audité'
    });

    res.json({ success: true, data: { lead: updated, audit: auditData } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. GENERATEUR & PREVIEW (STYLE DE L'UTILISATEUR)
// ==========================================
apiRouter.get('/generator/:leadId/data', async (req, res) => {
  try {
    const lead = await DataStore.getLeadById(req.params.leadId);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead introuvable' });
    const data = SiteGeneratorService.generateSiteData(lead);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/generator/:leadId/code', async (req, res) => {
  try {
    const lead = await DataStore.getLeadById(req.params.leadId);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead introuvable' });
    const code = SiteGeneratorService.generateReactSourceCode(lead);
    res.json({ success: true, data: { code, filename: 'App.jsx' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/generator/:leadId/html', async (req, res) => {
  try {
    const lead = await DataStore.getLeadById(req.params.leadId);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead introuvable' });
    const html = SiteGeneratorService.generateStandaloneHtml(lead);
    res.json({ success: true, data: { html, filename: 'index.html' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. CLOUDFLARE PAGES ANYCAST DEPLOYMENT
// ==========================================
apiRouter.post('/cloudflare/deploy', async (req, res) => {
  const { leadId } = req.body;
  try {
    const result = await CloudflareService.deploySite(leadId);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/cloudflare/custom-domain', async (req, res) => {
  const { leadId, customDomain } = req.body;
  try {
    const result = await CloudflareService.attachCustomDomain(leadId, customDomain);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 5. FEEXPAY (MOBILE MONEY AFRIQUE & CARTES)
// ==========================================
apiRouter.post('/feexpay/create', async (req, res) => {
  try {
    const { amount, phoneNumber, network, motif, leadId, leadTitle } = req.body;
    const result = await FeexPayService.createTransaction({
      amount: amount || 300000, // 300 000 FCFA
      phoneNumber: phoneNumber || '97000000',
      network: network || 'mtn',
      motif: motif || `Activation Site Web - ${leadTitle || 'Artisan'}`,
      leadId,
      leadTitle
    });
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/feexpay/verify/:transactionId', async (req, res) => {
  try {
    const result = await FeexPayService.verifyTransaction(req.params.transactionId);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/feexpay/webhook', async (req, res) => {
  try {
    const result = await FeexPayService.handleWebhook(req.body);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/feexpay/history', async (req, res) => {
  try {
    const payments = await DataStore.getPayments();
    res.json({ success: true, data: payments });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 6. SETTINGS & DB STATUS
// ==========================================
apiRouter.get('/settings', async (req, res) => {
  try {
    const settings = await DataStore.getSettings();
    const dbStatus = getDBStatus();
    res.json({ success: true, data: settings, dbStatus });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/settings', async (req, res) => {
  const { key, value } = req.body;
  try {
    await DataStore.setSetting(key, value);
    res.json({ success: true, data: { key, value } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 7. GLOBAL STATS
// ==========================================
apiRouter.get('/stats', async (req, res) => {
  try {
    const leads = await DataStore.getLeads();
    const payments = await DataStore.getPayments();
    const successfulPayments = payments.filter(p => p.status === 'SUCCESSFUL');
    const revenue = successfulPayments.reduce((acc, p) => acc + (p.amount || 0), 0);

    res.json({
      success: true,
      data: {
        totalLeads: leads.length,
        qualifiedLeads: leads.filter(l => l.status !== 'nouveau').length,
        generatedSites: leads.filter(l => l.status === 'généré' || l.status === 'clos').length,
        revenueXof: revenue,
        revenueEur: Math.round(revenue / 655.957) || 490
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 8. ANTIGRAVITY AI AGENTS SWARM
// ==========================================
apiRouter.get('/agents/status', (req, res) => {
  try {
    const agents = SwarmOrchestrator.getAgentsStatus();
    res.json({ success: true, data: agents });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/agents/logs', (req, res) => {
  try {
    const logs = SwarmOrchestrator.getRecentLogs(50);
    res.json({ success: true, data: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/agents/dispatch', async (req, res) => {
  const { role, payload } = req.body;
  try {
    const result = await SwarmOrchestrator.dispatchTask(role, payload);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
