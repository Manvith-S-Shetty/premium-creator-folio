import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { mediaApi } from '@/lib/api/media.api';
import { supabase } from '@/config/supabase';
import { MediaFileDTO } from '@/lib/types/cms.types';
import { ImageUploader } from '@/components/admin/ui/ImageUploader';
import { FileText, Image as ImageIcon, Trash2, Copy, Check, Search, FolderOpen } from 'lucide-react';

export const Route = createFileRoute('/admin/_admin/media')({
  component: MediaLibraryManager,
});

function MediaLibraryManager() {
  const [activeBucket, setActiveBucket] = useState<'portfolio-media' | 'certificates' | 'resumes'>('portfolio-media');
  const [files, setFiles] = useState<MediaFileDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMedia = () => {
    mediaApi.listMedia(activeBucket).then(setFiles);
  };

  useEffect(() => {
    loadMedia();
  }, [activeBucket]);

  const handleDelete = async (file: MediaFileDTO) => {
    if (confirm(`Delete file "${file.fileName}"?`)) {
      await mediaApi.deleteMedia(file.id, file.storagePath, file.bucketName);
      loadMedia();
    }
  };

  const handleCopyUrl = (file: MediaFileDTO) => {
    const { data } = supabase.storage.from(file.bucketName).getPublicUrl(file.storagePath);
    navigator.clipboard.writeText(data.publicUrl);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFiles = files.filter((f) =>
    f.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Media Library</h1>
          <p className="text-sm text-slate-400">Browse, copy URLs, or delete stored files across storage buckets</p>
        </div>

        {/* Bucket Tabs */}
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-1 backdrop-blur-xl">
          {(['portfolio-media', 'certificates', 'resumes'] as const).map((b) => (
            <button
              key={b}
              onClick={() => setActiveBucket(b)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeBucket === b
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Upload New Asset */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
        <ImageUploader
          label={`Upload Asset to ${activeBucket}`}
          bucketName={activeBucket}
          accept={activeBucket === 'resumes' ? 'application/pdf' : 'image/*,application/pdf'}
          onChange={() => loadMedia()}
        />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search files by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-slate-900/50 pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      {/* Media Grid */}
      {filteredFiles.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-slate-600" />
          <p className="mt-4 text-sm font-medium text-slate-400">No files found in {activeBucket}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredFiles.map((file) => {
            const publicUrl = supabase.storage.from(file.bucketName).getPublicUrl(file.storagePath).data.publicUrl;
            const isPdf = file.mimeType.includes('pdf') || file.fileName.endsWith('.pdf');

            return (
              <div
                key={file.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-xl transition-all hover:border-white/20"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-900 flex items-center justify-center">
                  {isPdf ? (
                    <FileText className="h-12 w-12 text-cyan-400" />
                  ) : (
                    <img src={publicUrl} alt={file.fileName} className="h-full w-full object-cover" />
                  )}
                </div>

                <div className="mt-3 space-y-1">
                  <p className="text-xs font-medium text-slate-200 truncate" title={file.fileName}>
                    {file.fileName}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {(file.fileSizeBytes / 1024).toFixed(1)} KB
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2">
                  <button
                    onClick={() => handleCopyUrl(file)}
                    className="flex items-center gap-1 text-[10px] font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    {copiedId === file.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(file)}
                    className="text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
