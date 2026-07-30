import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/api/public.api';
import { adminApi } from '@/lib/api/admin.api';
import { SkillDTO } from '@/lib/types/cms.types';
import { FormInput } from '@/components/admin/ui/FormInput';
import { Plus, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';

export const Route = createFileRoute('/admin/_admin/skills')({
  component: SkillsManager,
});

function SkillsManager() {
  const [skills, setSkills] = useState<SkillDTO[]>([]);
  const [editingSkill, setEditingSkill] = useState<Partial<SkillDTO> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadSkills = () => {
    publicApi.getSkills().then(setSkills);
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleEdit = (skill: SkillDTO) => {
    setEditingSkill(skill);
  };

  const handleNew = () => {
    setEditingSkill({
      name: '',
      category: 'Languages',
      proficiencyLevel: 85,
      yearsExperience: 2,
      displayOrder: skills.length + 1,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      await adminApi.deleteSkill(id);
      loadSkills();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    setIsSaving(true);
    try {
      await adminApi.upsertSkill(editingSkill);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setEditingSkill(null);
      loadSkills();
    } catch (err: any) {
      alert(err.message || 'Failed to save skill');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Skills Matrix Manager</h1>
          <p className="text-sm text-slate-400">Manage technical stack categories and proficiency levels</p>
        </div>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>New Skill</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>Skill saved successfully!</span>
        </div>
      )}

      {editingSkill && (
        <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-slate-200">
              {editingSkill.id ? 'Edit Skill' : 'Create New Skill'}
            </h3>
            <button type="button" onClick={() => setEditingSkill(null)} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormInput
              label="Skill Name"
              value={editingSkill.name || ''}
              onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">Category</label>
              <select
                value={editingSkill.category || 'Languages'}
                onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none text-sm"
              >
                <option value="Languages">Languages</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="AI / ML">AI / ML</option>
                <option value="Tools">Tools</option>
                <option value="Cloud">Cloud</option>
              </select>
            </div>
            <FormInput
              label="Display Order"
              type="number"
              value={editingSkill.displayOrder || 0}
              onChange={(e) => setEditingSkill({ ...editingSkill, displayOrder: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setEditingSkill(null)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500"
            >
              {isSaving ? 'Saving...' : 'Save Skill'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {skills.map((s) => (
          <div key={s.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-semibold">{s.category}</span>
              <h4 className="text-base font-bold text-slate-100">{s.name}</h4>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleEdit(s)}
                className="p-1 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.05]"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/[0.05]"
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
