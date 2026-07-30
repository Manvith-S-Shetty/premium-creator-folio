import React, { useState } from 'react';
import { mediaApi } from '@/lib/api/media.api';
import { Upload, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  bucketName: string;
  subfolder?: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  bucketName,
  subfolder = '',
  value,
  onChange,
  accept = 'image/*',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const publicUrl = await mediaApi.uploadMedia(file, bucketName, subfolder);
      onChange(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-300">{label}</label>
      <div className="flex items-center gap-4">
        {value && (
          <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-white/10 bg-slate-900 flex items-center justify-center">
            {accept.includes('pdf') || value.endsWith('.pdf') ? (
              <FileText className="h-8 w-8 text-cyan-400" />
            ) : (
              <img src={value} alt="Uploaded preview" className="h-full w-full object-cover" />
            )}
          </div>
        )}
        <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-slate-900/30 px-4 py-3 text-xs font-medium text-slate-300 hover:border-cyan-500/50 hover:bg-white/[0.02] transition-colors">
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
              <span>Uploading file...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 text-slate-400" />
              <span>{value ? 'Replace File' : 'Upload File'}</span>
            </>
          )}
          <input type="file" accept={accept} className="hidden" onChange={handleFileChange} disabled={isUploading} />
        </label>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
