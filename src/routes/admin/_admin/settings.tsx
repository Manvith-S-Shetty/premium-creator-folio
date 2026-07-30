import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/api/public.api';
import { adminApi } from '@/lib/api/admin.api';
import { SiteSettingsDTO } from '@/lib/types/cms.types';
import { FormInput, FormTextArea } from '@/components/admin/ui/FormInput';
import { Save, CheckCircle2 } from 'lucide-react';

export const Route = createFileRoute('/admin/_admin/settings')({
  component: SettingsManager,
});

function SettingsManager() {
  const [settings, setSettings] = useState<Partial<SiteSettingsDTO>>({
    defaultTheme: 'dark',
    accentColor: 'cyan-indigo',
    seoMetaTitle: '',
    seoMetaDescription: '',
    analyticsId: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    publicApi.getSiteSettings().then((res) => {
      if (res) setSettings(res);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminApi.upsertSiteSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save site settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Site Settings Manager</h1>
          <p className="text-sm text-slate-400">Configure global theme default, SEO meta information, and analytics</p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            label="SEO Meta Title"
            value={settings.seoMetaTitle || ''}
            onChange={(e) => setSettings({ ...settings, seoMetaTitle: e.target.value })}
            required
          />
          <FormInput
            label="Analytics ID (Google / Umami)"
            value={settings.analyticsId || ''}
            onChange={(e) => setSettings({ ...settings, analyticsId: e.target.value })}
          />
        </div>

        <FormTextArea
          label="SEO Meta Description"
          rows={3}
          value={settings.seoMetaDescription || ''}
          onChange={(e) => setSettings({ ...settings, seoMetaDescription: e.target.value })}
        />

        <div className="pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving Settings...' : 'Save Site Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
