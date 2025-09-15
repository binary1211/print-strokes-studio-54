import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

const adjustmentControls = [
  { 
    key: 'brightness' as const, 
    label: 'Brightness', 
    min: -50, 
    max: 50, 
    step: 1,
    description: 'Make your photo lighter or darker'
  },
  { 
    key: 'contrast' as const, 
    label: 'Contrast', 
    min: -50, 
    max: 50, 
    step: 1,
    description: 'Adjust the difference between lights and darks'
  },
  { 
    key: 'saturation' as const, 
    label: 'Saturation', 
    min: -100, 
    max: 100, 
    step: 1,
    description: 'Control color intensity'
  },
  { 
    key: 'exposure' as const, 
    label: 'Exposure', 
    min: -50, 
    max: 50, 
    step: 1,
    description: 'Simulate camera exposure adjustment'
  },
  { 
    key: 'shadows' as const, 
    label: 'Shadows', 
    min: -50, 
    max: 50, 
    step: 1,
    description: 'Brighten or darken shadow areas'
  },
  { 
    key: 'highlights' as const, 
    label: 'Highlights', 
    min: -50, 
    max: 50, 
    step: 1,
    description: 'Adjust the brightest parts of your photo'
  },
  { 
    key: 'sharpness' as const, 
    label: 'Sharpness', 
    min: -50, 
    max: 50, 
    step: 1,
    description: 'Enhance or soften image details'
  }
];

const AdjustPanel = () => {
  const { filters, updateFilters, resetFilters } = useEditorStore();

  const handleSliderChange = (key: keyof typeof filters, value: number[]) => {
    updateFilters({ [key]: value[0] });
  };

  const hasAdjustments = adjustmentControls.some(control => 
    filters[control.key] !== 0
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold mb-1">Manual Adjustments</h4>
          <p className="text-sm text-muted-foreground">
            Fine-tune your photo with precision controls
          </p>
        </div>
        {hasAdjustments && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {adjustmentControls.map((control) => (
          <div key={control.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {control.label}
              </label>
              <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
                {filters[control.key] > 0 ? '+' : ''}{filters[control.key]}
              </div>
            </div>
            
            <Slider
              value={[filters[control.key]]}
              onValueChange={(value) => handleSliderChange(control.key, value)}
              min={control.min}
              max={control.max}
              step={control.step}
              className="w-full"
            />
            
            <p className="text-xs text-muted-foreground">
              {control.description}
            </p>
          </div>
        ))}
      </div>

      {/* Preset Suggestions */}
      <div className="mt-8 space-y-3">
        <h5 className="text-sm font-medium">Quick Presets</h5>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateFilters({ brightness: 20, contrast: 15, saturation: 10 })}
            className="text-xs h-8"
          >
            📸 Portrait
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateFilters({ brightness: 5, contrast: 25, saturation: 20 })}
            className="text-xs h-8"
          >
            🌄 Landscape
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateFilters({ brightness: -10, contrast: 30, shadows: 20 })}
            className="text-xs h-8"
          >
            🎭 Dramatic
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateFilters({ brightness: 15, saturation: -30, contrast: 5 })}
            className="text-xs h-8"
          >
            🕰️ Vintage
          </Button>
        </div>
      </div>

      <div className="mt-6 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
        <strong>🎨 Pro Technique:</strong> Start with exposure and highlights, then adjust contrast. Fine-tune with shadows and saturation last for professional results.
      </div>
    </div>
  );
};

export default AdjustPanel;