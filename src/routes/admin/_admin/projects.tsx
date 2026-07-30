import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/api/public.api';
import { adminApi } from '@/lib/api/admin.api';
import { ProjectDTO } from '@/lib/types/cms.types';
import { FormInput, FormTextArea } from '@/components/admin/ui/FormInput';
import { ImageUploader } from '@/components/admin/ui/ImageUploader';
import { Plus, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';

export const Route = createFileRoute('/admin/_admin/projects')({
  component: ProjectsManager,
});

function ProjectsManager() {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [editingProject, setEditingProject] = useState<Partial<ProjectDTO> | null>(null);
  const [bulletsStr, setBulletsStr] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadProjects = () => {
    publicApi.getPublishedProjects().then(setProjects);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleEdit = (project: ProjectDTO) => {
    setEditingProject(project);
    setBulletsStr((project.bullets || []).join('\n'));
  };

  const handleNew = () => {
    setEditingProject({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      bullets: [],
      githubUrl: '',
      liveUrl: '',
      thumbnailUrl: '',
      category: 'Full-Stack',
      isFeatured: false,
      isPublished: true,
      displayOrder: projects.length + 1,
    });
    setBulletsStr('');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await adminApi.deleteProject(id);
      loadProjects();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setIsSaving(true);
    try {
      const payload = {
        ...editingProject,
        bullets: bulletsStr.split('\n').filter(Boolean),
        slug: editingProject.slug || editingProject.title?.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      };

      await adminApi.upsertProject(payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setEditingProject(null);
      loadProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Projects Manager</h1>
          <p className="text-sm text-slate-400">Add, edit, reorder, or delete portfolio projects</p>
        </div>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>Project saved successfully!</span>
        </div>
      )}

      {editingProject && (
        <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-slate-200">
              {editingProject.id ? 'Edit Project' : 'Create New Project'}
            </h3>
            <button type="button" onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormInput
              label="Project Title"
              value={editingProject.title || ''}
              onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
              required
            />
            <FormInput
              label="URL Slug"
              value={editingProject.slug || ''}
              onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
              placeholder="e.g. cinesync"
            />
            <FormInput
              label="Category"
              value={editingProject.category || ''}
              onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
              required
            />
            <FormInput
              label="Display Order"
              type="number"
              value={editingProject.displayOrder || 0}
              onChange={(e) => setEditingProject({ ...editingProject, displayOrder: parseInt(e.target.value) })}
            />
            <FormInput
              label="GitHub Repository URL"
              value={editingProject.githubUrl || ''}
              onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
            />
            <FormInput
              label="Live Demo URL"
              value={editingProject.liveUrl || ''}
              onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
            />
          </div>

          <FormTextArea
            label="Short Description"
            rows={2}
            value={editingProject.shortDescription || ''}
            onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
            required
          />

          <FormTextArea
            label="Bullet Points (One per line)"
            rows={4}
            value={bulletsStr}
            onChange={(e) => setBulletsStr(e.target.value)}
          />

          <ImageUploader
            label="Project Thumbnail Image"
            bucketName="portfolio-media"
            subfolder="projects"
            value={editingProject.thumbnailUrl || ''}
            onChange={(url) => setEditingProject({ ...editingProject, thumbnailUrl: url })}
          />

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={editingProject.isFeatured || false}
                onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                className="rounded border-white/10 bg-slate-900 text-cyan-500"
              />
              Featured Project
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={editingProject.isPublished ?? true}
                onChange={(e) => setEditingProject({ ...editingProject, isPublished: e.target.checked })}
                className="rounded border-white/10 bg-slate-900 text-cyan-500"
              />
              Published on Public Site
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setEditingProject(null)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500"
            >
              {isSaving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <div key={p.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">{p.category}</span>
                <span className="text-xs text-slate-500">Order #{p.displayOrder}</span>
              </div>
              <h3 className="mt-2 text-xl font-bold text-slate-100">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-400 line-clamp-2">{p.shortDescription}</p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${p.isPublished ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                {p.isPublished ? 'Published' : 'Draft'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.05]"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/[0.05]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
