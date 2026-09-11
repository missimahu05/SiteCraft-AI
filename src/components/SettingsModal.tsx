import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Key, Check, Save, X, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [settings, setSettings] = useState<Record<string, string>>({
    OPENAI_API_KEY: '',
    GEMINI_API_KEY: '',
    VERCEL_AUTH_TOKEN: '',
    STRIPE_SECRET_KEY: '',
    RESEND_API_KEY: ''
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getSettings().then(data => {
        setSettings(prev => ({ ...prev, ...data }));
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
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Configuration des Clés API (Backend)</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Ces clés sont stockées de façon sécurisée dans votre base de données SQLite locale (<code>server/data/sitecraft.db</code>). Aucune valeur n'est codée en dur.
        </p>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-zinc-300 font-medium">Clé OpenAI API (GPT-4o Vision)</label>
            <input
              type="password"
              placeholder="sk-..."
              value={settings.OPENAI_API_KEY || ''}
              onChange={e => setSettings({ ...settings, OPENAI_API_KEY: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-zinc-500">Utilisée pour la notation multimodale des captures d'écran.</span>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-300 font-medium">Vercel Auth Token</label>
            <input
              type="password"
              placeholder="Token API Vercel..."
              value={settings.VERCEL_AUTH_TOKEN || ''}
              onChange={e => setSettings({ ...settings, VERCEL_AUTH_TOKEN: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-zinc-500">Utilisé pour créer de vrais déploiements sur l'API Vercel (Section 4.2).</span>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-300 font-medium">Stripe Secret Key (sk_test_... ou sk_live_...)</label>
            <input
              type="password"
              placeholder="sk_test_..."
              value={settings.STRIPE_SECRET_KEY || ''}
              onChange={e => setSettings({ ...settings, STRIPE_SECRET_KEY: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-zinc-500">Pour générer de vraies sessions de paiement Stripe Checkout à 490 €.</span>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-300 font-medium">Resend API Key (re_...)</label>
            <input
              type="password"
              placeholder="re_..."
              value={settings.RESEND_API_KEY || ''}
              onChange={e => setSettings({ ...settings, RESEND_API_KEY: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-zinc-500">Pour l'envoi réel des emails de prospection à froid.</span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Base SQLite active</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium cursor-pointer"
              >
                Fermer
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{saved ? 'Enregistré !' : 'Sauvegarder'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
