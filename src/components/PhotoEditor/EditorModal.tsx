import React, { useEffect, useState } from 'react';
import { X, Save, Undo, Redo, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEditorStore } from '@/stores/editorStore';
import CanvasStage from './CanvasStage';
import Toolbar from './Toolbar';
import FramesPanel from './panels/FramesPanel';
import FiltersPanel from './panels/FiltersPanel';
import AdjustPanel from './panels/AdjustPanel';
import TextPanel from './panels/TextPanel';
import TextDesignPanel from './panels/TextDesignPanel';
import StickersPanel from './panels/StickersPanel';
import LayersPanel from './panels/LayersPanel';
import { Design } from '@/types';
import { toast } from 'sonner';

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialImage?: string;
  initialDesign?: Design | null;
  onSave: (designJSON: Design, previewDataUrl: string) => void;
  productVariant?: {
    width: number;
    height: number;
    aspectRatio?: number;
  };
}

const EditorModal = ({
  isOpen,
  onClose,
  initialImage,
  initialDesign,
  onSave,
  productVariant
}: EditorModalProps) => {
  const {
    activeTab,
    setActiveTab,
    canUndo,
    canRedo,
    undo,
    redo,
    resetEditor,
    loadDesign,
    exportDesign,
    addLayer,
    setCanvasSize
  } = useEditorStore();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Set canvas size based on product variant or default
      const width = productVariant?.width || 800;
      const height = productVariant?.height || 600;
      setCanvasSize(width, height);

      // Load initial design or create new with initial image
      if (initialDesign) {
        loadDesign(initialDesign);
      } else if (initialImage) {
        resetEditor();
        // Add the initial image as the base layer
        const imageLayer = {
          id: `image-${Date.now()}`,
          type: 'image' as const,
          x: 0,
          y: 0,
          width: width,
          height: height,
          rotation: 0,
          opacity: 1,
          visible: true,
          zIndex: 0,
          url: initialImage,
          originalUrl: initialImage,
          scale: 1,
          cropX: 0,
          cropY: 0,
          cropWidth: width,
          cropHeight: height,
          filters: {
            brightness: 0,
            contrast: 0,
            saturation: 0
          }
        };
        addLayer(imageLayer);
      }
    }
  }, [isOpen, initialImage, initialDesign, productVariant, loadDesign, resetEditor, addLayer, setCanvasSize]);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmed) return;
    }
    onClose();
    resetEditor();
  };

  const handleSave = async () => {
    try {
      const design = exportDesign();
      
      // Export canvas to data URL for preview
      if (canvasRef) {
        const dataUrl = canvasRef.toDataURL('image/png', 0.8);
        onSave(design, dataUrl);
        setHasUnsavedChanges(false);
        toast.success('Design saved successfully!');
        onClose();
      } else {
        toast.error('Canvas not ready. Please try again.');
      }
    } catch (error) {
      console.error('Error saving design:', error);
      toast.error('Failed to save design. Please try again.');
    }
  };

  const handleExport = () => {
    if (canvasRef) {
      const link = document.createElement('a');
      link.download = 'design-export.png';
      link.href = canvasRef.toDataURL('image/png', 1.0);
      link.click();
      toast.success('Design exported successfully!');
    }
  };

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'frames':
        return <FramesPanel />;
      case 'filters':
        return <FiltersPanel />;
      case 'adjust':
        return <AdjustPanel />;
      case 'text':
        return <TextPanel />;
      case 'textDesigns':
        return <TextDesignPanel />;
      case 'stickers':
        return <StickersPanel />;
      case 'layers':
        return <LayersPanel />;
      default:
        return <FramesPanel />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-background border-2">
        <DialogHeader className="p-4 pb-2 border-b bg-card">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-heading text-xl">Photo Editor</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={undo}
                disabled={!canUndo()}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={redo}
                disabled={!canRedo()}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExport}
                title="Export"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button onClick={handleSave} variant="default" className="px-6 bg-printStrokes-primary hover:bg-printStrokes-primary/90">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex h-[calc(95vh-80px)]">
          {/* Left Toolbar */}
          <div className="w-20 bg-card border-r flex flex-col">
            <Toolbar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Center Canvas */}
          <div className="flex-1 bg-muted/20 flex items-center justify-center p-4">
            <CanvasStage onCanvasReady={setCanvasRef} />
          </div>

          {/* Right Panel */}
          <div className="w-80 bg-card border-l flex flex-col">
            <div className="p-4 border-b bg-card/50">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {renderActivePanel()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditorModal;