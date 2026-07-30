import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/api/public.api';
import { adminApi } from '@/lib/api/admin.api';
import { ExperienceDTO } from '@/lib/types/cms.types';
import { FormInput, FormTextArea } from '@/components/admin/ui/FormInput';
import { Plus, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';

export const Route = createFileRoute('/admin/_admin/experience')({
  component: ExperienceManager,
});

function ExperienceManager() {
  const [expList, setExpList] = useState<ExperienceDTO[]>([]);
  const [editingExp, setEditingExp] = useState<Partial<ExperienceDTO> | null>(null);
  const [descStr, setDescStr] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadExperience = () => {
    publicApi.getExperience().then(setExpList);
  };

  useEffect(() => {
    loadExperience();
  }, []);

  const handleEdit = (exp: ExperienceDTO) => {
    setEditingExp(exp);
    setDescStr((exp.description || []).join('\n'));
  };

  const handleNew = () => {
    setEditingExp({
      company: '',
      role: '',
      location: '',
      employmentType: 'Full-time',
      startDate: new Date().toISOString().split('T')[0],
      isCurrent: false,
      description: [],
      displayOrder: expList.length + 1,
    });
    setDescStr('');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this experience record?')) {
      await adminApi.deleteExperience(id);
      loadExperience();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;

    setIsSaving(true);
    try {
      const payload = {
        ...editingExp,
        description: descStr.split('\n').filter(Boolean),
      };

      await adminApi.upsertExperience(payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setEditingExp(null);
      loadExperience();
    } catch (err: any) {
      alert(err.message || 'Failed to save experience');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Work Experience Manager</h1>
          <p className="text-sm text-slate-400">Manage employment history, internships, and roles</p>
        </div>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>New Experience</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>Experience saved successfully!</span>
        </div>
      )}

      {editingExp && (
        <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-slate-200">
              {editingExp.id ? 'Edit Experience' : 'Create New Experience'}
            </h3>
            <button type="button" onClick={() => setEditingExp(null)} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormInput
              label="Company Name"
              value={editingExp.company || ''}
              onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
              required
            />
            <FormInput
              label="Role Title"
              value={editingExp.role || ''}
              onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
              required
            />
            <FormInput
              label="Start Date"
              type="date"
              value={editingExp.startDate || ''}
              onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
              required
            />
            <FormInput
              label="End Date (Leave empty if current)"
              type="date"
              value={editingExp.endDate || ''}
              onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
            />
          </div>

          <FormTextArea
            label="Key Responsibilities / Bullets (One per line)"
            rows={4}
            value={descStr}
            onChange={(e) => setDescStr(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isCurrent"
              checked={editingExp.isCurrent || false}
              onChange={(e) => setEditingExp({ ...editingExp, isCurrent: e.target.checked })}
              className="h-4 w-4 rounded border-white/10 bg-slate-900 text-cyan-500"
            />
            <label htmlFor="isCurrent" className="text-sm text-slate-300">
              Currently working in this role
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setEditingExp(null)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500"
            >
              {isSaving ? 'Saving...' : 'Save Experience'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {expList.map((e) => (
          <div key={e.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">{e.company}</span>
                <span className="text-xs text-slate-500">{e.startDate} – {e.isCurrent ? 'Present' : e.endDate}</span>
              </div>
              <h3 className="mt-2 text-xl font-bold text-slate-100">{e.role}</h3>
            </div>

            <div className="mt-6 flex items-center justify-end border-t border-white/10 pt-4 gap-2">
              <button
                onClick={() => handleEdit(e)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.05]"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(e.id)}
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
