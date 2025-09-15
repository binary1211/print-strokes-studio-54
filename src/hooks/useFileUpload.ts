import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface UploadedFile {
  file: File;
  url: string;
  preview: string;
}

export const useFileUpload = (maxSizeMB: number = 10) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File, url: string) => {
    setUploadedFile({
      file,
      url,
      preview: url
    });
    setError(null);
  }, []);

  const removeFile = useCallback(() => {
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url);
    }
    setUploadedFile(null);
    setError(null);
  }, [uploadedFile]);

  const validateFile = useCallback((file: File): boolean => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      toast.error(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return false;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      toast.error('Please upload a valid image file (JPG, PNG, WebP)');
      return false;
    }

    return true;
  }, [maxSizeMB]);

  const estimatePrintResolution = useCallback((file: File): Promise<{ width: number; height: number; dpi: number; quality: 'high' | 'medium' | 'low' }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const dpi = Math.min(img.naturalWidth / 8, img.naturalHeight / 8) * 72; // Rough DPI calculation
        let quality: 'high' | 'medium' | 'low' = 'low';
        
        if (dpi >= 300) quality = 'high';
        else if (dpi >= 150) quality = 'medium';
        
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          dpi: Math.round(dpi),
          quality
        });
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });
  }, []);

  return {
    uploadedFile,
    isUploading,
    error,
    handleFile,
    removeFile,
    validateFile,
    estimatePrintResolution,
    setIsUploading,
    setError
  };
};