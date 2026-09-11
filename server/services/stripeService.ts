import { db } from '../db/database.js';

interface CheckoutParams {
  leadId: string;
  domain?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export async function createStripeSession(params: CheckoutParams) {
  const { leadId, domain = 'commerce-demo.fr' } = params;
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId) as any;
  if (!lead) {
    throw new Error(`Lead ${leadId} introuvable`);
  }

  const stripeKeyRow = db.prepare('SELECT value FROM settings WHERE key = ?').get('STRIPE_SECRET_KEY') as any;
  const stripeSecretKey = stripeKeyRow?.value || process.env.STRIPE_SECRET_KEY;

  if (stripeSecretKey && stripeSecretKey.startsWith('sk_')) {
    try {
      console.log(`[Stripe API] Creating real Checkout Session for ${lead.title} (490 €)...`);
      // Standard Stripe Checkout Session API via fetch
      const body = new URLSearchParams({
        'payment_method_types[0]': 'card',
        'line_items[0][price_data][currency]': 'eur',
        'line_items[0][price_data][product_data][name]': `Activation Site Web Officiel & Domaine — ${lead.title}`,
        'line_items[0][price_data][unit_amount]': '49000', // 490.00 € in cents
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `http://localhost:5173/?claimed=true&lead=${lead.id}`,
        'cancel_url': `http://localhost:5173/`,
        'metadata[lead_id]': lead.id,
        'metadata[domain]': domain
      });

      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      });

      const session = await response.json();
      return { url: session.url, id: session.id, mode: 'stripe_live' };
    } catch (err) {
      console.error('[Stripe API] Error creating Stripe session:', err);
    }
  }

  // Record simulated/test checkout event in SQLite
  const eventId = `evt_${Date.now()}`;
  const now = new Date().toLocaleTimeString('fr-FR');
  
  db.prepare(`
    INSERT INTO stripe_events (
      id, event_type, amount, business_name, domain, status, timestamp, webhook_actions_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    eventId,
    'checkout.session.completed',
    490,
    lead.title,
    domain,
    'paid',
    now,
    JSON.stringify({
      n8nWorkflow: true,
      domainTicket: true,
      twilioSms: true,
      prodTransition: true
    })
  );

  // Mark lead as claimed in DB
  db.prepare(`UPDATE leads SET claimed = 1, status = 'cloture' WHERE id = ?`).run(lead.id);

  return {
    id: eventId,
    amount: 490,
    businessName: lead.title,
    domain,
    status: 'paid',
    mode: 'test_automated'
  };
}
