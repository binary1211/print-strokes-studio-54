import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileUploaderProps {
  onFile: (file: File, url: string) => void;
  onRemove?: () => void;
  accept?: Record<string, string[]>;
  maxSizeMB?: number;
  className?: string;
  currentFile?: string | null;
}

const FileUploader = ({
  onFile,
  onRemove,
  accept = { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
  maxSizeMB = 10,
  className,
  currentFile
}: FileUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentFile || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Reset error state
    setError(null);

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      toast.error(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      toast.error('Please upload a valid image file (JPG, PNG, WebP)');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Create object URL for preview
      const url = URL.createObjectURL(file);
      setPreview(url);
      
      // Complete upload
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        onFile(file, url);
        setIsUploading(false);
        toast.success('Image uploaded successfully!');
      }, 1000);

    } catch (err) {
      setIsUploading(false);
      setError('Failed to upload image');
      toast.error('Failed to upload image. Please try again.');
    }
  }, [onFile, maxSizeMB]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled: isUploading
  });

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setError(null);
    onRemove?.();
  };

  if (preview && !isUploading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="relative group">
          <div className="aspect-video w-full max-w-xs mx-auto rounded-2xl overflow-hidden bg-muted border-2 border-dashed border-border">
            <img
              src={preview}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            onClick={handleRemove}
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 justify-center">
          <Button
            variant="default"
            onClick={() => {
              // This will be handled by parent component to open editor
            }}
            className="flex items-center gap-2 bg-printStrokes-primary hover:bg-printStrokes-primary/90"
          >
            <Image className="h-4 w-4" />
            Edit Photo
          </Button>
          <Button
            variant="ghost"
            onClick={handleRemove}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Replace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer transition-all duration-200",
          "border-2 border-dashed rounded-2xl p-8 text-center",
          "hover:border-printStrokes-primary hover:bg-printStrokes-primary/5",
          isDragActive
            ? "border-printStrokes-primary bg-printStrokes-primary/5 scale-105"
            : error
            ? "border-destructive bg-destructive/5"
            : "border-muted-foreground/25 bg-muted/20",
          isUploading && "pointer-events-none"
        )}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-printStrokes-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-printStrokes-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Uploading...</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-printStrokes-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-printStrokes-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-printStrokes-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">
                {isDragActive ? "Drop your photo here" : "Upload Your Photo"}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, WebP • Max {maxSizeMB}MB • Recommended: 300 DPI
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
        <strong>💡 Pro tip:</strong> For best print quality, upload high-resolution images (at least 300 DPI). 
        If uploading HEIC files from iPhone, please convert to JPG first.
      </div>
    </div>
  );
};

export default FileUploader;