import { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button-enhanced";
import { Badge } from "@/components/ui/badge";
import { Product, ProductVariant, Design, ImageLayer, TextLayer } from "@/types";
import { usePersonalization } from "@/contexts/AppContext";
import { toast } from "sonner";

interface PersonalizerCanvasProps {
  product: Product;
  variant: ProductVariant;
}

const PersonalizerCanvas = ({ product, variant }: PersonalizerCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, setCanvasZoom, setCanvasReady } = usePersonalization();
  const [isInitialized, setIsInitialized] = useState(false);
  const [previewMode, setPreviewMode] = useState<'design' | 'realistic' | 'print'>('design');

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on variant
    canvas.width = variant.width || 400;
    canvas.height = variant.height || 400;

    // Initialize with product mockup
    drawCanvas();
    setCanvasReady(true);
    setIsInitialized(true);
  }, [variant, setCanvasReady]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = previewMode === 'realistic' ? '#f8f9fa' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Product mockup overlay (simulated)
    if (previewMode === 'realistic') {
      // Draw product outline/mockup
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      
      // Add mockup text
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`${product.title}`, canvas.width / 2, 30);
      ctx.fillText(`${variant.name}`, canvas.width / 2, canvas.height - 15);
    }

    // Draw design layers if they exist
    if (state.currentDesign) {
      state.currentDesign.layers
        .filter(layer => layer.visible)
        .sort((a, b) => a.zIndex - b.zIndex)
        .forEach(layer => {
          drawLayer(ctx, layer);
        });
    } else {
      // Placeholder text
      ctx.fillStyle = '#6b7280';
      ctx.font = '16px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('Start by uploading an image', canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillText('or adding text to begin', canvas.width / 2, canvas.height / 2 + 10);
    }

    // Preview mode overlay
    if (previewMode === 'print') {
      // Draw print area guidelines
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
      ctx.setLineDash([]);
    }
  };

  const drawLayer = (ctx: CanvasRenderingContext2D, layer: ImageLayer | TextLayer) => {
    ctx.save();

    // Apply transformations
    const centerX = layer.x + layer.width / 2;
    const centerY = layer.y + layer.height / 2;
    
    ctx.translate(centerX, centerY);
    if (layer.rotation) {
      ctx.rotate((layer.rotation * Math.PI) / 180);
    }
    ctx.translate(-centerX, -centerY);
    
    if (layer.opacity) {
      ctx.globalAlpha = layer.opacity;
    }

    if (layer.type === 'text') {
      const textLayer = layer as TextLayer;
      
      // Text styling
      ctx.fillStyle = textLayer.color;
      ctx.font = `${textLayer.fontWeight} ${textLayer.fontSize}px ${textLayer.fontFamily}`;
      ctx.textAlign = textLayer.textAlign;

      // Draw text shadow if enabled
      if (textLayer.hasDropShadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }

      // Draw text stroke if enabled
      if (textLayer.hasStroke) {
        ctx.strokeStyle = textLayer.strokeColor;
        ctx.lineWidth = 2;
        ctx.strokeText(textLayer.text, layer.x, layer.y + textLayer.fontSize);
      }

      // Draw text
      ctx.fillText(textLayer.text, layer.x, layer.y + textLayer.fontSize);
      
    } else if (layer.type === 'image') {
      const imageLayer = layer as ImageLayer;
      
      // Create image element and draw when loaded
      const img = new Image();
      img.onload = () => {
        // Apply filters if any
        if (imageLayer.filters) {
          ctx.filter = `brightness(${imageLayer.filters.brightness}%) contrast(${imageLayer.filters.contrast}%) saturate(${imageLayer.filters.saturation}%)`;
        }

        ctx.drawImage(
          img,
          imageLayer.cropX,
          imageLayer.cropY,
          imageLayer.cropWidth,
          imageLayer.cropHeight,
          layer.x,
          layer.y,
          layer.width,
          layer.height
        );
        
        ctx.filter = 'none';
      };
      img.src = imageLayer.url;
    }

    // Draw selection outline if this layer is selected
    if (state.selectedLayerId === layer.id) {
      ctx.strokeStyle = '#E93F31';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(layer.x - 2, layer.y - 2, layer.width + 4, layer.height + 4);
      ctx.setLineDash([]);
    }

    ctx.restore();
  };

  // Redraw canvas when design or settings change
  useEffect(() => {
    if (isInitialized) {
      drawCanvas();
    }
  }, [state.currentDesign, state.selectedLayerId, previewMode, isInitialized]);

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.25, Math.min(3, state.canvasZoom + delta));
    setCanvasZoom(newZoom);
  };

  const handleReset = () => {
    setCanvasZoom(1);
    toast.success('Canvas reset');
  };

  const handleSave = async () => {
    if (!state.currentDesign) {
      toast.error('Nothing to save');
      return;
    }

    try {
      // Mock save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Design saved successfully!');
    } catch (error) {
      toast.error('Failed to save design');
    }
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Export canvas as image
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${product.title}-design.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Design exported!');
      }
    }, 'image/png');
  };

  return (
    <div className="space-y-4">
      {/* Canvas Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold">Design Canvas</h3>
          <Badge variant="outline">{variant.name}</Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Preview Mode Tabs */}
          <div className="flex bg-muted rounded-md p-1">
            {[
              { key: 'design', label: 'Design' },
              { key: 'realistic', label: 'Realistic' },
              { key: 'print', label: 'Print' },
            ].map((mode) => (
              <button
                key={mode.key}
                onClick={() => setPreviewMode(mode.key as any)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  previewMode === mode.key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative bg-muted/30 rounded-xl p-6 border-2 border-dashed border-border">
        <div className="flex items-center justify-center">
          <div 
            className="relative bg-white rounded-lg shadow-lg overflow-hidden"
            style={{ 
              transform: `scale(${state.canvasZoom})`,
              transformOrigin: 'center center',
            }}
          >
            <canvas
              ref={canvasRef}
              className="block max-w-full max-h-[400px] cursor-crosshair"
              onClick={(e) => {
                // Handle canvas clicks for layer selection
                const rect = canvasRef.current?.getBoundingClientRect();
                if (rect) {
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  console.log('Canvas clicked at:', x, y);
                }
              }}
            />
            
            {/* Canvas overlay for guides */}
            {previewMode === 'design' && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Center guides */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/30 transform -translate-y-0.5" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/30 transform -translate-x-0.5" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Canvas Controls */}
      <div className="flex items-center justify-between">
        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(-0.25)}
            disabled={state.canvasZoom <= 0.25}
          >
            <ZoomOut className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium min-w-[4rem] text-center">
            {Math.round(state.canvasZoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(0.25)}
            disabled={state.canvasZoom >= 3}
          >
            <ZoomIn className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={!state.currentDesign}
          >
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
          <Button
            variant="brand-outline"
            size="sm"
            onClick={handleExport}
            disabled={!state.currentDesign}
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Canvas Info */}
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <div>Canvas: {variant.width || 400} × {variant.height || 400}px</div>
        <div>Click on elements to select • Use controls panel to customize</div>
      </div>
    </div>
  );
};

export default PersonalizerCanvas;