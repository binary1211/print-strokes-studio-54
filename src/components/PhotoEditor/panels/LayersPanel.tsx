import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Trash2, Copy, MoveUp, MoveDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const LayersPanel = () => {
  const {
    layers,
    selectedLayerId,
    selectLayer,
    updateLayer,
    removeLayer,
    duplicateLayer,
    reorderLayer
  } = useEditorStore();

  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  const moveLayerUp = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      const newZIndex = Math.max(...layers.map(l => l.zIndex)) + 1;
      reorderLayer(layerId, newZIndex);
    }
  };

  const moveLayerDown = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      const newZIndex = Math.min(...layers.map(l => l.zIndex)) - 1;
      reorderLayer(layerId, newZIndex);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h4 className="font-semibold mb-3">Layers</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Manage and organize your design layers
        </p>
      </div>

      {layers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No layers yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedLayers.map((layer, index) => (
            <div
              key={layer.id}
              className={cn(
                "p-3 border rounded-lg cursor-pointer transition-all",
                selectedLayerId === layer.id
                  ? "border-printStrokes-secondary bg-printStrokes-secondary/5"
                  : "border-border hover:border-muted-foreground"
              )}
              onClick={() => selectLayer(layer.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateLayer(layer.id, { visible: !layer.visible });
                    }}
                    className="h-6 w-6"
                  >
                    {layer.visible ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3 opacity-50" />
                    )}
                  </Button>
                  <span className="text-sm font-medium">
                    {layer.type === 'image' && 'Image'}
                    {layer.type === 'text' && `Text: ${(layer as any).text?.slice(0, 10)}...`}
                    {layer.type === 'sticker' && `Sticker: ${(layer as any).stickerName}`}
                    {layer.type === 'frame' && `Frame: ${(layer as any).frameName}`}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayerUp(layer.id);
                    }}
                    className="h-6 w-6"
                  >
                    <MoveUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayerDown(layer.id);
                    }}
                    className="h-6 w-6"
                  >
                    <MoveDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateLayer(layer.id);
                  }}
                  className="h-6 text-xs px-2"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLayer(layer.id);
                  }}
                  className="h-6 text-xs px-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LayersPanel;