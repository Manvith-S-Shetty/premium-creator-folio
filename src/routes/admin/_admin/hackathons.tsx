import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/api/public.api';
import { adminApi } from '@/lib/api/admin.api';
import { HackathonDTO } from '@/lib/types/cms.types';
import { FormInput, FormTextArea } from '@/components/admin/ui/FormInput';
import { Plus, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';

export const Route = createFileRoute('/admin/_admin/hackathons')({
  component: HackathonsManager,
});

function HackathonsManager() {
  const [hackathons, setHackathons] = useState<HackathonDTO[]>([]);
  const [editingHack, setEditingHack] = useState<Partial<HackathonDTO> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadHackathons = () => {
    publicApi.getHackathons().then(setHackathons);
  };

  useEffect(() => {
    loadHackathons();
  }, []);

  const handleEdit = (hack: HackathonDTO) => {
    setEditingHack(hack);
  };

  const handleNew = () => {
    setEditingHack({
      name: '',
      organizer: '',
      position: '',
      description: '',
      displayOrder: hackathons.length + 1,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hackathon?')) {
      await adminApi.deleteHackathon(id);
      loadHackathons();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHack) return;

    setIsSaving(true);
    try {
      await adminApi.upsertHackathon(editingHack);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setEditingHack(null);
      loadHackathons();
    } catch (err: any) {
      alert(err.message || 'Failed to save hackathon');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Hackathons Manager</h1>
          <p className="text-sm text-slate-400">Manage competitions, positions, and hackathon projects</p>
        </div>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>New Hackathon</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>Hackathon saved successfully!</span>
        </div>
      )}

      {editingHack && (
        <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-slate-200">
              {editingHack.id ? 'Edit Hackathon' : 'Create New Hackathon'}
            </h3>
            <button type="button" onClick={() => setEditingHack(null)} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormInput
              label="Hackathon Name"
              value={editingHack.name || ''}
              onChange={(e) => setEditingHack({ ...editingHack, name: e.target.value })}
              required
            />
            <FormInput
              label="Organizer"
              value={editingHack.organizer || ''}
              onChange={(e) => setEditingHack({ ...editingHack, organizer: e.target.value })}
              required
            />
            <FormInput
              label="Position / Award"
              value={editingHack.position || ''}
              onChange={(e) => setEditingHack({ ...editingHack, position: e.target.value })}
              placeholder="e.g. Winner, Top 5"
            />
          </div>

          <FormTextArea
            label="Description"
            rows={3}
            value={editingHack.description || ''}
            onChange={(e) => setEditingHack({ ...editingHack, description: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setEditingHack(null)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500"
            >
              {isSaving ? 'Saving...' : 'Save Hackathon'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {hackathons.map((h) => (
          <div key={h.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">{h.organizer}</span>
              <h3 className="mt-2 text-xl font-bold text-slate-100">{h.name}</h3>
              <p className="mt-1 text-sm font-medium text-emerald-400">{h.position}</p>
              <p className="mt-2 text-sm text-slate-400 line-clamp-2">{h.description}</p>
            </div>

            <div className="mt-6 flex items-center justify-end border-t border-white/10 pt-4 gap-2">
              <button
                onClick={() => handleEdit(h)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.05]"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(h.id)}
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
