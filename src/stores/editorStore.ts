import { create } from 'zustand';
import { ImageLayer, TextLayer, Design } from '@/types';

export interface StickerLayer {
  id: string;
  type: 'sticker';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  visible: boolean;
  zIndex: number;
  stickerUrl: string;
  stickerName: string;
}

export interface FrameLayer {
  id: string;
  type: 'frame';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  visible: boolean;
  zIndex: number;
  frameUrl: string;
  frameName: string;
}

export type EditorLayer = ImageLayer | TextLayer | StickerLayer | FrameLayer;

export interface EditorFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  shadows: number;
  highlights: number;
  sharpness: number;
  filterName: string;
}

export interface EditorState {
  // Canvas
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  panX: number;
  panY: number;
  
  // Layers
  layers: any[];
  selectedLayerId: string | null;
  
  // Filters (applied to canvas globally)
  filters: EditorFilters;
  
  // History
  history: EditorLayer[][];
  historyIndex: number;
  
  // UI State
  activeTab: 'frames' | 'filters' | 'adjust' | 'text' | 'textDesigns' | 'stickers' | 'layers';
  isLoading: boolean;
}

export interface EditorActions {
  // Canvas actions
  setCanvasSize: (width: number, height: number) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;
  
  // Layer actions
  addLayer: (layer: EditorLayer) => void;
  updateLayer: (id: string, updates: Partial<EditorLayer>) => void;
  removeLayer: (id: string) => void;
  selectLayer: (id: string | null) => void;
  reorderLayer: (id: string, newZIndex: number) => void;
  duplicateLayer: (id: string) => void;
  
  // Filter actions
  updateFilters: (filters: Partial<EditorFilters>) => void;
  resetFilters: () => void;
  applyFilterPreset: (preset: string) => void;
  
  // History actions
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // UI actions
  setActiveTab: (tab: EditorState['activeTab']) => void;
  setLoading: (loading: boolean) => void;
  
  // Design actions
  loadDesign: (design: Design) => void;
  exportDesign: () => Design;
  resetEditor: () => void;
}

const defaultFilters: EditorFilters = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  shadows: 0,
  highlights: 0,
  sharpness: 0,
  filterName: 'none'
};

const filterPresets: Record<string, Partial<EditorFilters>> = {
  none: defaultFilters,
  vintage: { brightness: 10, contrast: 15, saturation: -20, exposure: 5, filterName: 'vintage' },
  vivid: { brightness: 5, contrast: 20, saturation: 30, filterName: 'vivid' },
  cool: { brightness: -5, contrast: 10, saturation: 10, filterName: 'cool' },
  warm: { brightness: 10, contrast: 5, saturation: 15, filterName: 'warm' },
  dramatic: { brightness: -10, contrast: 40, saturation: 20, shadows: -20, highlights: 15, filterName: 'dramatic' }
};

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  // Initial state
  canvasWidth: 800,
  canvasHeight: 600,
  zoom: 1,
  panX: 0,
  panY: 0,
  layers: [],
  selectedLayerId: null,
  filters: defaultFilters,
  history: [[]],
  historyIndex: 0,
  activeTab: 'frames',
  isLoading: false,

  // Canvas actions
  setCanvasSize: (width, height) => set({ canvasWidth: width, canvasHeight: height }),
  setZoom: (zoom) => set({ zoom }),
  setPan: (x, y) => set({ panX: x, panY: y }),
  resetView: () => set({ zoom: 1, panX: 0, panY: 0 }),

  // Layer actions
  addLayer: (layer) => {
    const state = get();
    const newLayers = [...state.layers, layer];
    set({ layers: newLayers, selectedLayerId: layer.id });
    get().pushHistory();
  },

  updateLayer: (id, updates) => {
    const state = get();
    const newLayers = state.layers.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    );
    set({ layers: newLayers });
  },

  removeLayer: (id) => {
    const state = get();
    const newLayers = state.layers.filter(layer => layer.id !== id);
    const selectedLayerId = state.selectedLayerId === id ? null : state.selectedLayerId;
    set({ layers: newLayers, selectedLayerId });
    get().pushHistory();
  },

  selectLayer: (id) => set({ selectedLayerId: id }),

  reorderLayer: (id, newZIndex) => {
    const state = get();
    const newLayers = state.layers.map(layer => 
      layer.id === id ? { ...layer, zIndex: newZIndex } : layer
    );
    set({ layers: newLayers });
    get().pushHistory();
  },

  duplicateLayer: (id) => {
    const state = get();
    const layer = state.layers.find(l => l.id === id);
    if (!layer) return;
    
    const duplicatedLayer = {
      ...layer,
      id: `${layer.id}-copy-${Date.now()}`,
      x: layer.x + 20,
      y: layer.y + 20,
      zIndex: Math.max(...state.layers.map(l => l.zIndex)) + 1
    };
    
    get().addLayer(duplicatedLayer);
  },

  // Filter actions
  updateFilters: (filters) => {
    const state = get();
    set({ filters: { ...state.filters, ...filters } });
  },

  resetFilters: () => set({ filters: defaultFilters }),

  applyFilterPreset: (preset) => {
    const presetFilters = filterPresets[preset];
    if (presetFilters) {
      set({ filters: { ...defaultFilters, ...presetFilters } });
    }
  },

  // History actions
  pushHistory: () => {
    const state = get();
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push([...state.layers]);
    
    // Limit history to 50 steps
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      set({ historyIndex: state.historyIndex + 1 });
    }
    
    set({ history: newHistory });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      const layers = [...state.history[newIndex]];
      set({ layers, historyIndex: newIndex, selectedLayerId: null });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      const layers = [...state.history[newIndex]];
      set({ layers, historyIndex: newIndex, selectedLayerId: null });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  // UI actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setLoading: (loading) => set({ isLoading: loading }),

  // Design actions
  loadDesign: (design) => {
    set({
      layers: design.layers,
      canvasWidth: design.canvasWidth,
      canvasHeight: design.canvasHeight,
      selectedLayerId: null,
      history: [design.layers],
      historyIndex: 0
    });
  },

  exportDesign: (): Design => {
    const state = get();
    return {
      id: `design-${Date.now()}`,
      productId: '',
      variantId: '',
      layers: state.layers,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  resetEditor: () => {
    set({
      layers: [],
      selectedLayerId: null,
      filters: defaultFilters,
      history: [[]],
      historyIndex: 0,
      zoom: 1,
      panX: 0,
      panY: 0,
      activeTab: 'frames'
    });
  }
}));