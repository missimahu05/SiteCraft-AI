export interface GeneratedSectionData {
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    phone: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  trustBar: {
    stats: Array<{ num: string; label: string }>;
  };
  services: Array<{
    num: string;
    title: string;
    desc: string;
    features: string[];
    img: string;
  }>;
  process: Array<{
    num: string;
    title: string;
    desc: string;
  }>;
  whyUs: Array<{
    num: string;
    title: string;
    desc: string;
    badge: string;
  }>;
  reviews: Array<{
    author: string;
    rating: number;
    date: string;
    text: string;
  }>;
  faq: Array<{
    q: string;
    a: string;
  }>;
  contact: {
    address: string;
    phone: string;
    email: string;
    hours: string;
  };
}

export class SiteGeneratorService {
  /**
   * Générer l'architecture de contenu complète basée sur le style `peintre-react`
   */
  static generateSiteData(lead: any): GeneratedSectionData {
    const city = lead.city || 'Bénin';
    const category = lead.category || 'Artisan Qualifié';

    // Tailor services based on category
    let services = [
      {
        num: '01',
        title: 'Prestation Signature Haut de Gamme',
        desc: `Intervention soignée et finitions irréprochables réalisées avec des matériaux certifiés durables et respectueux de votre intérieur à ${city}.`,
        features: ['Diagnostic précis sur site', 'Préparation minutieuse des supports', 'Protection intégrale des lieux'],
        img: lead.photos?.[0] || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800'
      },
      {
        num: '02',
        title: 'Rénovation & Mise en Conformité',
        desc: `Modernisation complète de vos installations selon les normes professionnelles les plus strictes, avec un engagement de résultat garanti.`,
        features: ['Matériaux de premier choix', 'Ponçage & dépoussiérage intégral', 'Garantie décennale incluse'],
        img: lead.photos?.[1] || 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800'
      },
      {
        num: '03',
        title: 'Dépannage & Entretien d\'Urgence',
        desc: `Réactivité maximale en cas de besoin imprévu. Déplacement rapide sous 24h chrono sur l'ensemble du secteur de ${city}.`,
        features: ['Intervention rapide 6j/7', 'Devis gratuit sans engagement', 'Tarifs transparents et fermes'],
        img: lead.photos?.[0] || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800'
      }
    ];

    if (category.toLowerCase().includes('peintre') || category.toLowerCase().includes('peinture')) {
      services = [
        {
          num: '01',
          title: 'Peinture murs & plafonds',
          desc: `Rafraîchissement complet ou rénovation : préparation minutieuse des supports, application en deux couches minimum. Finition mate, satinée ou velours selon la pièce.`,
          features: ['Diagnostic et préparation des supports', 'Peintures acryliques haut de gamme', 'Protection totale du mobilier'],
          img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800'
        },
        {
          num: '02',
          title: 'Boiseries & menuiseries',
          desc: `Portes, plinthes, encadrements, escaliers : traitement adapté avec primaires d'accrochage professionnelles pour un résultat lisse, sans traces et durable.`,
          features: ['Peintures laquées et glycéro pro', 'Ponçage et dépoussiérage intégral', 'Adapté au bois neuf ou rénové'],
          img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800'
        },
        {
          num: '03',
          title: 'Papier peint & revêtements',
          desc: `Pose de papier peint intissé, vinyle, panoramique ou toile de verre. Raccords au millimètre et préparation soignée pour un rendu sans bulles.`,
          features: ['Tous formats et panoramiques', 'Colles adaptées à chaque support', 'Conseils personnalisés'],
          img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800'
        }
      ];
    }

    return {
      hero: {
        badge: `Artisan Professionnel à ${city}`,
        title: lead.title,
        titleAccent: `à ${city}`,
        subtitle: `L'excellence artisanale au service de vos projets. Devis clair et gratuit sous 24h, respect rigoureux des délais et finitions de premier ordre.`,
        phone: lead.phone || '+229 97 00 00 00',
        ctaPrimary: 'Demander un devis gratuit',
        ctaSecondary: 'Découvrir nos réalisations'
      },
      trustBar: {
        stats: [
          { num: '+15', label: "ans d'expertise artisanale" },
          { num: '100%', label: 'Devis gratuit & sans engagement' },
          { num: '24h', label: 'Délai de réponse garanti' },
          { num: `${lead.rating || 4.9}★`, label: `Note moyenne (${lead.reviewsCount || 40}+ avis clients)` }
        ]
      },
      services,
      process: [
        {
          num: '01',
          title: 'Contact & Visite Technique',
          desc: `Vous nous détaillez votre besoin par appel ou formulaire. Nous planifions un diagnostic direct sur site à ${city} pour évaluer les travaux.`
        },
        {
          num: '02',
          title: 'Devis Détaillé & Transparent',
          desc: `Sous 24h à 48h, vous recevez une proposition ferme poste par poste : matériaux, main d'œuvre et délais. Zéro surprise, zéro frais caché.`
        },
        {
          num: '03',
          title: 'Préparation & Protection Intégrale',
          desc: `Le jour convenu, nous isolons et protégeons soigneusement l'espace de travail. Préparation minutieuse des surfaces avant exécution.`
        },
        {
          num: '04',
          title: 'Réalisation & Réception Soignée',
          desc: `Mise en œuvre dans les règles de l'art. Nettoyage méticuleux en fin de chantier et contrôle qualité pièce par pièce avec vous.`
        }
      ],
      whyUs: [
        {
          num: '01',
          title: `Artisan 100% Local à ${city}`,
          desc: `Proximité immédiate, interventions ponctuelles et compréhension fine des exigences locales.`,
          badge: '100% Local'
        },
        {
          num: '02',
          title: 'Matériaux Professionnels Certifiés',
          desc: `Sélection rigoureuse des produits les plus durables et respectueux des normes environnementales.`,
          badge: 'Qualité Pro'
        },
        {
          num: '03',
          title: 'Chantier Impeccable & Protégé',
          desc: `Protection totale de vos biens et restitution des lieux dans un état de propreté absolue.`,
          badge: 'Chantier Propre'
        },
        {
          num: '04',
          title: 'Tarification Claire & Sans Surprise',
          desc: `Le montant convenu sur devis est garanti. Aucun coût supplémentaire imprévu en cours de route.`,
          badge: 'Transparence'
        },
        {
          num: '05',
          title: 'Respect Strict des Engagements',
          desc: `Démarrage et achèvement des travaux selon le calendrier validé ensemble dès le premier jour.`,
          badge: 'Ponctualité'
        },
        {
          num: '06',
          title: 'Garantie & Sérénité Totale',
          desc: `Assurance professionnelle complète et suivi attentif après livraison des travaux.`,
          badge: 'Garantie Pro'
        }
      ],
      reviews: [
        {
          author: 'Moussa K.',
          rating: 5,
          date: 'Il y a 2 semaines',
          text: `Travail d'une précision remarquable ! Le chantier a été rendu d'une propreté exemplaire et le devis a été scrupuleusement respecté. Je recommande vivement.`
        },
        {
          author: 'Aïssatou D.',
          rating: 5,
          date: 'Le mois dernier',
          text: `Très satisfaite de la rénovation. L'artisan est poli, ponctuel et donne d'excellents conseils techniques. Finition impeccable.`
        },
        {
          author: 'Éric T.',
          rating: 5,
          date: 'Il y a 2 mois',
          text: `Devis rapide en moins de 24h, intervention efficace et résultat au-delà de mes attentes. Une vraie équipe de professionnels.`
        }
      ],
      faq: [
        {
          q: `Combien de temps prend l'établissement d'un devis à ${city} ?`,
          a: `Nos devis sont 100% gratuits et établis sous 24 à 48 heures maximum après la prise de contact ou la visite technique.`
        },
        {
          q: 'Fournissez-vous les matériaux ou dois-je les acheter ?',
          a: 'Nous pouvons fournir l\'ensemble des matériaux professionnels de premier choix avec nos tarifs artisans partenaires, ou travailler avec les vôtres selon vos préférences.'
        },
        {
          q: 'Comment protégez-vous mon intérieur pendant les travaux ?',
          a: 'Nous protégeons systématiquement sols, meubles, plinthes et prises avec des bâches étanches et adhésifs professionnels avant d\'entamer le moindre travail.'
        },
        {
          q: 'Quelles sont les garanties sur vos prestations ?',
          a: 'Toutes nos interventions sont couvertes par notre garantie professionnelle et notre engagement de conformité sans réserve.'
        }
      ],
      contact: {
        address: lead.address || `Quartier Central, ${city}`,
        phone: lead.phone || '+229 97 00 00 00',
        email: 'contact@artisan-pro.com',
        hours: 'Lun - Sam : 07h30 - 19h00 (Urgences 24/7)'
      }
    };
  }

