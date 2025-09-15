import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { Heart, Star, Smile, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stickers = [
  { id: 'heart', name: 'Heart', icon: Heart, color: '#E93F31' },
  { id: 'star', name: 'Star', icon: Star, color: '#FFD700' },
  { id: 'smile', name: 'Smile', icon: Smile, color: '#FFA500' },
  { id: 'sun', name: 'Sun', icon: Sun, color: '#FF6B35' },
  { id: 'moon', name: 'Moon', icon: Moon, color: '#275682' }
];

const StickersPanel = () => {
  const { addLayer, canvasWidth, canvasHeight, layers } = useEditorStore();

  const addSticker = (sticker: typeof stickers[0]) => {
    const stickerLayer = {
      id: `sticker-${Date.now()}`,
      type: 'sticker' as const,
      x: canvasWidth / 2 - 25,
      y: canvasHeight / 2 - 25,
      width: 50,
      height: 50,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: Math.max(0, ...layers.map(l => l.zIndex)) + 1,
      stickerUrl: `/stickers/${sticker.id}.svg`,
      stickerName: sticker.name
    };

    addLayer(stickerLayer);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h4 className="font-semibold mb-3">Stickers & Icons</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Add fun stickers and icons to your design
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stickers.map((sticker) => {
          const IconComponent = sticker.icon;
          return (
            <Button
              key={sticker.id}
              variant="outline"
              onClick={() => addSticker(sticker)}
              className="aspect-square p-3 flex flex-col items-center gap-1"
            >
              <IconComponent className="h-6 w-6" style={{ color: sticker.color }} />
              <span className="text-xs">{sticker.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default StickersPanel;