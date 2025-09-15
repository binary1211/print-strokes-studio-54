import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { ZoomIn, ZoomOut, Move, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CanvasStageProps {
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

const CanvasStage = ({ onCanvasReady }: CanvasStageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const {
    canvasWidth,
    canvasHeight,
    zoom,
    panX,
    panY,
    layers,
    selectedLayerId,
    filters,
    setZoom,
    setPan,
    resetView,
    selectLayer,
    updateLayer
  } = useEditorStore();

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && onCanvasReady) {
      onCanvasReady(canvasRef.current);
    }
  }, [onCanvasReady]);

  // Render canvas whenever layers or filters change
  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Set global filters
    const filterString = `
      brightness(${100 + filters.brightness}%)
      contrast(${100 + filters.contrast}%)
      saturate(${100 + filters.saturation}%)
    `.trim();
    ctx.filter = filterString;

    // Sort layers by zIndex
    const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

    // Render each layer
    for (const layer of sortedLayers) {
      if (!layer.visible) continue;

      ctx.save();
      
      // Apply layer transforms
      ctx.globalAlpha = layer.opacity || 1;
      
      // Translate to layer position
      ctx.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
      
      // Apply rotation
      if (layer.rotation) {
        ctx.rotate((layer.rotation * Math.PI) / 180);
      }

      // Render based on layer type
      switch (layer.type) {
        case 'image': {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          await new Promise<void>((resolve) => {
            img.onload = () => {
              ctx.drawImage(
                img,
                -layer.width / 2,
                -layer.height / 2,
                layer.width,
                layer.height
              );
              resolve();
            };
            img.onerror = () => resolve(); // Continue even if image fails to load
            img.src = layer.url;
          });
          break;
        }
        
        case 'text': {
          const textLayer = layer as any; // Type assertion for text properties
          ctx.font = `${textLayer.fontWeight || 'normal'} ${textLayer.fontSize || 24}px ${textLayer.fontFamily || 'Inter'}`;
          ctx.fillStyle = textLayer.color || '#000000';
          ctx.textAlign = textLayer.textAlign || 'center';
          ctx.textBaseline = 'middle';
          
          // Draw text stroke if enabled
          if (textLayer.hasStroke) {
            ctx.strokeStyle = textLayer.strokeColor || '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeText(textLayer.text || '', 0, 0);
          }
          
          // Draw text shadow if enabled
          if (textLayer.hasDropShadow) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
          }
          
          ctx.fillText(textLayer.text || '', 0, 0);
          break;
        }
        
        case 'sticker': {
          const stickerLayer = layer as any;
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          await new Promise<void>((resolve) => {
            img.onload = () => {
              ctx.drawImage(
                img,
                -layer.width / 2,
                -layer.height / 2,
                layer.width,
                layer.height
              );
              resolve();
            };
            img.onerror = () => resolve();
            img.src = stickerLayer.stickerUrl;
          });
          break;
        }
        
        case 'frame': {
          const frameLayer = layer as any;
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          await new Promise<void>((resolve) => {
            img.onload = () => {
              ctx.drawImage(
                img,
                -layer.width / 2,
                -layer.height / 2,
                layer.width,
                layer.height
              );
              resolve();
            };
            img.onerror = () => resolve();
            img.src = frameLayer.frameUrl;
          });
          break;
        }
      }

      ctx.restore();

      // Draw selection border if layer is selected
      if (selectedLayerId === layer.id) {
        ctx.save();
        ctx.strokeStyle = '#E93F31';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(layer.x - 2, layer.y - 2, layer.width + 4, layer.height + 4);
        
        // Draw resize handles
        const handleSize = 8;
        const handles = [
          { x: layer.x - handleSize/2, y: layer.y - handleSize/2 }, // top-left
          { x: layer.x + layer.width - handleSize/2, y: layer.y - handleSize/2 }, // top-right
          { x: layer.x - handleSize/2, y: layer.y + layer.height - handleSize/2 }, // bottom-left
          { x: layer.x + layer.width - handleSize/2, y: layer.y + layer.height - handleSize/2 }, // bottom-right
        ];
        
        ctx.fillStyle = '#E93F31';
        handles.forEach(handle => {
          ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
        });
        
        ctx.restore();
      }
    }
  }, [canvasWidth, canvasHeight, layers, selectedLayerId, filters]);

  // Re-render when dependencies change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Handle canvas click for layer selection
  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - panX;
    const y = (e.clientY - rect.top) / zoom - panY;

    // Find clicked layer (reverse order to check top layers first)
    const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);
    const clickedLayer = sortedLayers.find(layer => 
      layer.visible &&
      x >= layer.x && x <= layer.x + layer.width &&
      y >= layer.y && y <= layer.y + layer.height
    );

    selectLayer(clickedLayer?.id || null);
  };

  // Handle pan start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle click or Ctrl+click for pan
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
      e.preventDefault();
    }
  };

  // Handle pan
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan(e.clientX - dragStart.x, e.clientY - dragStart.y);
    }
  };

  // Handle pan end
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle zoom with wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, zoom * zoomFactor));
    setZoom(newZoom);
  };

  const handleZoomIn = () => setZoom(Math.min(5, zoom * 1.2));
  const handleZoomOut = () => setZoom(Math.max(0.1, zoom * 0.8));

  return (
    <div className="flex flex-col items-center gap-4 h-full">
      {/* Canvas Controls */}
      <div className="flex items-center gap-2 bg-card rounded-lg p-2 shadow-soft">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          disabled={zoom <= 0.1}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm font-mono min-w-[4rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          disabled={zoom >= 5}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={resetView}
          title="Reset View"
        >
          <Move className="h-4 w-4" />
        </Button>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className={cn(
          "flex-1 relative border-2 border-dashed border-muted-foreground/20 rounded-2xl overflow-hidden bg-white shadow-soft",
          isDragging && "cursor-grabbing"
        )}
        style={{
          width: Math.min(800, canvasWidth * zoom + 40),
          height: Math.min(600, canvasHeight * zoom + 40)
        }}
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className={cn(
            "absolute top-1/2 left-1/2 border border-border rounded-lg shadow-lg cursor-pointer",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
          style={{
            width: canvasWidth * zoom,
            height: canvasHeight * zoom,
            transform: `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px))`
          }}
        />
      </div>

      {/* Canvas Info */}
      <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
        {canvasWidth} × {canvasHeight}px • Hold Ctrl+click to pan • Scroll to zoom
      </div>
    </div>
  );
};

export default CanvasStage;