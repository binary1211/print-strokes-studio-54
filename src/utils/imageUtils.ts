/**
 * Image processing utilities for the photo editor
 */

export interface FilterOptions {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  shadows: number;
  highlights: number;
  sharpness: number;
}

/**
 * Apply filters to a canvas context
 */
export const applyFiltersToCanvas = (
  canvas: HTMLCanvasElement,
  filters: FilterOptions
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Build CSS filter string
  const filterParts: string[] = [];
  
  if (filters.brightness !== 0) {
    filterParts.push(`brightness(${100 + filters.brightness}%)`);
  }
  
  if (filters.contrast !== 0) {
    filterParts.push(`contrast(${100 + filters.contrast}%)`);
  }
  
  if (filters.saturation !== 0) {
    filterParts.push(`saturate(${100 + filters.saturation}%)`);
  }
  
  if (filters.sharpness !== 0) {
    // Sharpness approximation using contrast
    filterParts.push(`contrast(${100 + Math.abs(filters.sharpness) * 0.5}%)`);
  }

  ctx.filter = filterParts.join(' ') || 'none';
};

/**
 * Compose all layers to a single canvas
 */
export const composeLayersToCanvas = (
  layers: any[],
  canvasSize: { width: number; height: number },
  filters?: FilterOptions
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Apply global filters if provided
  if (filters) {
    applyFiltersToCanvas(canvas, filters);
  }

  // Sort layers by z-index
  const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

  sortedLayers.forEach(layer => {
    if (!layer.visible) return;

    ctx.save();
    
    // Apply layer transforms
    ctx.globalAlpha = layer.opacity || 1;
    ctx.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
    if (layer.rotation) {
      ctx.rotate((layer.rotation * Math.PI) / 180);
    }
    ctx.translate(-layer.width / 2, -layer.height / 2);

    if (layer.type === 'image') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = layer.url;
      ctx.drawImage(img, 0, 0, layer.width, layer.height);
    } else if (layer.type === 'text') {
      ctx.font = `${layer.fontWeight || 'normal'} ${layer.fontSize}px ${layer.fontFamily}`;
      ctx.fillStyle = layer.color;
      ctx.textAlign = layer.textAlign || 'left';
      
      if (layer.hasDropShadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }
      
      if (layer.hasStroke) {
        ctx.strokeStyle = layer.strokeColor;
        ctx.lineWidth = 2;
        ctx.strokeText(layer.text, 0, layer.fontSize);
      }
      
      ctx.fillText(layer.text, 0, layer.fontSize);
    } else if (layer.type === 'sticker') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = layer.stickerUrl;
      ctx.drawImage(img, 0, 0, layer.width, layer.height);
    } else if (layer.type === 'frame') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = layer.frameUrl;
      ctx.drawImage(img, 0, 0, layer.width, layer.height);
    }

    ctx.restore();
  });

  return canvas;
};

/**
 * Estimate print resolution based on image dimensions
 */
export const estimatePrintResolution = (
  imageDimensions: { width: number; height: number },
  printSizeInches: { width: number; height: number }
): { dpi: number; quality: 'high' | 'medium' | 'low' } => {
  const dpiX = imageDimensions.width / printSizeInches.width;
  const dpiY = imageDimensions.height / printSizeInches.height;
  const dpi = Math.min(dpiX, dpiY);
  
  let quality: 'high' | 'medium' | 'low' = 'low';
  if (dpi >= 300) quality = 'high';
  else if (dpi >= 150) quality = 'medium';
  
  return { dpi: Math.round(dpi), quality };
};

/**
 * Convert data URL to Blob
 */
export const dataURLToBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

/**
 * Load image from URL and return HTMLImageElement
 */
export const loadImageFromUrl = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Resize image while maintaining aspect ratio
 */
export const resizeImage = (
  canvas: HTMLCanvasElement,
  maxWidth: number,
  maxHeight: number
): HTMLCanvasElement => {
  const { width, height } = canvas;
  
  let newWidth = width;
  let newHeight = height;
  
  if (width > maxWidth) {
    newWidth = maxWidth;
    newHeight = (height * maxWidth) / width;
  }
  
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = (newWidth * maxHeight) / newHeight;
  }
  
  const resizedCanvas = document.createElement('canvas');
  resizedCanvas.width = newWidth;
  resizedCanvas.height = newHeight;
  
  const ctx = resizedCanvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(canvas, 0, 0, newWidth, newHeight);
  }
  
  return resizedCanvas;
};