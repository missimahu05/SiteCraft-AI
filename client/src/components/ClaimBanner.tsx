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
    <div className="sticky top-0 z-50 bg-[#C41641] text-white px-5 py-3 flex flex-wrap items-center justify-between text-xs sm:text-sm font-semibold border-b border-[#A01235] shadow-lg">
      <div className="flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
        <p className="leading-snug font-outfit">
          <strong className="text-white uppercase tracking-wider">Prototype Haute Fidélité pour {businessName}</strong> : prêt à être publié sur votre nom de domaine officiel.
        </p>
      </div>
      <div className="flex items-center gap-2.5 mt-2 sm:mt-0">
        <button 
          onClick={() => window.open('mailto:contact@sitecraft.ai?subject=Modifications site ' + encodeURIComponent(businessName))}
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition text-xs cursor-pointer font-outfit"
        >
          Demander un ajustement
        </button>
        <button 
          onClick={() => {
            if (onClaim) onClaim();
            else if (stripeCheckoutUrl) window.open(stripeCheckoutUrl, '_blank');
          }}
          className="px-4 py-1.5 rounded-xl bg-[#1A2550] hover:bg-[#0F163A] text-white font-outfit font-black uppercase tracking-tight transition shadow-md text-xs cursor-pointer hover:scale-105 active:scale-95"
        >
          Activer ce Site (490 €)
        </button>
      </div>
    </div>
  );
};
