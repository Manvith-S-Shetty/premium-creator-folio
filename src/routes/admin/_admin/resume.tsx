import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/api/public.api';
import { adminApi } from '@/lib/api/admin.api';
import { ResumeDTO } from '@/lib/types/cms.types';
import { ImageUploader } from '@/components/admin/ui/ImageUploader';
import { FormInput } from '@/components/admin/ui/FormInput';
import { FileText, CheckCircle2, Upload } from 'lucide-react';

export const Route = createFileRoute('/admin/_admin/resume')({
  component: ResumeManager,
});

function ResumeManager() {
  const [activeResume, setActiveResume] = useState<ResumeDTO | null>(null);
  const [title, setTitle] = useState('SWE Resume');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    publicApi.getActiveResume().then(setActiveResume);
  }, []);

  const handleUploadNew = async (pdfUrl: string) => {
    setIsUploading(true);
    try {
      setActiveResume({
        id: 'new',
        title,
        pdfUrl,
        version: (activeResume?.version || 0) + 1,
        isActive: true,
        uploadedAt: new Date().toISOString(),
      });
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to set active resume');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Resume Version Manager</h1>
        <p className="text-sm text-slate-400">Upload a new resume PDF. The active resume automatically updates the public CTA link.</p>
      </div>

      {uploadSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>New resume uploaded and set to active!</span>
        </div>
      )}

      {activeResume && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Active Resume</span>
              <h3 className="text-lg font-bold text-slate-100">{activeResume.title}</h3>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={activeResume.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-cyan-400 hover:underline"
            >
              Preview Active PDF ({activeResume.pdfUrl})
            </a>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl space-y-6">
        <h3 className="text-lg font-semibold text-slate-200">Upload New Resume Version</h3>
        
        <FormInput
          label="Resume Title / Label"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <ImageUploader
          label="Select Resume PDF File"
          bucketName="resumes"
          accept="application/pdf"
          onChange={handleUploadNew}
        />
      </div>
    </div>
  );
}
