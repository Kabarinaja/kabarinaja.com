export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'vemsqxke';
export const PRESET_ARTICLES = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_ARTICLES || 'kabar_terbaru_articles';
export const PRESET_AUTHORS = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_AUTHORS || 'kabar_terbaru_authors';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  original_filename: string;
  created_at: string;
}

export async function uploadToCloudinary(file: File, presetType: 'article' | 'author' = 'article'): Promise<CloudinaryUploadResponse> {
  if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Ukuran gambar maksimal 10 MB.');

  const preset = presetType === 'author' ? PRESET_AUTHORS : PRESET_ARTICLES;
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset);

  const res = await fetch(url, { method: 'POST', body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `Cloudinary upload gagal (${res.status}).`);
  if (!data.secure_url || !data.public_id) throw new Error('Cloudinary mengembalikan respons yang tidak lengkap.');

  return {
    secure_url: String(data.secure_url),
    public_id: String(data.public_id),
    format: String(data.format || ''),
    width: Number(data.width || 0),
    height: Number(data.height || 0),
    bytes: Number(data.bytes || file.size),
    original_filename: String(data.original_filename || file.name),
    created_at: String(data.created_at || new Date().toISOString()),
  };
}
