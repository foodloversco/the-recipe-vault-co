/**
 * Utility to compress and optimize images for 9:16 vertical phone & web reading.
 * Automatically resizes large files (e.g. 5MB-15MB phone camera shots or Photoshop exports)
 * to max 1080x1920 (9:16 aspect ratio) at ~120KB-250KB WebP/JPEG for lightning-fast loading.
 */

export interface CompressionResult {
  file: File;
  dataUrl: string;
  originalSizeFormatted: string;
  compressedSizeFormatted: string;
  width: number;
  height: number;
}

export async function compress916Image(
  file: File,
  targetWidth: number = 1080,
  targetHeight: number = 1920,
  quality: number = 0.85
): Promise<CompressionResult> {
  const originalSizeFormatted = formatBytes(file.size);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file'));

    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not initialize canvas context'));
          return;
        }

        // Draw background matching dark editorial theme
        ctx.fillStyle = '#100f0e';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Calculate aspect ratios for center-fit / contain
        const srcAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight; // 9 / 16 = 0.5625

        let drawW = targetWidth;
        let drawH = targetHeight;
        let drawX = 0;
        let drawY = 0;

        if (srcAspect > targetAspect) {
          // Source is wider than 9:16, fit width and center vertically
          drawH = targetWidth / srcAspect;
          drawY = (targetHeight - drawH) / 2;
        } else {
          // Source is taller or exact 9:16, fit height and center horizontally
          drawW = targetHeight * srcAspect;
          drawX = (targetWidth - drawW) / 2;
        }

        // High quality bicubic scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        // Convert to WebP (fallback to JPEG if webp not supported)
        const mimeType = canvas.toDataURL('image/webp').startsWith('data:image/webp')
          ? 'image/webp'
          : 'image/jpeg';
        const fileExt = mimeType === 'image/webp' ? '.webp' : '.jpg';

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas compression to blob failed'));
              return;
            }

            const cleanBaseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const compressedFileName = `${cleanBaseName}_9x16${fileExt}`;

            const compressedFile = new File([blob], compressedFileName, {
              type: mimeType,
              lastModified: Date.now(),
            });

            const compressedDataUrl = canvas.toDataURL(mimeType, quality);
            const compressedSizeFormatted = formatBytes(compressedFile.size);

            resolve({
              file: compressedFile,
              dataUrl: compressedDataUrl,
              originalSizeFormatted,
              compressedSizeFormatted,
              width: targetWidth,
              height: targetHeight,
            });
          },
          mimeType,
          quality
        );
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
