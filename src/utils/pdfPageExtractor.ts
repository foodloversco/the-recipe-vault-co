import * as pdfjsLib from 'pdfjs-dist';
import { RecipePage } from '../types';

// Configure local worker so it works on Vercel, localhost, and offline Android APK
pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.mjs';

export interface ExtractedPdfResult {
  totalPages: number;
  coverDataUrl: string;
  pages: RecipePage[];
}

/**
 * Load a PDF document from a URL or base64 data URI for live rendering in the 3D Flip Reader
 */
export async function loadPdfDocument(pdfUrl: string): Promise<pdfjsLib.PDFDocumentProxy> {
  const loadingTask = pdfjsLib.getDocument({
    url: pdfUrl,
    cMapUrl: 'https://unpkg.com/pdfjs-dist@4.10.38/cmaps/',
    cMapPacked: true,
  });
  return await loadingTask.promise;
}

/**
 * Render a single page (1-indexed) of a loaded PDF document to a crisp 9:16 Data URL
 */
export async function renderSinglePdfPage(
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  targetWidth: number = 900
): Promise<string> {
  const page = await pdfDoc.getPage(pageNumber);
  const unscaledViewport = page.getViewport({ scale: 1 });
  const scale = targetWidth / unscaledViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  await page.render({
    canvasContext: ctx,
    viewport,
  }).promise;

  // Prefer WebP for crisp text & small size, fallback to JPEG
  let dataUrl = canvas.toDataURL('image/webp', 0.86);
  if (!dataUrl.startsWith('data:image/webp')) {
    dataUrl = canvas.toDataURL('image/jpeg', 0.86);
  }
  return dataUrl;
}

/**
 * Extract pages from an uploaded PDF File in the Admin Portal
 */
export async function extractPagesFromPdfFile(
  file: File,
  bookTitle: string,
  onProgress?: (current: number, total: number) => void
): Promise<ExtractedPdfResult> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  const pages: RecipePage[] = [];
  let coverDataUrl = '';

  // Extract up to 80 pages at compact mobile scale so localStorage & R2 sync stay fast
  const maxExtract = Math.min(totalPages, 80);

  for (let i = 1; i <= maxExtract; i++) {
    if (onProgress) onProgress(i, maxExtract);
    const dataUrl = await renderSinglePdfPage(pdfDoc, i, i === 1 ? 900 : 720);
    if (i === 1) {
      coverDataUrl = dataUrl;
    }

    pages.push({
      id: `pdf-page-${i}`,
      pageNumber: i,
      title: i === 1 ? bookTitle : `${bookTitle} • Page ${i}`,
      subtitle: i === 1 ? 'Full 9:16 Cover Edition' : `Page ${i} of ${totalPages}`,
      category: i === 1 ? 'Cover' : 'Heritage Mains',
      isCover: i === 1,
      image: dataUrl,
      rawPdfPageUrl: dataUrl,
    });
  }

  return {
    totalPages,
    coverDataUrl,
    pages,
  };
}
