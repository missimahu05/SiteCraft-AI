# Architecture Technique & Stratégie Opérationnelle : Agence Web IA Autonome

## Sommaire
1. Vision Globale & Architecture Système
2. Phase 1 : Scraping, Détection & Qualification Google Maps
3. Phase 2 : Audit Multimodal & Vision LLM Scoring
4. Phase 3 : Génération Frontend Autonome & Déploiement Vercel
5. Phase 4 : Mockup Automation & Prospection Multicanal
6. Phase 5 : Interface de Révision Client & Boucle Stripe
7. Fiche Pratique : Exportation au format PDF

---

## 1. Vision Globale & Architecture Système
Le système repose sur un orchestrateur asynchrone reliant 5 micro-services découplés :
```
┌─────────────────────────┐
│ Google Maps Discovery   │ ◄── Scrape Apify / Places API (catégories, avis, photos, tel)
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Qualification & Vision  │ ◄── Playwright (Screenshots) + GPT-4o / Claude 3.5 Sonnet
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Frontend Auto-Generator │ ◄── Ingestion JSON -> Next.js / Tailwind CSS Template
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Déploiement Dynamique   │ ◄── Vercel API / Cloudflare Pages (Sous-domaine éphémère)
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Outreach & Closing      │ ◄── Mockup Snapshot + Resend / Instantly + Stripe Checkout
└─────────────────────────┘
```

---

## 2. Phase 1 : Scraping, Détection & Qualification Google Maps
### 2.1 Critères d'Éligibilité d'un Prospect
* **Volume d'avis Google** : $\ge 15$ avis récents (activité économique prouvée).
* **Note moyenne** : $\ge 3.8 / 5.0$ (réputation saine, gérant sensible à son image de marque).
* **Typologie d'établissement** :
  * **Opportunité Création** : Absence de lien URL dans la fiche Google Maps.
  * **Opportunité Refonte** : Présence d'un site web dont l'audit technique/visuel est défavorable.

---

## 3. Phase 2 : Audit Multimodal & Vision LLM Scoring
* Capture Viewport 1440x900 via Playwright.
* Notation sur 4 critères : `modernite_visuelle`, `lisibilite_mobile_apparente`, `clarte_cta`, `mise_en_valeur_produits`.
* **Règle de filtrage** : Si `score_global < 6.5` ou `eligible_refonte == true`, passage automatique en reconstruction frontend.

---

## 4. Phase 3 : Génération Frontend Autonome & Déploiement Vercel
* Ingestion du profil JSON dans les composants `HeroSection.tsx`, `ClaimBanner.tsx`, `ServicesSection`, etc.
* Déploiement dynamique via l'API Vercel (`https://api.vercel.com/v13/deployments`).

---

## 5. Phase 4 : Mockup Automation & Prospection Multicanal
* Gabarit visuel interactif Avant / Après.
* Modèle d'emailing froid ultra-personnalisé avec lien de démo et forfait unique 490 €.

---

## 6. Phase 5 : Interface de Révision Client & Boucle Stripe
* Bandeau `ClaimBanner` interactif.
* Traitement automatisé de l'événement webhook `checkout.session.completed` (workflow n8n, transfert de domaine, SMS Twilio).

---

## 7. Commandes Utiles
* Lancer le projet en local : `npm run dev`
* Compiler pour production : `npm run build`
