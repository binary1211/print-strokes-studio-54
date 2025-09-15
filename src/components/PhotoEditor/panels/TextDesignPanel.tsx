import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const textDesigns = [
  { id: 'badge', name: 'Circle Badge', style: { borderRadius: '50%', background: 'linear-gradient(45deg, #E93F31, #275682)' } },
  { id: 'ribbon', name: 'Ribbon Banner', style: { background: '#E93F31', color: 'white', padding: '8px 16px' } },
  { id: 'outline', name: 'Outline Text', style: { border: '2px solid #275682', color: '#275682' } },
  { id: 'shadow', name: 'Drop Shadow', style: { textShadow: '2px 2px 4px rgba(0,0,0,0.5)' } }
];

const TextDesignPanel = () => {
  const { addLayer, canvasWidth, canvasHeight, layers } = useEditorStore();

  const applyTextDesign = (design: typeof textDesigns[0]) => {
    const textLayer = {
      id: `text-design-${Date.now()}`,
      type: 'text' as const,
      x: canvasWidth / 2 - 100,
      y: canvasHeight / 2 - 20,
      width: 200,
      height: 40,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: Math.max(0, ...layers.map(l => l.zIndex)) + 1,
      text: 'Design Text',
      fontFamily: 'Poppins',
      fontSize: 32,
      fontWeight: '600',
      color: design.id === 'ribbon' ? '#ffffff' : '#275682',
      textAlign: 'center' as const,
      letterSpacing: 0,
      lineHeight: 1.2,
      hasDropShadow: design.id === 'shadow',
      hasStroke: design.id === 'outline',
      strokeColor: '#275682'
    };

    addLayer(textLayer);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Text Design Templates
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Pre-styled text templates for quick design creation
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {textDesigns.map((design) => (
          <Button
            key={design.id}
            variant="outline"
            onClick={() => applyTextDesign(design)}
            className="p-4 h-auto flex flex-col items-center gap-2"
          >
            <div className="text-sm font-medium">{design.name}</div>
            <div className="text-xs bg-muted px-2 py-1 rounded">Click to add</div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TextDesignPanel;