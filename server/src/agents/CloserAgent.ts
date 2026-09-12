import { AgentActionLog } from './types.js';
import { DataStore } from '../models/dataStore.js';
import { FeexPayService } from '../services/feexpayService.js';

export class CloserAgent {
  static role = 'closer' as const;
  static name = 'CloserAgent';
  static title = 'Négociateur Commercial & Passerelle FeexPay';
  static description = 'Rédige les messages de conversion multicanaux (WhatsApp, SMS, Mail) et gère l\'encaissement Mobile Money 300 000 FCFA.';
  static tools = ['craft_whatsapp_pitch', 'craft_cold_email', 'push_feexpay_ussd', 'listen_feexpay_webhook'];

  static async execute(params: {
    leadId: string;
    action: 'pitch' | 'payment';
    phoneNumber?: string;
    network?: 'mtn' | 'moov' | 'orange' | 'wave' | 'celtiis' | 'card';
    logFn: (log: AgentActionLog) => void;
  }) {
    const { leadId, action, phoneNumber, network = 'mtn', logFn } = params;
    const lead = await DataStore.getLeadById(leadId);
    if (!lead) throw new Error(`Lead ${leadId} introuvable`);

    if (action === 'pitch') {
      logFn({
        id: `log-${Date.now()}-1`,
        agentRole: this.role,
        agentName: this.name,
        timestamp: new Date().toISOString(),
        type: 'thought',
        message: `Rédaction d'une proposition personnalisée pour "${lead.title}". Mise en valeur de ses ${lead.rating}★ Google Maps.`
      });

      const demoUrl = lead.generatedSite?.cloudflareUrl || `https://${lead.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pages.dev`;
      const pitchWhatsapp = `Bonjour ${lead.title},\n\nJ'ai remarqué vos superbes avis sur Google Maps (${lead.rating}★). C'est dommage que vous n'ayez pas encore de vitrine web pour convertir les clients du soir et du weekend.\n\nNous avons conçu un prototype ultra-rapide pour vous : 👉 ${demoUrl}\n\nSi vous souhaitez l'activer avec votre nom de domaine, c'est disponible pour un forfait unique de 300 000 FCFA. Souhaitez-vous en discuter ?`;

      logFn({
        id: `log-${Date.now()}-2`,
        agentRole: this.role,
        agentName: this.name,
        timestamp: new Date().toISOString(),
        type: 'output',
        message: `Argumentaire WhatsApp & SMS prêt à être envoyé au ${lead.phone}.`
      });

      return { pitchWhatsapp };
    }

    if (action === 'payment') {
      logFn({
        id: `log-${Date.now()}-3`,
        agentRole: this.role,
        agentName: this.name,
        timestamp: new Date().toISOString(),
        type: 'thought',
        message: `Déclenchement du paiement FeexPay (300 000 FCFA) sur le réseau ${network.toUpperCase()} pour ${lead.title}.`
      });

      const res = await FeexPayService.createTransaction({
        amount: 300000,
        phoneNumber: phoneNumber || lead.phone || '97000000',
        network,
        motif: `Activation Site Web - ${lead.title}`,
        leadId,
        leadTitle: lead.title
      });

      logFn({
        id: `log-${Date.now()}-4`,
        agentRole: this.role,
        agentName: this.name,
        timestamp: new Date().toISOString(),
        type: 'tool_call',
        message: `push_feexpay_ussd({ network: "${network}", amount: 300000, phone: "${phoneNumber || lead.phone}" })`
      });

      return res;
    }
  }
}
