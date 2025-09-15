import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

const ProductImageGallery = ({ images, title }: ProductImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-muted rounded-xl overflow-hidden group">
        <img
          src={images[selectedImage]}
          alt={`${title} - Image ${selectedImage + 1}`}
          className={cn(
            "w-full h-full object-cover transition-transform duration-300",
            isZoomed && "scale-125"
          )}
          loading="lazy"
        />
        
        {/* Navigation Controls */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Zoom Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-all",
                selectedImage === index
                  ? "border-primary shadow-md"
                  : "border-transparent hover:border-border"
              )}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Product Features */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-sm font-medium">Premium Quality</div>
          <div className="text-xs text-muted-foreground">UV Resistant</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-sm font-medium">Fast Delivery</div>
          <div className="text-xs text-muted-foreground">3-5 Days</div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;