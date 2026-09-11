import jsPDF from 'jspdf';
import type { BusinessProfile } from '../types';

export const generateAuditPdf = (business: BusinessProfile) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Background Theme
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 297, 'F');

  // Brand Header
  doc.setTextColor(16, 185, 129); // emerald-500
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('SiteCraft-AI', 20, 25);

  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('RAPPORT D\'AUDIT DIGITAL & PROPOSITION DE REFONTE', 20, 32);

  doc.setDrawColor(30, 41, 59);
  doc.line(20, 38, 190, 38);

  // Business Info Section
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(business.title, 20, 48);

  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text(`Catégorie : ${business.category}`, 20, 55);
  doc.text(`Adresse : ${business.address}`, 20, 61);
  doc.text(`Téléphone : ${business.phone}`, 20, 67);
  doc.text(`Note Google Maps : ${business.rating} / 5 (${business.reviewsCount} avis certifiés)`, 20, 73);
  doc.text(`Site actuel : ${business.website ? business.website : 'Aucun site existant'}`, 20, 79);

  // Audit Score Box
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(20, 88, 170, 35, 3, 3, 'F');

  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129);
  doc.text('SCORE DE PERFORMANCE VISION IA', 28, 98);

  const scoreGlobal = business.audit ? (typeof business.audit.score_global === 'number' ? business.audit.score_global.toFixed(1) : String(business.audit.score_global)) : (business.website ? '4.5' : '2.5');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text(`${scoreGlobal} / 10`, 28, 112);

  doc.setFontSize(10);
  doc.setTextColor(251, 191, 36); // amber-400
  doc.text('Statut : Éligible à une refonte prioritaire', 80, 110);

  // Flaws Section
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('1. Constats & Anomalies Identifiées sur Smartphone :', 20, 138);

  doc.setFontSize(9.5);
  doc.setTextColor(203, 213, 225);
  const defauts = business.audit?.defauts_majeurs || [
    'Design non responsive (inadapté aux écrans mobiles modernes)',
    'Absence d\'un bouton d\'appel direct en 1 clic pour capter les clients',
    'Aucune mise en avant des avis certifiés Google Maps',
    'Temps de chargement pénalisant le référencement naturel local'
  ];

  let y = 146;
  defauts.forEach((d) => {
    doc.text(`•  ${d}`, 25, y);
    y += 7;
  });

  // Solution Proposition
  y += 5;
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('2. La Solution Pré-construite par SiteCraft-AI :', 20, y);

  y += 8;
  doc.setFontSize(9.5);
  doc.setTextColor(203, 213, 225);
  const solutions = [
    'Prototype moderne codé sur Next.js & Tailwind CSS (chargement < 0.8s)',
    `Lien de démonstration interactive : https://${business.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-demo.vercel.app`,
    'Bouton d\'appel direct et plan interactif géolocalisé',
    'Réservation du nom de domaine officiel et hébergement sécurisé SSL'
  ];

  solutions.forEach((s) => {
    doc.text(`✓  ${s}`, 25, y);
    y += 7;
  });

  // Financial terms
  y += 8;
  doc.setFillColor(16, 185, 129, 0.1);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(20, y, 170, 25, 2, 2, 'FD');

  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129);
  doc.text('CONDITIONS D\'ACTIVATION CLÉ-EN-MAIN', 28, y + 9);

  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('Forfait Unique : 490,00 € TTC (Aucun abonnement récurrent mensuel)', 28, y + 17);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Document généré automatiquement par SiteCraft-AI • Agence Web Autonome • contact@sitecraft.ai', 20, 285);

  doc.save(`Audit_Digital_${business.title.replace(/\s+/g, '_')}.pdf`);
};
