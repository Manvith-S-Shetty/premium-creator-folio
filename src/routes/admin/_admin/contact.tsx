import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/api/public.api';
import { adminApi } from '@/lib/api/admin.api';
import { SocialLinkDTO } from '@/lib/types/cms.types';
import { FormInput } from '@/components/admin/ui/FormInput';
import { Save, CheckCircle2 } from 'lucide-react';

export const Route = createFileRoute('/admin/_admin/contact')({
  component: ContactManager,
});

function ContactManager() {
  const [socialLinks, setSocialLinks] = useState<SocialLinkDTO[]>([]);
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    publicApi.getPersonalInfo().then((info) => {
      if (info) {
        setEmail(info.email || '');
        setLocation(info.location || '');
      }
    });
    publicApi.getSocialLinks().then(setSocialLinks);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminApi.upsertPersonalInfo({ email, location } as any);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save contact settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Contact & Social Links Manager</h1>
          <p className="text-sm text-slate-400">Manage public contact email, location, and social profiles</p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            label="Primary Contact Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormInput
            label="Physical Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving Changes...' : 'Save Contact Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
