import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/api/public.api';
import { adminApi } from '@/lib/api/admin.api';
import { EducationDTO } from '@/lib/types/cms.types';
import { FormInput } from '@/components/admin/ui/FormInput';
import { Plus, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';

export const Route = createFileRoute('/admin/_admin/education')({
  component: EducationManager,
});

function EducationManager() {
  const [eduList, setEduList] = useState<EducationDTO[]>([]);
  const [editingEdu, setEditingEdu] = useState<Partial<EducationDTO> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadEdu = () => {
    publicApi.getEducation().then(setEduList);
  };

  useEffect(() => {
    loadEdu();
  }, []);

  const handleEdit = (edu: EducationDTO) => {
    setEditingEdu(edu);
  };

  const handleNew = () => {
    setEditingEdu({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      duration: '',
      cgpa: '',
      displayOrder: eduList.length + 1,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this education record?')) {
      await adminApi.deleteEducation(id);
      loadEdu();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;

    setIsSaving(true);
    try {
      await adminApi.upsertEducation(editingEdu);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setEditingEdu(null);
      loadEdu();
    } catch (err: any) {
      alert(err.message || 'Failed to save education');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Education Manager</h1>
          <p className="text-sm text-slate-400">Manage academic degrees and institutional credentials</p>
        </div>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>New Education</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>Education saved successfully!</span>
        </div>
      )}

      {editingEdu && (
        <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-slate-200">
              {editingEdu.id ? 'Edit Education' : 'Create New Education'}
            </h3>
            <button type="button" onClick={() => setEditingEdu(null)} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormInput
              label="Institution Name"
              value={editingEdu.institution || ''}
              onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
              required
            />
            <FormInput
              label="Degree Title"
              value={editingEdu.degree || ''}
              onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
              required
            />
            <FormInput
              label="Duration (e.g. 2023 – 2027)"
              value={editingEdu.duration || ''}
              onChange={(e) => setEditingEdu({ ...editingEdu, duration: e.target.value })}
              required
            />
            <FormInput
              label="CGPA / Score"
              value={editingEdu.cgpa || ''}
              onChange={(e) => setEditingEdu({ ...editingEdu, cgpa: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setEditingEdu(null)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500"
            >
              {isSaving ? 'Saving...' : 'Save Education'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {eduList.map((ed) => (
          <div key={ed.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">{ed.institution}</span>
                <span className="text-xs text-slate-500">{ed.duration}</span>
              </div>
              <h3 className="mt-2 text-xl font-bold text-slate-100">{ed.degree}</h3>
              <p className="mt-1 text-sm text-slate-400">CGPA: {ed.cgpa || 'N/A'}</p>
            </div>

            <div className="mt-6 flex items-center justify-end border-t border-white/10 pt-4 gap-2">
              <button
                onClick={() => handleEdit(ed)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.05]"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(ed.id)}
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
