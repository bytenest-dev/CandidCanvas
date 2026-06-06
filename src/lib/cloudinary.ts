/**
 * Cloudinary Upload Utility
 * Cloud Name: dovw4g2mk
 *
 * Setup steps:
 * 1. Go to Cloudinary Dashboard → Settings → Upload
 * 2. Scroll to "Upload presets" → Add upload preset
 * 3. Set preset name: candid_canvas_uploads
 * 4. Set Signing Mode: "Unsigned"
 * 5. Optional: set folder = "candid-canvas"
 * 6. Save preset
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dovw4g2mk';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'candid_canvas_uploads';

export interface CloudinaryUploadResult {
  url: string;          // Original URL
  secureUrl: string;    // HTTPS URL (always use this)
  publicId: string;     // Used for transformations / deletion
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Upload a single File to Cloudinary via unsigned upload preset.
 * Returns the secure HTTPS URL and metadata.
 */
export async function uploadToCloudinary(
  file: File,
  folder = 'candid-canvas',
  onProgress?: (percent: number) => void,
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          url: data.url,
          secureUrl: data.secure_url,
          publicId: data.public_id,
          width: data.width,
          height: data.height,
          format: data.format,
          bytes: data.bytes,
        });
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during Cloudinary upload'));
    });

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
}

/**
 * Upload multiple files in parallel, with per-file progress callbacks.
 */
export async function uploadMultipleToCloudinary(
  files: File[],
  folder = 'candid-canvas',
  onProgress?: (fileIndex: number, percent: number) => void,
): Promise<CloudinaryUploadResult[]> {
  return Promise.all(
    files.map((file, i) =>
      uploadToCloudinary(file, folder, (pct) => onProgress?.(i, pct))
    )
  );
}

/**
 * Get an optimized Cloudinary URL with transformations.
 * Automatically converts to WebP and resizes for best quality/size balance.
 *
 * @param publicId  The Cloudinary public_id
 * @param width     Target width in pixels
 * @param quality   'auto' | number (1-100)
 */
export function getCloudinaryUrl(
  publicId: string,
  width = 800,
  quality: 'auto' | number = 'auto',
): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_${quality},f_auto,c_limit/${publicId}`;
}

/**
 * Get a thumbnail URL (square crop).
 */
export function getCloudinaryThumb(publicId: string, size = 400): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${size},h_${size},c_fill,g_auto,q_auto,f_auto/${publicId}`;
}

/**
 * Check if a URL is a Cloudinary URL.
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com') || url.includes('cloudinary.com');
}

/**
 * Extract public_id from a Cloudinary URL.
 */
export function getPublicIdFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}
