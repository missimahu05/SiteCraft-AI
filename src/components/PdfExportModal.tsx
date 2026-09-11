import { useState } from 'react';
import type { BusinessProfile } from '../types';
import { generateAuditPdf } from '../utils/pdfGenerator';
import { FileDown, Check, FileText, X } from 'lucide-react';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: BusinessProfile[];
}

export const PdfExportModal = ({ isOpen, onClose, leads }: PdfExportModalProps) => {
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [copiedMd, setCopiedMd] = useState(false);

  if (!isOpen) return null;

  const currentLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  const handleDownloadPdf = () => {
    if (currentLead) {
      generateAuditPdf(currentLead);
    }
  };

  const handleCopyMarkdown = () => {
    const md = `# Rapport d'Audit & Stratégie : ${currentLead.title}

- **Catégorie** : ${currentLead.category}
- **Téléphone** : ${currentLead.phone}
- **Adresse** : ${currentLead.address}
- **Note Google Maps** : ${currentLead.rating}/5 (${currentLead.reviewsCount} avis)
- **Score Vision LLM** : ${currentLead.audit?.score_global || '4.5'}/10

## Prototype Généré :
👉 https://${currentLead.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-demo.vercel.app

## Tarification :
Forfait Unique d'Activation : 490 € (sans abonnement).
`;
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Exportation du Dossier Client</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Générez une fiche d'audit et de proposition commerciale prête à être transmise au client ou à vos partenaires.
        </p>

        {/* Lead Selector */}
        <div className="space-y-1 text-xs">
          <label className="text-zinc-400">Choisir le commerce :</label>
          <select
            value={selectedLeadId}
            onChange={(e) => setSelectedLeadId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {leads.map(l => (
              <option key={l.id} value={l.id}>{l.title} ({l.rating}★ - {l.category})</option>
            ))}
          </select>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* PDF */}
          <button
            onClick={handleDownloadPdf}
            className="p-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex flex-col items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
          >
            <FileDown className="w-6 h-6" />
            <span>Télécharger en PDF (Haute fidélité)</span>
          </button>

          {/* Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="p-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex flex-col items-center justify-center gap-2 transition cursor-pointer"
          >
            {copiedMd ? <Check className="w-6 h-6 text-emerald-400" /> : <FileText className="w-6 h-6 text-zinc-300" />}
            <span>{copiedMd ? 'Copié au format MD !' : 'Copier en Markdown'}</span>
          </button>
        </div>

        {/* Note on Pandoc option from spec */}
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-500 font-mono space-y-1">
          <p className="text-zinc-400 font-sans font-semibold">Option CLI (Pandoc) :</p>
          <code>pandoc blueprint.md -o dossier.pdf --pdf-engine=xelatex</code>
        </div>
      </div>
    </div>
  );
};
