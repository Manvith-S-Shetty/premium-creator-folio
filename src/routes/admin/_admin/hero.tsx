import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/api/public.api';
import { adminApi } from '@/lib/api/admin.api';
import { FormInput, FormTextArea } from '@/components/admin/ui/FormInput';
import { ImageUploader } from '@/components/admin/ui/ImageUploader';
import { Save, CheckCircle2 } from 'lucide-react';

export const Route = createFileRoute('/admin/_admin/hero')({
  component: HeroManager,
});

function HeroManager() {
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    displayName: '',
    primaryTitle: '',
    taglineShort: '',
    bio: '',
    careerObjective: '',
    location: '',
    email: '',
    phone: '',
    photoUrl: '',
    isAvailable: true,
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
          careerObjective: info.careerObjective || '',
          location: info.location || '',
          email: info.email || '',
          phone: info.phone || '',
          photoUrl: info.photoUrl || '',
          isAvailable: info.isAvailable ?? true,
        });
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await adminApi.upsertPersonalInfo(formData as any);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save hero information');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Hero Identity Manager</h1>
          <p className="text-sm text-slate-400">Manage main name, title, bio, and hero photo</p>
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
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
          <FormInput
            label="Display Name"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            required
          />
          <FormInput
            label="Primary Title"
            value={formData.primaryTitle}
            onChange={(e) => setFormData({ ...formData, primaryTitle: e.target.value })}
            required
          />
          <FormInput
            label="Short Tagline"
            value={formData.taglineShort}
            onChange={(e) => setFormData({ ...formData, taglineShort: e.target.value })}
          />
          <FormInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <FormInput
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <FormTextArea
          label="Short Bio"
          rows={3}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          required
        />

        <FormTextArea
          label="Career Objective"
          rows={3}
          value={formData.careerObjective}
          onChange={(e) => setFormData({ ...formData, careerObjective: e.target.value })}
        />

        <ImageUploader
          label="Hero Profile Picture"
          bucketName="portfolio-media"
          subfolder="avatars"
          value={formData.photoUrl}
          onChange={(url) => setFormData({ ...formData, photoUrl: url })}
        />

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isAvailable"
            checked={formData.isAvailable}
            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            className="h-4 w-4 rounded border-white/10 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
          />
          <label htmlFor="isAvailable" className="text-sm font-medium text-slate-300">
            Available for new opportunities badge
          </label>
        </div>

        <div className="pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-cyan-400 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving Changes...' : 'Save Hero Information'}
          </button>
        </div>
      </form>
    </div>
  );
}
