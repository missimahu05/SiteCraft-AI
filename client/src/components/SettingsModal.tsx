import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Key, Check, Save, X, ShieldCheck, Database, Cloud, CreditCard, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [settings, setSettings] = useState<Record<string, string>>({
    MONGODB_URI: '',
    CLOUDFLARE_API_TOKEN: '',
    CLOUDFLARE_ACCOUNT_ID: '',
    FEEXPAY_API_KEY: '',
    FEEXPAY_SHOP_ID: '',
    FEEXPAY_MODE: 'TEST',
    OPENAI_API_KEY: '',
    GEMINI_API_KEY: ''
  });
  const [dbStatus, setDbStatus] = useState<any>({ mode: 'memory_fallback', connected: false });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getSettings().then(data => {
        setSettings(prev => ({ ...prev, ...data.settings }));
        if (data.dbStatus) setDbStatus(data.dbStatus);
      }).catch(err => console.error('Failed to load settings:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await api.updateSetting(key, value);
      }
      setSaved(true);
      const refreshed = await api.getSettings();
      if (refreshed.dbStatus) setDbStatus(refreshed.dbStatus);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center">
              <Key className="w-5 h-5 text-[#EA580C]" />
            </div>
            <div>
              <h3 className="text-lg font-outfit font-black tracking-tight text-[#0F172A] uppercase">
                Configuration <span className="text-[#EA580C]">APIs & Infrastructure</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">Stockage sécurisé • Déploiement Cloudflare • Passerelle FeexPay</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F172A] flex items-center justify-center cursor-pointer transition font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live System Status Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
            <Database className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="text-[11px] leading-tight">
              <div className="font-bold text-[#0F172A]">MongoDB</div>
              <div className="text-emerald-700 font-mono text-[10px]">
                {dbStatus.connected ? 'Atlas Connecté' : 'Mode Fallback Actif'}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
            <Cloud className="w-4 h-4 text-[#EA580C] shrink-0" />
            <div className="text-[11px] leading-tight">
              <div className="font-bold text-[#0F172A]">Cloudflare Pages</div>
              <div className="text-slate-500 font-mono text-[10px]">Anycast Edge (330+ Villes)</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
            <CreditCard className="w-4 h-4 text-[#EA580C] shrink-0" />
            <div className="text-[11px] leading-tight">
              <div className="font-bold text-[#0F172A]">FeexPay</div>
              <div className="text-[#EA580C] font-mono text-[10px]">MTN • Moov • Wave • CB</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-xs">
          {/* MONGODB */}
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-[#0F172A] font-outfit font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                MongoDB Connection URI (Atlas ou Local)
              </label>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">Remplacement SQLite</span>
            </div>
            <input
              type="password"
              placeholder="mongodb+srv://<user>:<password>@cluster0.mongodb.net/sitecraft"
              value={settings.MONGODB_URI || ''}
              onChange={e => setSettings({ ...settings, MONGODB_URI: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-[#0F172A] font-mono text-xs focus:outline-none focus:border-[#EA580C] transition"
            />
            <span className="text-[10px] text-slate-500 block">
              Stocke durablement tous les leads, audits, sites générés et transactions FeexPay.
            </span>
          </div>

          {/* CLOUDFLARE */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-[#0F172A] font-outfit font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Cloud className="w-3.5 h-3.5 text-[#EA580C]" />
                Cloudflare Pages API (Déploiements & Domaines)
              </label>
              <span className="text-[10px] text-[#EA580C] font-mono font-bold">Remplacement Vercel</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-[#0F172A] font-semibold">Cloudflare API Token</span>
                <input
                  type="password"
                  placeholder="Token avec droit Pages:Edit..."
                  value={settings.CLOUDFLARE_API_TOKEN || ''}
                  onChange={e => setSettings({ ...settings, CLOUDFLARE_API_TOKEN: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-[#0F172A] font-mono text-xs focus:outline-none focus:border-[#EA580C] transition"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#0F172A] font-semibold">Cloudflare Account ID</span>
                <input
                  type="text"
                  placeholder="Account ID (tableau de bord CF)..."
                  value={settings.CLOUDFLARE_ACCOUNT_ID || ''}
                  onChange={e => setSettings({ ...settings, CLOUDFLARE_ACCOUNT_ID: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-[#0F172A] font-mono text-xs focus:outline-none focus:border-[#EA580C] transition"
                />
              </div>
            </div>
          </div>

          {/* FEEXPAY */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-[#0F172A] font-outfit font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-[#EA580C]" />
                Passerelle FeexPay (Paiements Afrique & Mobile Money)
              </label>
              <span className="text-[10px] text-[#EA580C] font-mono font-bold">MTN / Moov / Orange / Wave</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-[#0F172A] font-semibold">FeexPay API Key</span>
                <input
                  type="password"
                  placeholder="fp_live_... ou fp_test_..."
                  value={settings.FEEXPAY_API_KEY || ''}
                  onChange={e => setSettings({ ...settings, FEEXPAY_API_KEY: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-[#0F172A] font-mono text-xs focus:outline-none focus:border-[#EA580C] transition"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#0F172A] font-semibold">Shop ID FeexPay</span>
                <input
                  type="text"
                  placeholder="ID de votre boutique..."
                  value={settings.FEEXPAY_SHOP_ID || ''}
                  onChange={e => setSettings({ ...settings, FEEXPAY_SHOP_ID: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-[#0F172A] font-mono text-xs focus:outline-none focus:border-[#EA580C] transition"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#0F172A] font-semibold">Mode d'exécution</span>
                <select
                  value={settings.FEEXPAY_MODE || 'TEST'}
                  onChange={e => setSettings({ ...settings, FEEXPAY_MODE: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-[#0F172A] font-mono text-xs focus:outline-none focus:border-[#EA580C] transition cursor-pointer"
                >
                  <option value="TEST">TEST (Simulation)</option>
                  <option value="LIVE">LIVE (Paiements Réels)</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI VISION (OpenAI / Gemini) */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-[#0F172A] font-outfit font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              IA Multimodale (Vision LLM & Génération de Contenu)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-[#0F172A] font-semibold">OpenAI API Key (GPT-4o)</span>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={settings.OPENAI_API_KEY || ''}
                  onChange={e => setSettings({ ...settings, OPENAI_API_KEY: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-[#0F172A] font-mono text-xs focus:outline-none focus:border-[#EA580C] transition"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#0F172A] font-semibold">Google Gemini API Key</span>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={settings.GEMINI_API_KEY || ''}
                  onChange={e => setSettings({ ...settings, GEMINI_API_KEY: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-[#0F172A] font-mono text-xs focus:outline-none focus:border-[#EA580C] transition"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-between border-t border-[#E0E3EF]">
            <div className="flex items-center gap-2 text-[11px] text-[#6B7299]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zéro valeur codée en dur. Variables persistées en base.</span>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost text-xs !py-2.5 !px-4"
              >
                Fermer
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-xs !py-2.5 !px-5"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{saved ? 'Enregistré !' : 'Sauvegarder la Configuration'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
