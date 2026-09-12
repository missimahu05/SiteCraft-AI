import { AgentActionLog } from './types.js';
import { CloudflareService } from '../services/cloudflareService.js';

export class DevOpsAgent {
  static role = 'devops' as const;
  static name = 'DevOpsAgent';
  static title = 'Ingénieur Cloudflare Edge & Anycast CDN';
  static description = 'Pilote l\'API Cloudflare Pages, déploie sur 330+ datacenters Anycast, émet les certificats SSL et route les domaines.';
  static tools = ['create_cloudflare_pages_project', 'deploy_anycast_edge', 'provision_tls_ssl', 'bind_custom_domain_cname'];

  static async execute(params: { leadId: string; customDomain?: string; logFn: (log: AgentActionLog) => void }) {
    const { leadId, customDomain, logFn } = params;

    logFn({
      id: `log-${Date.now()}-1`,
      agentRole: this.role,
      agentName: this.name,
      timestamp: new Date().toISOString(),
      type: 'thought',
      message: `Initialisation du pipeline de distribution Cloudflare Pages pour le lead #${leadId}...`
    });

    logFn({
      id: `log-${Date.now()}-2`,
      agentRole: this.role,
      agentName: this.name,
      timestamp: new Date().toISOString(),
      type: 'tool_call',
      message: `deploy_anycast_edge({ leadId: "${leadId}", edgePoPs: 330, ssl: "Universal TLS 1.3" })`
    });

    const deployResult = await CloudflareService.deploySite(leadId);

    if (customDomain) {
      await CloudflareService.attachCustomDomain(leadId, customDomain);
      logFn({
        id: `log-${Date.now()}-3`,
        agentRole: this.role,
        agentName: this.name,
        timestamp: new Date().toISOString(),
        type: 'tool_call',
        message: `bind_custom_domain_cname({ domain: "${customDomain}", target: "${deployResult.slug}.pages.dev" })`
      });
    }

    logFn({
      id: `log-${Date.now()}-4`,
      agentRole: this.role,
      agentName: this.name,
      timestamp: new Date().toISOString(),
      type: 'output',
      message: `Déploiement en ligne disponible sur ${deployResult.url} (Anycast Edge actif).`
    });

    return deployResult;
  }
}
