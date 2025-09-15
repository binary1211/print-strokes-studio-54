import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { cn } from '@/lib/utils';

const frameOptions = [
  { id: 'none', name: 'No Frame', preview: '/api/placeholder/120/120', url: '' },
  { id: 'acrylic-modern', name: 'Acrylic Modern', preview: '/api/placeholder/120/120', url: '/frames/acrylic-modern.png' },
  { id: 'aluminum-sleek', name: 'Aluminum Sleek', preview: '/api/placeholder/120/120', url: '/frames/aluminum-sleek.png' },
  { id: 'wood-classic', name: 'Wood Classic', preview: '/api/placeholder/120/120', url: '/frames/wood-classic.png' },
  { id: 'minimal-white', name: 'Minimal White', preview: '/api/placeholder/120/120', url: '/frames/minimal-white.png' },
  { id: 'vintage-ornate', name: 'Vintage Ornate', preview: '/api/placeholder/120/120', url: '/frames/vintage-ornate.png' },
  { id: 'gallery-black', name: 'Gallery Black', preview: '/api/placeholder/120/120', url: '/frames/gallery-black.png' },
  { id: 'rustic-barn', name: 'Rustic Barn', preview: '/api/placeholder/120/120', url: '/frames/rustic-barn.png' }
];

const FramesPanel = () => {
  const { canvasWidth, canvasHeight, addLayer, layers, updateLayer } = useEditorStore();

  const applyFrame = (frame: typeof frameOptions[0]) => {
    // Remove existing frame layer
    const existingFrame = layers.find(layer => layer.type === 'frame');
    if (existingFrame) {
      updateLayer(existingFrame.id, { visible: false });
    }

    // Add new frame if not 'none'
    if (frame.id !== 'none' && frame.url) {
      const frameLayer = {
        id: `frame-${Date.now()}`,
        type: 'frame' as const,
        x: 0,
        y: 0,
        width: canvasWidth,
        height: canvasHeight,
        rotation: 0,
        opacity: 1,
        visible: true,
        zIndex: 1000, // Frames should always be on top
        frameUrl: frame.url,
        frameName: frame.name
      };

      addLayer(frameLayer);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h4 className="font-semibold mb-3">Choose Frame Style</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Select a frame to complement your photo. Frames adapt to your chosen product size.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {frameOptions.map((frame) => (
          <button
            key={frame.id}
            onClick={() => applyFrame(frame)}
            className={cn(
              "group relative p-3 border-2 rounded-xl transition-all duration-200",
              "hover:border-printStrokes-primary hover:shadow-md hover:scale-105",
              "focus:outline-none focus:ring-2 focus:ring-printStrokes-primary focus:ring-offset-2",
              "border-border bg-card"
            )}
          >
            {/* Frame Preview */}
            <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden relative">
              <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded" />
              {frame.url && (
                <div className="absolute inset-0 border-4 border-gray-800 rounded-lg opacity-60" />
              )}
              <div className="absolute bottom-1 right-1 text-xs font-bold text-white bg-black/50 px-1 rounded">
                {frame.id === 'none' ? '○' : '□'}
              </div>
            </div>

            {/* Frame Name */}
            <div className="text-xs font-medium text-center group-hover:text-printStrokes-primary transition-colors">
              {frame.name}
            </div>

            {/* Selection Indicator */}
            <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-white bg-printStrokes-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 bg-white rounded-full m-0.5" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
        <strong>💡 Pro Tip:</strong> Frames are applied as overlays and automatically scale to your product dimensions. Choose lighter frames for darker photos and vice versa for the best contrast.
      </div>
    </div>
  );
};

export default FramesPanel;