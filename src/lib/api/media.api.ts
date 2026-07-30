import { supabase } from '@/config/supabase';
import { MediaFileDTO } from '../types/cms.types';

export const mediaApi = {
  // Upload Media File to Storage Bucket & Audit Record
  async uploadMedia(file: File, bucketName: string, subfolder: string = ''): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = subfolder 
      ? `${subfolder}/${Date.now()}_${cleanFileName}`
      : `${Date.now()}_${cleanFileName}`;

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // 3. Log Audit Entry in media_files DB table
    await supabase.from('media_files').insert({
      file_name: file.name,
      storage_path: storagePath,
      bucket_name: bucketName,
      mime_type: file.type || 'application/octet-stream',
      file_size_bytes: file.size,
    });

    return publicUrl;
  },

  // List Media Files for bucket
  async listMedia(bucketName: string): Promise<MediaFileDTO[]> {
    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .eq('bucket_name', bucketName)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data.map((m: any) => ({
      id: m.id,
      fileName: m.file_name,
      storagePath: m.storage_path,
      bucketName: m.bucket_name,
      mimeType: m.mime_type,
      fileSizeBytes: m.file_size_bytes,
      uploadedAt: m.uploaded_at,
    }));
  },

  // Delete Media File
  async deleteMedia(id: string, storagePath: string, bucketName: string): Promise<void> {
    // 1. Delete from Storage Bucket
    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .remove([storagePath]);

    if (storageError) throw storageError;

    // 2. Delete Audit Row
    const { error: dbError } = await supabase
      .from('media_files')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;
  }
};
