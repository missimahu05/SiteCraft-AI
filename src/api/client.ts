import type { BusinessProfile, StripeEvent } from '../types';

const API_BASE = '/api';

export const api = {
  // Leads
  async getLeads(): Promise<BusinessProfile[]> {
    const res = await fetch(`${API_BASE}/leads`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  async createLead(lead: Partial<BusinessProfile>): Promise<BusinessProfile> {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  async deleteLead(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/leads/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
  },

  // Scraper Google Maps
  async scrapeMaps(query: string, location: string = 'Paris', limit: number = 2): Promise<BusinessProfile[]> {
    const res = await fetch(`${API_BASE}/scrape/maps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, location, limit })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  // Vision LLM Audit
  async runAudit(leadId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/audit/vision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  // Vercel Deployment
  async deployVercel(leadId: string): Promise<{ url: string; status: string; mode: string }> {
    const res = await fetch(`${API_BASE}/deploy/vercel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  // Stripe Checkout
  async checkoutStripe(leadId: string, domain: string): Promise<any> {
    const res = await fetch(`${API_BASE}/stripe/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, domain })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  async getStripeEvents(): Promise<StripeEvent[]> {
    const res = await fetch(`${API_BASE}/stripe/events`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  // Settings
  async getSettings(): Promise<Record<string, string>> {
    const res = await fetch(`${API_BASE}/settings`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  async updateSetting(key: string, value: string): Promise<void> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
  },

  // Stats
  async getStats(): Promise<{ totalLeads: number; qualifiedLeads: number; generatedSites: number; revenue: number }> {
    const res = await fetch(`${API_BASE}/stats`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  }
};
