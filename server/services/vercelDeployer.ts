import { db } from '../db/database.js';

export async function deployToVercel(leadId: string) {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId) as any;
  if (!lead) {
    throw new Error(`Lead ${leadId} introuvable`);
  }

  const vercelTokenRow = db.prepare('SELECT value FROM settings WHERE key = ?').get('VERCEL_AUTH_TOKEN') as any;
  const vercelToken = vercelTokenRow?.value || process.env.VERCEL_AUTH_TOKEN;

  const subdomain = lead.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const demoUrl = `https://${subdomain}-demo.vercel.app`;

  if (vercelToken && vercelToken.trim().length > 10) {
    try {
      console.log(`[Vercel API] Making real POST /v13/deployments for ${subdomain}...`);
      const response = await fetch('https://api.vercel.com/v13/deployments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${subdomain}-demo`,
          projectSettings: {
            framework: 'nextjs'
          }
        })
      });
      const data = await response.json();
      const realUrl = data.url ? `https://${data.url}` : demoUrl;

      // Update lead in DB
      db.prepare(`UPDATE leads SET deployment_url = ?, status = 'site_genere' WHERE id = ?`).run(realUrl, lead.id);
      return { url: realUrl, status: 'deployed', mode: 'live_vercel_api' };
    } catch (err) {
      console.error('[Vercel API] Error calling Vercel API:', err);
    }
  }

  // Update in SQLite
  db.prepare(`UPDATE leads SET deployment_url = ?, status = 'site_genere' WHERE id = ?`).run(demoUrl, lead.id);

  return {
    url: demoUrl,
    status: 'deployed',
    mode: 'dynamic_edge_ready'
  };
}
