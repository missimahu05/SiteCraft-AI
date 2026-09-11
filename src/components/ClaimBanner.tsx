export const ClaimBanner = ({ 
  businessName, 
  stripeCheckoutUrl,
  onClaim
}: { 
  businessName: string; 
  stripeCheckoutUrl?: string;
  onClaim?: () => void;
}) => {
  return (
    <div className="sticky top-0 z-50 bg-amber-400 text-zinc-950 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs sm:text-sm font-medium border-b border-amber-500 shadow-md">
      <p>
        🚀 <strong>Version démo pour {businessName}</strong> : ce site est prêt à être publié sur votre nom de domaine officiel.
      </p>
      <div className="flex gap-2 mt-2 sm:mt-0">
        <button 
          onClick={() => window.open('mailto:contact@sitecraft.ai?subject=Modifications site ' + encodeURIComponent(businessName))}
          className="px-3 py-1 rounded bg-zinc-900/10 hover:bg-zinc-900/20 text-zinc-900 font-semibold transition"
        >
          Demander un ajustement
        </button>
        <button 
          onClick={() => {
            if (onClaim) onClaim();
            else if (stripeCheckoutUrl) window.open(stripeCheckoutUrl, '_blank');
          }}
          className="px-3 py-1 rounded bg-zinc-950 hover:bg-zinc-800 text-white font-semibold transition shadow-sm cursor-pointer"
        >
          Valider et Activer ce Site (490 €)
        </button>
      </div>
    </div>
  );
};
