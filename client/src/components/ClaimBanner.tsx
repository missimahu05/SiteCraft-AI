import { Sparkles, ArrowRight } from 'lucide-react';

export const ClaimBanner = ({
  businessName,
  stripeCheckoutUrl,
  onClaim,
}: {
  businessName: string;
  stripeCheckoutUrl?: string;
  onClaim?: () => void;
}) => {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white px-4 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between text-xs sm:text-sm font-semibold border-b border-orange-700 shadow-lg">
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
        <p className="leading-snug font-outfit text-xs sm:text-sm">
          <strong className="text-white uppercase tracking-wider font-extrabold">Prototype Clé en Main pour {businessName}</strong> : prêt à être lié à votre nom de domaine officiel.
        </p>
      </div>

      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        <button
          onClick={() =>
            window.open(
              'mailto:contact@sitecraft.ai?subject=Modifications site ' + encodeURIComponent(businessName)
            )
          }
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition text-xs cursor-pointer font-outfit"
        >
          Ajuster
        </button>
        <button
          onClick={() => {
            if (onClaim) onClaim();
            else if (stripeCheckoutUrl) window.open(stripeCheckoutUrl, '_blank');
          }}
          className="px-4 py-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white font-outfit font-black uppercase tracking-tight transition shadow-md text-xs cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Activer ce Site (300 000 F / 490 €)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ClaimBanner;
