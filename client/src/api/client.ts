import type { BusinessProfile, FeexPayPayment } from '../types';

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

  async updateLead(id: string, updates: Partial<BusinessProfile>): Promise<BusinessProfile> {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
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
  async scrapeMaps(query: string, location: string = 'Bénin', limit: number = 2): Promise<BusinessProfile[]> {
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

  // Cloudflare Pages Anycast Deployment
  async deployCloudflare(leadId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/cloudflare/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  // Cloudflare Custom Domain Binding
  async setCustomDomain(leadId: string, customDomain: string): Promise<any> {
    const res = await fetch(`${API_BASE}/cloudflare/custom-domain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, customDomain })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  // FeexPay (Mobile Money & Cards)
  async createFeexPayPayment(params: {
    amount: number;
    phoneNumber: string;
    network: 'mtn' | 'moov' | 'orange' | 'wave' | 'celtiis' | 'card';
    motif?: string;
    leadId: string;
    leadTitle?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/feexpay/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  async verifyFeexPayPayment(transactionId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/feexpay/verify/${transactionId}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  async getFeexPayHistory(): Promise<FeexPayPayment[]> {
    const res = await fetch(`${API_BASE}/feexpay/history`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  // Generator & React Code Exporter (User's style)
  async getGeneratedSiteData(leadId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/generator/${leadId}/data`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  async getGeneratedSiteCode(leadId: string): Promise<{ code: string; filename: string }> {
    const res = await fetch(`${API_BASE}/generator/${leadId}/code`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  // Settings & DB Status
  async getSettings(): Promise<{ settings: Record<string, string>; dbStatus: any }> {
    const res = await fetch(`${API_BASE}/settings`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return { settings: json.data, dbStatus: json.dbStatus };
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

  // Global Stats
  async getStats(): Promise<{ totalLeads: number; qualifiedLeads: number; generatedSites: number; revenueXof: number; revenueEur: number }> {
    const res = await fetch(`${API_BASE}/stats`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  // Antigravity AI Agents Swarm
  async getAgentsStatus(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/agents/status`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  async getAgentLogs(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/agents/logs`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  async dispatchAgentTask(role: string, payload: any): Promise<any> {
    const res = await fetch(`${API_BASE}/agents/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, payload })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  }
};
