import React, { useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Type, Palette, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const fontFamilies = [
  { value: 'Inter', label: 'Inter (Clean)' },
  { value: 'Poppins', label: 'Poppins (Modern)' },
  { value: 'serif', label: 'Serif (Classic)' },
  { value: 'Playfair Display', label: 'Playfair (Elegant)' },
  { value: 'Roboto Mono', label: 'Roboto Mono (Tech)' },
  { value: 'Dancing Script', label: 'Dancing Script (Script)' },
  { value: 'Bebas Neue', label: 'Bebas Neue (Bold)' }
];

const fontWeights = [
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
  { value: '900', label: 'Black' }
];

const textAlignments = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' }
] as const;

const TextPanel = () => {
  const { canvasWidth, canvasHeight, addLayer, selectedLayerId, layers, updateLayer } = useEditorStore();
  const [newText, setNewText] = useState('Your Text Here');
  const [textColor, setTextColor] = useState('#000000');
  const [strokeColor, setStrokeColor] = useState('#ffffff');

  const selectedLayer = layers.find(layer => layer.id === selectedLayerId && layer.type === 'text') as any;

  const addTextLayer = () => {
    const textLayer = {
      id: `text-${Date.now()}`,
      type: 'text' as const,
      x: canvasWidth / 2 - 100,
      y: canvasHeight / 2 - 20,
      width: 200,
      height: 40,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: Math.max(0, ...layers.map(l => l.zIndex)) + 1,
      text: newText,
      fontFamily: 'Inter',
      fontSize: 32,
      fontWeight: '600',
      color: textColor,
      textAlign: 'center' as const,
      letterSpacing: 0,
      lineHeight: 1.2,
      hasDropShadow: false,
      hasStroke: false,
      strokeColor: strokeColor
    };

    addLayer(textLayer);
    setNewText('Your Text Here');
  };

  const updateSelectedText = (updates: any) => {
    if (selectedLayer) {
      updateLayer(selectedLayer.id, updates);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Add New Text */}
      <div className="space-y-3">
        <h4 className="font-semibold">Add Text</h4>
        <div className="space-y-2">
          <Input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Enter your text"
            className="w-full"
          />
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: textColor }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <HexColorPicker color={textColor} onChange={setTextColor} />
              </PopoverContent>
            </Popover>
            <Button onClick={addTextLayer} className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Add Text
            </Button>
          </div>
        </div>
      </div>

      {/* Text Settings */}
      {selectedLayer && (
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold flex items-center gap-2">
            <Type className="h-4 w-4" />
            Text Settings
          </h4>

          {/* Text Content */}
          <div className="space-y-2">
            <Label>Text Content</Label>
            <Input
              value={selectedLayer.text}
              onChange={(e) => updateSelectedText({ text: e.target.value })}
              placeholder="Enter your text"
            />
          </div>

          {/* Font Family */}
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select
              value={selectedLayer.fontFamily}
              onValueChange={(value) => updateSelectedText({ fontFamily: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Weight */}
          <div className="space-y-2">
            <Label>Font Weight</Label>
            <Select
              value={selectedLayer.fontWeight}
              onValueChange={(value) => updateSelectedText({ fontWeight: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontWeights.map((weight) => (
                  <SelectItem key={weight.value} value={weight.value}>
                    {weight.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label>Font Size: {selectedLayer.fontSize}px</Label>
            <Slider
              value={[selectedLayer.fontSize]}
              onValueChange={([value]) => updateSelectedText({ fontSize: value })}
              min={12}
              max={120}
              step={1}
            />
          </div>

          {/* Text Color */}
          <div className="space-y-2">
            <Label>Text Color</Label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: selectedLayer.color }}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                  <HexColorPicker
                    color={selectedLayer.color}
                    onChange={(color) => updateSelectedText({ color })}
                  />
                </PopoverContent>
              </Popover>
              <Input
                value={selectedLayer.color}
                onChange={(e) => updateSelectedText({ color: e.target.value })}
                placeholder="#000000"
                className="font-mono text-sm flex-1"
              />
            </div>
          </div>

          {/* Text Alignment */}
          <div className="space-y-2">
            <Label>Text Alignment</Label>
            <div className="flex gap-1">
              {textAlignments.map((align) => (
                <Button
                  key={align.value}
                  variant={selectedLayer.textAlign === align.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => updateSelectedText({ textAlign: align.value })}
                  className="flex-1"
                >
                  {align.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Letter Spacing */}
          <div className="space-y-2">
            <Label>Letter Spacing: {selectedLayer.letterSpacing}px</Label>
            <Slider
              value={[selectedLayer.letterSpacing]}
              onValueChange={([value]) => updateSelectedText({ letterSpacing: value })}
              min={-5}
              max={20}
              step={0.5}
            />
          </div>

          {/* Text Effects */}
          <div className="space-y-3">
            <Label>Text Effects</Label>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="drop-shadow" className="text-sm">Drop Shadow</Label>
              <Switch
                id="drop-shadow"
                checked={selectedLayer.hasDropShadow}
                onCheckedChange={(checked) => updateSelectedText({ hasDropShadow: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="stroke" className="text-sm">Text Stroke</Label>
              <Switch
                id="stroke"
                checked={selectedLayer.hasStroke}
                onCheckedChange={(checked) => updateSelectedText({ hasStroke: checked })}
              />
            </div>

            {selectedLayer.hasStroke && (
              <div className="ml-4 space-y-2">
                <Label>Stroke Color</Label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: selectedLayer.strokeColor }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto">
                      <HexColorPicker
                        color={selectedLayer.strokeColor}
                        onChange={(color) => updateSelectedText({ strokeColor: color })}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    value={selectedLayer.strokeColor}
                    onChange={(e) => updateSelectedText({ strokeColor: e.target.value })}
                    className="font-mono text-sm flex-1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!selectedLayer && (
        <div className="text-center py-8 text-muted-foreground">
          <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Add text or select existing text to edit</p>
        </div>
      )}

      <div className="mt-6 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
        <strong>✍️ Typography Tips:</strong> Use contrasting colors for readability. Add stroke for text over photos. Keep font sizes above 24px for print clarity.
      </div>
    </div>
  );
};

export default TextPanel;