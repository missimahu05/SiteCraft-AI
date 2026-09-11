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
    <div className="fixed inset-0 z-50 bg-[#0F163A]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-[#E0E3EF] rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF1F3] border border-[#C41641]/20 flex items-center justify-center">
              <FileDown className="w-5 h-5 text-[#C41641]" />
            </div>
            <div>
              <h3 className="text-lg font-outfit font-black tracking-tight text-[#1A2550] uppercase">
                Exportation <span className="text-[#C41641]">Dossier Client</span>
              </h3>
              <p className="text-[11px] text-[#6B7299] font-mono">Fiche d'audit & proposition commerciale</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-[#F4F2EE] hover:bg-[#E8EAF2] text-[#1A2550] flex items-center justify-center cursor-pointer transition font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#6B7299] leading-relaxed">
          Générez un dossier d'audit PDF complet avec score multimodal et proposition commerciale prête à être transmise au client ou à vos partenaires.
        </p>

        {/* Lead Selector */}
        <div className="space-y-2 text-xs">
          <label className="text-[#1A2550] font-outfit font-bold uppercase tracking-wider text-[11px]">
            Sélectionner le commerce :
          </label>
          <select
            value={selectedLeadId}
            onChange={(e) => setSelectedLeadId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#F4F2EE] border border-[#E0E3EF] text-[#1A2550] font-medium focus:outline-none focus:border-[#C41641] cursor-pointer transition"
          >
            {leads.map(l => (
              <option key={l.id} value={l.id} className="bg-white text-[#1A2550]">
                {l.title} ({l.rating}★ - {l.category})
              </option>
            ))}
          </select>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* PDF */}
          <button
            onClick={handleDownloadPdf}
            className="btn-primary !py-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <FileDown className="w-6 h-6" />
            <span className="text-center font-outfit font-bold uppercase text-[11px] tracking-wider">Télécharger PDF</span>
          </button>

          {/* Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="btn-ghost !py-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            {copiedMd ? <Check className="w-6 h-6 text-emerald-600" /> : <FileText className="w-6 h-6 text-[#1A2550]" />}
            <span className="text-center font-outfit font-bold uppercase text-[11px] tracking-wider">
              {copiedMd ? 'Copié en MD !' : 'Copier Markdown'}
            </span>
          </button>
        </div>

        {/* Note on Pandoc option from spec */}
        <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E0E3EF] text-[11px] text-[#6B7299] font-mono space-y-1">
          <p className="text-[#1A2550] font-sans font-bold">Option CLI (Pandoc) :</p>
          <code className="text-[#C41641] font-bold">pandoc blueprint.md -o dossier.pdf --pdf-engine=xelatex</code>
        </div>
      </div>
    </div>
  );
};
