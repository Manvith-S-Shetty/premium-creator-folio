import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/api/public.api';
import { adminApi } from '@/lib/api/admin.api';
import { AchievementDTO } from '@/lib/types/cms.types';
import { FormInput, FormTextArea } from '@/components/admin/ui/FormInput';
import { Plus, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';

export const Route = createFileRoute('/admin/_admin/achievements')({
  component: AchievementsManager,
});

function AchievementsManager() {
  const [achievements, setAchievements] = useState<AchievementDTO[]>([]);
  const [editingAch, setEditingAch] = useState<Partial<AchievementDTO> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadAchievements = () => {
    publicApi.getAchievements().then(setAchievements);
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const handleEdit = (ach: AchievementDTO) => {
    setEditingAch(ach);
  };

  const handleNew = () => {
    setEditingAch({
      title: '',
      issuer: '',
      description: '',
      linkUrl: '',
      displayOrder: achievements.length + 1,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this achievement?')) {
      await adminApi.deleteAchievement(id);
      loadAchievements();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAch) return;

    setIsSaving(true);
    try {
      await adminApi.upsertAchievement(editingAch);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setEditingAch(null);
      loadAchievements();
    } catch (err: any) {
      alert(err.message || 'Failed to save achievement');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Achievements Manager</h1>
          <p className="text-sm text-slate-400">Manage honors, awards, and recognitions</p>
        </div>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>New Achievement</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>Achievement saved successfully!</span>
        </div>
      )}

      {editingAch && (
        <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-slate-200">
              {editingAch.id ? 'Edit Achievement' : 'Create New Achievement'}
            </h3>
            <button type="button" onClick={() => setEditingAch(null)} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormInput
              label="Achievement Title"
              value={editingAch.title || ''}
              onChange={(e) => setEditingAch({ ...editingAch, title: e.target.value })}
              required
            />
            <FormInput
              label="Issuer / Organization"
              value={editingAch.issuer || ''}
              onChange={(e) => setEditingAch({ ...editingAch, issuer: e.target.value })}
            />
            <FormInput
              label="External Link URL"
              value={editingAch.linkUrl || ''}
              onChange={(e) => setEditingAch({ ...editingAch, linkUrl: e.target.value })}
            />
          </div>

          <FormTextArea
            label="Description"
            rows={3}
            value={editingAch.description || ''}
            onChange={(e) => setEditingAch({ ...editingAch, description: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setEditingAch(null)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500"
            >
              {isSaving ? 'Saving...' : 'Save Achievement'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {achievements.map((a) => (
          <div key={a.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">{a.issuer || 'Award'}</span>
              <h3 className="mt-2 text-xl font-bold text-slate-100">{a.title}</h3>
              <p className="mt-1 text-sm text-slate-400 line-clamp-2">{a.description}</p>
            </div>

            <div className="mt-6 flex items-center justify-end border-t border-white/10 pt-4 gap-2">
              <button
                onClick={() => handleEdit(a)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.05]"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(a.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/[0.05]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
