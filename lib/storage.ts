import { supabase, isSupabaseConfigured } from './supabase';

// ============================================
// STORAGE SERVICE FOR IMAGE UPLOADS
// ============================================

const BUCKET_NAME = 'captaloona-images';

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface UploadResult {
  success: boolean;
  url: string | null;
  error: string | null;
}

/**
 * Upload an image file to Supabase Storage
 */
export async function uploadImage(
  file: File,
  folder: 'artworks' | 'artists' | 'events' | 'general' = 'general'
): Promise<UploadResult> {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    // Return a local object URL for preview in offline mode
    const localUrl = URL.createObjectURL(file);
    return {
      success: true,
      url: localUrl,
      error: null,
    };
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      url: null,
      error: 'Tipo de archivo no permitido. Use JPG, PNG, WebP o GIF.',
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      url: null,
      error: 'El archivo es demasiado grande. Máximo 10MB.',
    };
  }

  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        url: null,
        error: `Error al subir: ${error.message}`,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
      error: null,
    };
  } catch (err) {
    console.error('Upload exception:', err);
    return {
      success: false,
      url: null,
      error: 'Error inesperado al subir la imagen.',
    };
  }
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return true;
  }

  try {
    // Extract path from URL
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/);

    if (!pathMatch) {
      return false;
    }

    const filePath = pathMatch[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Delete exception:', err);
    return false;
  }
}

/**
 * Convert a File to base64 for preview
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Check if a URL is a local blob URL
 */
export function isLocalBlobUrl(url: string): boolean {
  return url.startsWith('blob:');
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error: string | null } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de archivo no permitido. Use JPG, PNG, WebP o GIF.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'El archivo es demasiado grande. Máximo 10MB.',
    };
  }

  return { valid: true, error: null };
}
