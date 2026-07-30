import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/api/public.api';
import { adminApi } from '@/lib/api/admin.api';
import { FormInput, FormTextArea } from '@/components/admin/ui/FormInput';
import { Save, CheckCircle2 } from 'lucide-react';

export const Route = createFileRoute('/admin/_admin/about')({
  component: AboutManager,
});

function AboutManager() {
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    displayName: '',
    primaryTitle: '',
    taglineShort: '',
    bio: '',
    personalStory: '',
    corePrinciplesStr: '',
    highlightsStr: '',
    careerObjective: '',
    techInterestsStr: '',
    location: '',
    email: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    publicApi.getPersonalInfo().then((info) => {
      if (info) {
        setFormData({
          id: info.id,
          fullName: info.fullName || '',
          displayName: info.displayName || '',
          primaryTitle: info.primaryTitle || '',
          taglineShort: info.taglineShort || '',
          bio: info.bio || '',
          personalStory: info.personalStory || '',
          corePrinciplesStr: (info.corePrinciples || []).join('\n'),
          highlightsStr: (info.highlights || []).join('\n'),
          careerObjective: info.careerObjective || '',
          techInterestsStr: (info.techInterests || []).join(', '),
          location: info.location || '',
          email: info.email || '',
        });
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        ...formData,
        corePrinciples: formData.corePrinciplesStr.split('\n').filter(Boolean),
        highlights: formData.highlightsStr.split('\n').filter(Boolean),
        techInterests: formData.techInterestsStr.split(',').map((s) => s.trim()).filter(Boolean),
      };

      await adminApi.upsertPersonalInfo(payload as any);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save about section');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">About Section Manager</h1>
          <p className="text-sm text-slate-400">Manage personal story, core principles, and highlights</p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
        <FormTextArea
          label="Personal Narrative / Long Story"
          rows={4}
          value={formData.personalStory}
          onChange={(e) => setFormData({ ...formData, personalStory: e.target.value })}
        />

        <FormTextArea
          label="Core Principles (One per line)"
          rows={3}
          value={formData.corePrinciplesStr}
          onChange={(e) => setFormData({ ...formData, corePrinciplesStr: e.target.value })}
        />

        <FormTextArea
          label="Key Accomplishment Highlights (One per line)"
          rows={3}
          value={formData.highlightsStr}
          onChange={(e) => setFormData({ ...formData, highlightsStr: e.target.value })}
        />

        <FormInput
          label="Focus Areas / Tech Interests (Comma separated)"
          value={formData.techInterestsStr}
          onChange={(e) => setFormData({ ...formData, techInterestsStr: e.target.value })}
        />

        <div className="pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-cyan-400 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving Changes...' : 'Save About Section'}
          </button>
        </div>
      </form>
    </div>
  );
}
