import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/api/public.api';
import { adminApi } from '@/lib/api/admin.api';
import { CertificateDTO } from '@/lib/types/cms.types';
import { FormInput, FormTextArea } from '@/components/admin/ui/FormInput';
import { ImageUploader } from '@/components/admin/ui/ImageUploader';
import { Plus, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';

export const Route = createFileRoute('/admin/_admin/certificates')({
  component: CertificatesManager,
});

function CertificatesManager() {
  const [certs, setCerts] = useState<CertificateDTO[]>([]);
  const [editingCert, setEditingCert] = useState<Partial<CertificateDTO> | null>(null);
  const [tagsStr, setTagsStr] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadCerts = () => {
    publicApi.getCertificates().then(setCerts);
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const handleEdit = (cert: CertificateDTO) => {
    setEditingCert(cert);
    setTagsStr((cert.tags || []).join(', '));
  };

  const handleNew = () => {
    setEditingCert({
      title: '',
      issuer: '',
      issueDate: new Date().toISOString().split('T')[0],
      credentialId: '',
      credentialUrl: '',
      pdfUrl: '',
      description: '',
      tags: [],
      displayOrder: certs.length + 1,
    });
    setTagsStr('');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      await adminApi.deleteCertificate(id);
      loadCerts();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    setIsSaving(true);
    try {
      const payload = {
        ...editingCert,
        tags: tagsStr.split(',').map((s) => s.trim()).filter(Boolean),
      };

      await adminApi.upsertCertificate(payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setEditingCert(null);
      loadCerts();
    } catch (err: any) {
      alert(err.message || 'Failed to save certificate');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Certificates Manager</h1>
          <p className="text-sm text-slate-400">Add, edit, upload, or delete formal certificates</p>
        </div>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>New Certificate</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>Certificate saved successfully!</span>
        </div>
      )}

      {editingCert && (
        <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-slate-200">
              {editingCert.id ? 'Edit Certificate' : 'Create New Certificate'}
            </h3>
            <button type="button" onClick={() => setEditingCert(null)} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormInput
              label="Certificate Title"
              value={editingCert.title || ''}
              onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
              required
            />
            <FormInput
              label="Issuer / Organization"
              value={editingCert.issuer || ''}
              onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
              required
            />
            <FormInput
              label="Issue Date"
              type="date"
              value={editingCert.issueDate || ''}
              onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
              required
            />
            <FormInput
              label="Verification URL"
              value={editingCert.credentialUrl || ''}
              onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
            />
          </div>

          <FormTextArea
            label="Description"
            rows={2}
            value={editingCert.description || ''}
            onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
          />

          <ImageUploader
            label="Certificate PDF File"
            bucketName="certificates"
            accept="application/pdf"
            value={editingCert.pdfUrl || ''}
            onChange={(url) => setEditingCert({ ...editingCert, pdfUrl: url })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setEditingCert(null)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-indigo-500"
            >
              {isSaving ? 'Saving...' : 'Save Certificate'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {certs.map((c) => (
          <div key={c.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">{c.issuer}</span>
                <span className="text-xs text-slate-500">{c.issueDate}</span>
              </div>
              <h3 className="mt-2 text-xl font-bold text-slate-100">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-400 line-clamp-2">{c.description}</p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <a
                href={c.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:underline"
              >
                View PDF
              </a>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.05]"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
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
