import { useState, useRef } from "react";
import { Upload, Type, Layers, Palette, Settings, Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button-enhanced";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Product, ProductVariant, Design, ImageLayer, TextLayer } from "@/types";
import { usePersonalization } from "@/contexts/AppContext";
import { fontUtils, mockApi } from "@/utils/mockApi";
import { toast } from "sonner";

interface PersonalizerControlsProps {
  product: Product;
  variant: ProductVariant;
}

const PersonalizerControls = ({ product, variant }: PersonalizerControlsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state, setCurrentDesign, setSelectedLayer } = usePersonalization();
  const [uploading, setUploading] = useState(false);
  const [newText, setNewText] = useState('Your Text Here');

  // Initialize design if not exists
  const initializeDesign = (): Design => {
    if (state.currentDesign) return state.currentDesign;
    
    const newDesign: Design = {
      id: '',
      productId: product.id,
      variantId: variant.id,
      layers: [],
      canvasWidth: variant.width || 400,
      canvasHeight: variant.height || 400,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setCurrentDesign(newDesign);
    return newDesign;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > (product.personalization?.maxFileSizeMB || 10) * 1024 * 1024) {
      toast.error(`File too large. Max size: ${product.personalization?.maxFileSizeMB || 10}MB`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      
      // Mock upload
      const { url } = await mockApi.uploadImage(file);
      
      // Create image layer
      const imageLayer: ImageLayer = {
        id: `img_${Date.now()}`,
        type: 'image',
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        rotation: 0,
        opacity: 1,
        visible: true,
        zIndex: 1,
        url,
        originalUrl: url,
        scale: 1,
        cropX: 0,
        cropY: 0,
        cropWidth: 200,
        cropHeight: 200,
        filters: {
          brightness: 100,
          contrast: 100,
          saturation: 100,
        },
      };

      // Add to design
      const design = initializeDesign();
      const updatedDesign = {
        ...design,
        layers: [...design.layers, imageLayer],
        updatedAt: new Date().toISOString(),
      };
      
      setCurrentDesign(updatedDesign);
      setSelectedLayer(imageLayer.id);
      toast.success('Image uploaded successfully!');
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddText = () => {
    if (!newText.trim()) return;

    const textLayer: TextLayer = {
      id: `text_${Date.now()}`,
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 2,
      text: newText,
      fontFamily: 'Poppins, sans-serif',
      fontSize: 24,
      fontWeight: '400',
      color: '#000000',
      textAlign: 'left',
      letterSpacing: 0,
      lineHeight: 1.2,
      hasDropShadow: false,
      hasStroke: false,
      strokeColor: '#ffffff',
    };

    const design = initializeDesign();
    const updatedDesign = {
      ...design,
      layers: [...design.layers, textLayer],
      updatedAt: new Date().toISOString(),
    };
    
    setCurrentDesign(updatedDesign);
    setSelectedLayer(textLayer.id);
    setNewText('Your Text Here');
    toast.success('Text added!');
  };

  const updateLayer = (layerId: string, updates: Partial<ImageLayer | TextLayer>) => {
    if (!state.currentDesign) return;

    const updatedLayers = state.currentDesign.layers.map(layer =>
      layer.id === layerId ? { ...layer, ...updates } as ImageLayer | TextLayer : layer
    );

    const updatedDesign = {
      ...state.currentDesign,
      layers: updatedLayers,
      updatedAt: new Date().toISOString(),
    };

    setCurrentDesign(updatedDesign);
  };

  const deleteLayer = (layerId: string) => {
    if (!state.currentDesign) return;

    const updatedLayers = state.currentDesign.layers.filter(layer => layer.id !== layerId);
    const updatedDesign = {
      ...state.currentDesign,
      layers: updatedLayers,
      updatedAt: new Date().toISOString(),
    };

    setCurrentDesign(updatedDesign);
    if (state.selectedLayerId === layerId) {
      setSelectedLayer(null);
    }
    toast.success('Layer deleted');
  };

  const selectedLayer = state.currentDesign?.layers.find(l => l.id === state.selectedLayerId);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {product.personalization?.supportsImage && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">Upload Image</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag & drop or click to upload
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Choose Image'}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Max {product.personalization?.maxFileSizeMB || 10}MB • JPG, PNG, HEIC
            </p>
          </div>
        </div>
      )}

      {/* Add Text Section */}
      {product.personalization?.supportsText && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">Add Text</Label>
          <div className="flex space-x-2">
            <Input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Enter your text..."
              className="flex-1"
            />
            <Button
              variant="brand-outline"
              onClick={handleAddText}
              disabled={!newText.trim()}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      )}

      {/* Layers Panel */}
      {state.currentDesign && state.currentDesign.layers.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold flex items-center">
            <Layers className="w-4 h-4 mr-2" />
            Layers ({state.currentDesign.layers.length})
          </Label>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {state.currentDesign.layers
              .sort((a, b) => b.zIndex - a.zIndex)
              .map((layer) => (
                <div
                  key={layer.id}
                  className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer transition-colors ${
                    state.selectedLayerId === layer.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                  onClick={() => setSelectedLayer(layer.id)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm font-medium">
                      {layer.type === 'image' ? '📷' : '📝'} {
                        layer.type === 'image' ? 'Image' : (layer as TextLayer).text.slice(0, 10)
                      }
                    </span>
                    {!layer.visible && (
                      <Badge variant="secondary" className="text-xs">Hidden</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateLayer(layer.id, { visible: !layer.visible });
                      }}
                      className="h-6 w-6 p-0"
                    >
                      {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLayer(layer.id);
                      }}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Layer Properties */}
      {selectedLayer && (
        <div className="space-y-4">
          <Separator />
          <Label className="text-base font-semibold flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Layer Properties
          </Label>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              {/* Position & Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">X Position</Label>
                  <Input
                    type="number"
                    value={selectedLayer.x}
                    onChange={(e) => updateLayer(selectedLayer.id, { x: parseInt(e.target.value) || 0 })}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Y Position</Label>
                  <Input
                    type="number"
                    value={selectedLayer.y}
                    onChange={(e) => updateLayer(selectedLayer.id, { y: parseInt(e.target.value) || 0 })}
                    className="h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Width</Label>
                  <Input
                    type="number"
                    value={selectedLayer.width}
                    onChange={(e) => updateLayer(selectedLayer.id, { width: parseInt(e.target.value) || 0 })}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Height</Label>
                  <Input
                    type="number"
                    value={selectedLayer.height}
                    onChange={(e) => updateLayer(selectedLayer.id, { height: parseInt(e.target.value) || 0 })}
                    className="h-8"
                  />
                </div>
              </div>

              {/* Rotation */}
              <div>
                <Label className="text-xs mb-2 block">Rotation: {selectedLayer.rotation || 0}°</Label>
                <Slider
                  value={[selectedLayer.rotation || 0]}
                  onValueChange={([value]) => updateLayer(selectedLayer.id, { rotation: value })}
                  min={-180}
                  max={180}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Opacity */}
              <div>
                <Label className="text-xs mb-2 block">Opacity: {Math.round((selectedLayer.opacity || 1) * 100)}%</Label>
                <Slider
                  value={[(selectedLayer.opacity || 1) * 100]}
                  onValueChange={([value]) => updateLayer(selectedLayer.id, { opacity: value / 100 })}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="style" className="space-y-4">
              {selectedLayer.type === 'text' && (
                <>
                  {/* Text Content */}
                  <div>
                    <Label className="text-xs">Text Content</Label>
                    <Input
                      value={(selectedLayer as TextLayer).text}
                      onChange={(e) => updateLayer(selectedLayer.id, { text: e.target.value })}
                      className="h-8"
                    />
                  </div>

                  {/* Font Family */}
                  <div>
                    <Label className="text-xs">Font Family</Label>
                    <Select
                      value={(selectedLayer as TextLayer).fontFamily}
                      onValueChange={(value) => updateLayer(selectedLayer.id, { fontFamily: value })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontUtils.availableFonts.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Font Size */}
                    <div>
                      <Label className="text-xs">Size</Label>
                      <Input
                        type="number"
                        value={(selectedLayer as TextLayer).fontSize}
                        onChange={(e) => updateLayer(selectedLayer.id, { fontSize: parseInt(e.target.value) || 12 })}
                        className="h-8"
                        min="8"
                        max="72"
                      />
                    </div>

                    {/* Font Weight */}
                    <div>
                      <Label className="text-xs">Weight</Label>
                      <Select
                        value={(selectedLayer as TextLayer).fontWeight}
                        onValueChange={(value) => updateLayer(selectedLayer.id, { fontWeight: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontUtils.fontWeights.map((weight) => (
                            <SelectItem key={weight.value} value={weight.value}>
                              {weight.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Text Color */}
                  <div>
                    <Label className="text-xs mb-2 block flex items-center">
                      <Palette className="w-3 h-3 mr-1" />
                      Text Color
                    </Label>
                    <div className="grid grid-cols-6 gap-2 mb-2">
                      {fontUtils.presetColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateLayer(selectedLayer.id, { color })}
                          className="w-6 h-6 rounded border-2 hover:scale-110 transition-transform"
                          style={{ 
                            backgroundColor: color,
                            borderColor: (selectedLayer as TextLayer).color === color ? '#E93F31' : '#e5e7eb'
                          }}
                        />
                      ))}
                    </div>
                    <Input
                      type="color"
                      value={(selectedLayer as TextLayer).color}
                      onChange={(e) => updateLayer(selectedLayer.id, { color: e.target.value })}
                      className="h-8"
                    />
                  </div>
                </>
              )}

              {selectedLayer.type === 'image' && (
                <>
                  {/* Image Filters */}
                  <div className="space-y-3">
                    <Label className="text-xs">Image Adjustments</Label>
                    
                    <div>
                      <Label className="text-xs mb-1 block">
                        Brightness: {(selectedLayer as ImageLayer).filters.brightness}%
                      </Label>
                      <Slider
                        value={[(selectedLayer as ImageLayer).filters.brightness]}
                        onValueChange={([value]) => {
                          const filters = { ...(selectedLayer as ImageLayer).filters, brightness: value };
                          updateLayer(selectedLayer.id, { filters });
                        }}
                        min={0}
                        max={200}
                        step={5}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs mb-1 block">
                        Contrast: {(selectedLayer as ImageLayer).filters.contrast}%
                      </Label>
                      <Slider
                        value={[(selectedLayer as ImageLayer).filters.contrast]}
                        onValueChange={([value]) => {
                          const filters = { ...(selectedLayer as ImageLayer).filters, contrast: value };
                          updateLayer(selectedLayer.id, { filters });
                        }}
                        min={0}
                        max={200}
                        step={5}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs mb-1 block">
                        Saturation: {(selectedLayer as ImageLayer).filters.saturation}%
                      </Label>
                      <Slider
                        value={[(selectedLayer as ImageLayer).filters.saturation]}
                        onValueChange={([value]) => {
                          const filters = { ...(selectedLayer as ImageLayer).filters, saturation: value };
                          updateLayer(selectedLayer.id, { filters });
                        }}
                        min={0}
                        max={200}
                        step={5}
                      />
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="effects" className="space-y-4">
              {selectedLayer.type === 'text' && (
                <>
                  {/* Text Effects */}
                  <div className="space-y-3">
                    <Label className="text-xs">Text Effects</Label>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Drop Shadow</Label>
                      <Button
                        variant={(selectedLayer as TextLayer).hasDropShadow ? "brand" : "outline"}
                        size="sm"
                        onClick={() => updateLayer(selectedLayer.id, { hasDropShadow: !(selectedLayer as TextLayer).hasDropShadow })}
                      >
                        {(selectedLayer as TextLayer).hasDropShadow ? 'On' : 'Off'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Text Stroke</Label>
                      <Button
                        variant={(selectedLayer as TextLayer).hasStroke ? "brand" : "outline"}
                        size="sm"
                        onClick={() => updateLayer(selectedLayer.id, { hasStroke: !(selectedLayer as TextLayer).hasStroke })}
                      >
                        {(selectedLayer as TextLayer).hasStroke ? 'On' : 'Off'}
                      </Button>
                    </div>

                    {(selectedLayer as TextLayer).hasStroke && (
                      <div>
                        <Label className="text-xs">Stroke Color</Label>
                        <Input
                          type="color"
                          value={(selectedLayer as TextLayer).strokeColor}
                          onChange={(e) => updateLayer(selectedLayer.id, { strokeColor: e.target.value })}
                          className="h-8"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
              
              <div className="text-xs text-muted-foreground">
                More effects coming soon...
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
        💡 <strong>Tips:</strong> Click on canvas elements to select them. Use the tabs above to customize colors, fonts, and effects.
      </div>
    </div>
  );
};

export default PersonalizerControls;