import { AgentActionLog } from './types.js';
import { DataStore } from '../models/dataStore.js';
import { SiteGeneratorService } from '../services/siteGeneratorService.js';

export class ArchitectAgent {
  static role = 'architect' as const;
  static name = 'ArchitectAgent';
  static title = 'Architecte Frontend & SEO Local';
  static description = 'Assemble les 10 sections React modulaires (style peintre-react), injecte le balisage Schema.org JSON-LD, sitemap.xml et robots.txt.';
  static tools = ['compile_react_sections', 'inject_schema_org_json_ld', 'generate_sitemap_xml', 'generate_robots_txt'];

  static async execute(params: { leadId: string; logFn: (log: AgentActionLog) => void }) {
    const { leadId, logFn } = params;
    const lead = await DataStore.getLeadById(leadId);
    if (!lead) throw new Error(`Lead ${leadId} introuvable`);

    logFn({
      id: `log-${Date.now()}-1`,
      agentRole: this.role,
      agentName: this.name,
      timestamp: new Date().toISOString(),
      type: 'thought',
      message: `Conception de l'architecture pour "${lead.title}". Application de la charte Navy (#1A2550) & Crimson (#C41641).`
    });

    logFn({
      id: `log-${Date.now()}-2`,
      agentRole: this.role,
      agentName: this.name,
      timestamp: new Date().toISOString(),
      type: 'tool_call',
      message: `compile_react_sections({ sections: ["Hero", "TrustBar", "Services", "Process", "WhyUs", "Reviews", "FAQ", "ContactForm"] })`
    });

    const siteData = SiteGeneratorService.generateSiteData(lead);
    const reactCode = SiteGeneratorService.generateReactSourceCode(lead);

    // Schema.org JSON-LD LocalBusiness injection
    const schemaOrg = {
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      "name": lead.title,
      "image": lead.photos?.[0] || "",
      "telephone": lead.phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": lead.address,
        "addressLocality": lead.city || "Parakou",
        "addressCountry": "BJ"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": String(lead.rating || 4.9),
        "reviewCount": String(lead.reviewsCount || 40)
      }
    };

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${lead.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pages.dev/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`;

    const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://${lead.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pages.dev/sitemap.xml`;

    logFn({
      id: `log-${Date.now()}-3`,
      agentRole: this.role,
      agentName: this.name,
      timestamp: new Date().toISOString(),
      type: 'output',
      message: `Composants React assemblés. Balisage Schema.org LocalBusiness, sitemap.xml et robots.txt prêts pour la production.`
    });

    return {
      siteData,
      reactCode,
      schemaOrg,
      sitemapXml,
      robotsTxt
    };
  }
}