  /**
   * Générer le code source React propre au style de l'utilisateur
   */
  static generateReactSourceCode(lead: any): string {
    const data = this.generateSiteData(lead);
    return `// ============================================================================
// Fichier généré automatiquement par SiteCraft-AI Engine
// Style : peintre-react (Architecture modulaire, tokens Navy & Crimson)
// Déploiement : Cloudflare Pages (Anycast Edge, SSL Universal)
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Check, Star, ArrowRight, ShieldCheck, ChevronDown } from 'lucide-react';

export default function GeneratedWebsite() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F2EE] text-[#2D3553] font-sans selection:bg-[#C41641] selection:text-white">
      {/* 1. HEADER */}
      <header className={\`fixed top-0 left-0 right-0 z-50 transition-all duration-300 \${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
      }\`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1A2550] flex items-center justify-center text-white font-outfit font-black tracking-wider shadow-md">
              ${lead.title.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#C41641] font-bold block uppercase">
                ${data.hero.badge}
              </span>
              <span className="text-base font-outfit font-black tracking-tight text-[#1A2550] uppercase">
                ${lead.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="tel:${data.hero.phone}" className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-[#1A2550] bg-white px-3.5 py-2 rounded-full border border-[#E0E3EF]">
              <Phone className="w-3.5 h-3.5 text-[#C41641]" />
              ${data.hero.phone}
            </a>
            <a href="#contact" className="px-5 py-2.5 rounded-full bg-[#C41641] hover:bg-[#A01235] text-white text-xs font-outfit font-black uppercase tracking-wider transition shadow-lg shadow-[#C41641]/20">
              Devis Gratuit
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF1F3] border border-[#C41641]/20 text-[#C41641] text-xs font-mono font-bold">
            <span>✦</span> <span>${data.hero.badge}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-outfit font-black italic tracking-tighter uppercase text-[#1A2550] leading-[1.05]">
            ${lead.title} <span className="text-[#C41641]">${data.hero.titleAccent}</span>
          </h1>
          <p className="text-base sm:text-lg text-[#6B7299] leading-relaxed max-w-2xl">
            ${data.hero.subtitle}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#contact" className="px-7 py-3.5 rounded-2xl bg-[#C41641] text-white font-outfit font-black uppercase text-xs tracking-wider shadow-xl shadow-[#C41641]/25 hover:scale-105 transition">
              ${data.hero.ctaPrimary}
            </a>
            <a href="#services" className="px-7 py-3.5 rounded-2xl bg-white border border-[#1A2550] text-[#1A2550] font-outfit font-bold uppercase text-xs tracking-wider hover:bg-[#F4F2EE] transition">
              ${data.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* 3. TRUST BAR */}
      <section className="py-8 bg-white border-y border-[#E0E3EF]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          ${data.trustBar.stats.map(s => `
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-outfit font-black italic tracking-tight text-[#C41641]">${s.num}</div>
            <div className="text-xs text-[#6B7299] font-medium">${s.label}</div>
          </div>`).join('')}
        </div>
      </section>

      {/* 4. SERVICES */}
      <section id="services" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-[#C41641] font-bold">Nos Prestations</p>
          <h2 className="text-3xl sm:text-4xl font-outfit font-black italic uppercase text-[#1A2550]">
            Savoir-faire & <span className="text-[#C41641]">Excellence</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          ${data.services.map(s => `
          <div className="bg-white rounded-3xl p-6 border border-[#E0E3EF] shadow-sm space-y-4 hover:-translate-y-1 transition">
            <div className="text-xs font-mono font-bold text-[#C41641]">${s.num}</div>
            <h3 className="text-lg font-outfit font-black uppercase text-[#1A2550]">${s.title}</h3>
            <p className="text-xs text-[#6B7299] leading-relaxed">${s.desc}</p>
            <ul className="space-y-2 pt-2 border-t border-[#F0F1F5] text-xs text-[#2D3553]">
              ${s.features.map(f => `<li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C41641]" /> ${f}</li>`).join('')}
            </ul>
          </div>`).join('')}
        </div>
      </section>

      {/* 5. PROCESS */}
      <section className="py-20 bg-[#FAF9F6] border-y border-[#E0E3EF]">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-[#C41641] font-bold">Méthodologie</p>
            <h2 className="text-3xl sm:text-4xl font-outfit font-black italic uppercase text-[#1A2550]">
              4 étapes claires, <span className="text-[#C41641]">Zéro surprise</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            ${data.process.map(p => `
            <div className="bg-white p-6 rounded-2xl border border-[#E0E3EF] space-y-3">
              <span className="text-2xl font-outfit font-black text-[#C41641]">${p.num}</span>
              <h4 className="font-outfit font-bold uppercase text-xs text-[#1A2550]">${p.title}</h4>
              <p className="text-[11px] text-[#6B7299] leading-relaxed">${p.desc}</p>
            </div>`).join('')}
          </div>
        </div>
      </section>

      {/* 6. REVIEWS */}
      <section className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-[#C41641] font-bold">Témoignages</p>
          <h2 className="text-3xl sm:text-4xl font-outfit font-black italic uppercase text-[#1A2550]">
            Avis vérifiés <span className="text-[#C41641]">Clients</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          ${data.reviews.map(r => `
          <div className="bg-white p-6 rounded-3xl border border-[#E0E3EF] shadow-sm space-y-4">
            <div className="flex text-[#FBBF24]">★★★★★</div>
            <p className="text-xs text-[#2D3553] italic leading-relaxed">"${r.text}"</p>
            <div className="pt-2 border-t border-[#F0F1F5] flex justify-between items-center text-[11px]">
              <span className="font-bold text-[#1A2550]">${r.author}</span>
              <span className="text-[#6B7299] font-mono">${r.date}</span>
            </div>
          </div>`).join('')}
        </div>
      </section>

      {/* 7. CONTACT & FOOTER */}
      <footer id="contact" className="bg-[#1A2550] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-outfit font-black uppercase tracking-tight">
              Prêt à concrétiser votre <span className="text-[#C41641]">Projet</span> ?
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-md">
              Contactez-nous directement par téléphone ou laissez-nous un message. Réponse et devis garantis sous 24h.
            </p>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-[#C41641]" /> ${data.contact.address}</div>
              <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#C41641]" /> ${data.contact.phone}</div>
              <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-[#C41641]" /> ${data.contact.hours}</div>
            </div>
          </div>

          <div className="bg-white text-[#2D3553] p-7 rounded-3xl shadow-xl space-y-4">
            <h4 className="font-outfit font-black uppercase text-sm text-[#1A2550]">Demande Express de Devis</h4>
            <input type="text" placeholder="Votre Nom complet" className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-xs" />
            <input type="tel" placeholder="Votre Numéro de téléphone" className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-xs" />
            <textarea placeholder="Description de votre besoin..." rows={3} className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-xs"></textarea>
            <button className="w-full py-3 rounded-xl bg-[#C41641] text-white font-outfit font-black uppercase text-xs tracking-wider">
              Envoyer ma demande
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
`;
  }
}
