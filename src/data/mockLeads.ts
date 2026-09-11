import type { BusinessProfile } from '../types';

export const initialLeads: BusinessProfile[] = [
  {
    id: 'lead-1',
    title: 'Boulangerie Artisanale Le Pain Doré',
    rating: 4.8,
    reviewsCount: 84,
    category: 'Boulangerie-Pâtisserie',
    phone: '01 43 28 92 10',
    address: '42 Rue de la Roquette, 75011 Paris',
    website: null, // Opportunité Création
    photos: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'Pains au levain naturel cuits sur pierre, viennoiseries 100% pur beurre et pâtisseries fines.',
    description: 'Depuis 2012, notre atelier artisanal perpétue le savoir-faire de la tradition française avec des farines biologiques locales et une fermentation lente de 24h.',
    openingHours: [
      'Lundi - Vendredi : 06h30 - 20h00',
      'Samedi : 07h00 - 20h00',
      'Dimanche : 07h00 - 13h30'
    ],
    services: [
      { name: 'Baguette Tradition Label Rouge', description: 'Farine T65 sans additif, mie alvéolée et croûte croustillante', price: '1,40 €', badge: 'Best-Seller' },
      { name: 'Pain de Campagne au Levain', description: 'Fermentation lente, se conserve 5 jours', price: '4,50 €' },
      { name: 'Croissant Feuilleté Pur Beurre AOP', description: 'Beurre Charentes-Poitou AOP, tourage traditionnel', price: '1,60 €' },
      { name: 'Tartelette Citron Meringuée', description: 'Crémeux citron de Sicile et meringue italienne dorée', price: '4,20 €' }
    ],
    topReviews: [
      { author: 'Camille R.', rating: 5, text: 'La meilleure tradition du 11ème sans hésitation ! Les croissants sont divins.', date: 'Il y a 3 jours' },
      { author: 'Marc L.', rating: 5, text: 'Pain au levain exceptionnel qui se conserve parfaitement. Équipe très souriante.', date: 'Il y a 1 semaine' },
      { author: 'Sophie D.', rating: 4.5, text: 'Pâtisseries délicieuses et pas trop sucrées. Pensez à commander pour le dimanche !', date: 'Il y a 2 semaines' }
    ],
    status: 'opportunite_creation'
  },
  {
    id: 'lead-2',
    title: 'Garage Automobile Saint-Michel',
    rating: 4.6,
    reviewsCount: 112,
    category: 'Mécanique & Carrosserie',
    phone: '04 72 34 81 90',
    address: '18 Avenue Berthelot, 69007 Lyon',
    website: 'http://garage-st-michel-lyon.pagesperso-orange.fr', // Site obsolète
    photos: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'Entretien multimarque, révision constructeur certifiée et diagnostic électronique de pointe.',
    description: 'Garage indépendant depuis plus de 25 ans. Devis transparents sans surprise, pièces d’origine garanties et véhicule de courtoisie gratuit.',
    openingHours: [
      'Lundi - Vendredi : 08h00 - 12h00 / 14h00 - 18h30',
      'Samedi & Dimanche : Fermé'
    ],
    services: [
      { name: 'Révision Complète avec Garantie', description: 'Vidange huile synthétique, filtres et 45 points de contrôle', price: 'Dès 129 €', badge: 'Populaire' },
      { name: 'Diagnostic Électronique OBD', description: 'Recherche de pannes, voyants moteur et mise à jour calculateurs', price: '49 €' },
      { name: 'Freinage & Pneumatiques', description: 'Disques, plaquettes, équilibrage et géométrie 3D', price: 'Sur devis' }
    ],
    topReviews: [
      { author: 'David B.', rating: 5, text: 'Honnête, rapide et efficace. Facture conforme au devis initial, ça fait plaisir !', date: 'Il y a 5 jours' },
      { author: 'Julien M.', rating: 5, text: 'Voiture de prêt propre et réparation effectuée dans la journée.', date: 'Il y a 2 semaines' }
    ],
    status: 'opportunite_refonte',
    audit: {
      score_global: 4.2,
      criteres: {
        modernite: 3.5,
        lisibilite: 4.0,
        cta: 4.5,
        visuels: 4.8
      },
      defauts_majeurs: [
        'Site non responsive (inutilisable sur smartphone sans zoomer)',
        'Numéro de téléphone non cliquable en direct',
        'Design hébergé sur pagesperso obsolète depuis les années 2000',
        'Aucune mention des avis clients certifiés ni galerie de photos récentes'
      ],
      eligible_refonte: true,
      auditDate: '2026-09-11'
    }
  },
  {
    id: 'lead-3',
    title: 'L\'Atelier Coiffure & Barbier',
    rating: 4.9,
    reviewsCount: 67,
    category: 'Salon de Coiffure & Barbier',
    phone: '04 91 55 20 40',
    address: '14 Rue Paradis, 13001 Marseille',
    website: 'http://atelier-barbier13.e-monsite.com',
    photos: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'Coupes modernes, rasage traditionnel au coupe-chou et soins de barbe sur-mesure.',
    description: 'Une ambiance feutrée inspirée des barbershops traditionnels, accompagnée d’un café expresso et de conseils personnalisés.',
    openingHours: [
      'Mardi - Samedi : 09h30 - 19h30',
      'Dimanche & Lundi : Fermé'
    ],
    services: [
      { name: 'Coupe Homme & Coiffage', description: 'Dégradé américain aux ciseaux et tondeuse, finition au rasoir', price: '28 €', badge: 'Top Service' },
      { name: 'Taille de Barbe Traditionnelle', description: 'Serviette chaude, huile essentielle et contour au coupe-chou', price: '22 €' },
      { name: 'Formule VIP Complète', description: 'Coupe + Barbe complète + Soin visage purifiant', price: '45 €' }
    ],
    topReviews: [
      { author: 'Karim S.', rating: 5, text: 'Ambiance au top, coiffeurs super pros et précis. Je ne vais plus que là-bas !', date: 'Il y a 1 jour' },
      { author: 'Thomas V.', rating: 5, text: 'Le rasage à l\'ancienne avec la serviette chaude est un vrai moment de détente.', date: 'Il y a 4 jours' }
    ],
    status: 'opportunite_refonte',
    audit: {
      score_global: 5.1,
      criteres: {
        modernite: 4.8,
        lisibilite: 5.2,
        cta: 5.0,
        visuels: 5.4
      },
      defauts_majeurs: [
        'Bannières publicitaires parasites de la plateforme gratuite e-monsite',
        'Temps de chargement supérieur à 4.8 secondes',
        'Absence de système de réservation rapide ou d’appel direct'
      ],
      eligible_refonte: true,
      auditDate: '2026-09-11'
    }
  },
  {
    id: 'lead-4',
    title: 'Dr. Élodie Martin - Cabinet Dentaire',
    rating: 4.7,
    reviewsCount: 95,
    category: 'Cabinet Dentaire',
    phone: '05 56 78 34 12',
    address: '22 Cours de l\'Intendance, 33000 Bordeaux',
    website: null, // Pas de site
    photos: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'Soins préventifs, esthétique dentaire et implantologie dans un cadre moderne et apaisant.',
    description: 'Cabinet équipé des dernières technologies d’imagerie 3D et d’anesthésie indolore pour une prise en charge tout en douceur.',
    openingHours: [
      'Lundi - Vendredi : 08h30 - 19h00',
      'Samedi : Sur rendez-vous d\'urgence'
    ],
    services: [
      { name: 'Bilan Bucco-Dentaire & Détartrage', description: 'Nettoyage par ultrasons et polissage des taches', price: 'Conventionné Secteur 1' },
      { name: 'Éclaircissement Dentaire Professionnel', description: 'Gouttières thermoformées sur mesure au fauteuil', price: 'Dès 350 €' },
      { name: 'Implantologie & Prothèses Céramiques', description: 'Planification par scanner cône-beam 3D haute résolution', price: 'Sur devis' }
    ],
    topReviews: [
      { author: 'Claire P.', rating: 5, text: 'Très à l\'écoute pour les personnes phobiques du dentiste comme moi. Zéro douleur.', date: 'Il y a 6 jours' }
    ],
    status: 'opportunite_creation'
  }
];
