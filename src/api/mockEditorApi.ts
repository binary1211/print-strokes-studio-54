/**
 * Mock API endpoints for photo editor functionality
 */

export interface MockFrame {
  id: string;
  name: string;
  url: string;
  preview: string;
  category: 'modern' | 'classic' | 'minimal' | 'ornate';
}

export interface MockSticker {
  id: string;
  name: string;
  url: string;
  category: 'icons' | 'shapes' | 'decorative' | 'seasonal';
}

export interface MockUploadResponse {
  id: string;
  url: string;
  originalName: string;
  size: number;
  mimeType: string;
}

export interface MockDesignSaveResponse {
  id: string;
  status: 'saved' | 'error';
  message: string;
}

// Mock frame data
const mockFrames: MockFrame[] = [
  {
    id: 'acrylic-modern',
    name: 'Acrylic Modern',
    url: '/frames/acrylic-modern.png',
    preview: '/api/placeholder/120/120',
    category: 'modern'
  },
  {
    id: 'aluminum-sleek',
    name: 'Aluminum Sleek',
    url: '/frames/aluminum-sleek.png',
    preview: '/api/placeholder/120/120',
    category: 'modern'
  },
  {
    id: 'wood-classic',
    name: 'Wood Classic',
    url: '/frames/wood-classic.png',
    preview: '/api/placeholder/120/120',
    category: 'classic'
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    url: '/frames/minimal-white.png',
    preview: '/api/placeholder/120/120',
    category: 'minimal'
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Ornate',
    url: '/frames/vintage-ornate.png',
    preview: '/api/placeholder/120/120',
    category: 'ornate'
  },
  {
    id: 'gallery-black',
    name: 'Gallery Black',
    url: '/frames/gallery-black.png',
    preview: '/api/placeholder/120/120',
    category: 'classic'
  },
  {
    id: 'rustic-barn',
    name: 'Rustic Barn',
    url: '/frames/rustic-barn.png',
    preview: '/api/placeholder/120/120',
    category: 'classic'
  },
  {
    id: 'floating-glass',
    name: 'Floating Glass',
    url: '/frames/floating-glass.png',
    preview: '/api/placeholder/120/120',
    category: 'modern'
  }
];

// Mock sticker data
const mockStickers: MockSticker[] = [
  {
    id: 'heart-red',
    name: 'Red Heart',
    url: '/stickers/heart-red.svg',
    category: 'shapes'
  },
  {
    id: 'star-gold',
    name: 'Gold Star',
    url: '/stickers/star-gold.svg',
    category: 'shapes'
  },
  {
    id: 'smile-yellow',
    name: 'Yellow Smile',
    url: '/stickers/smile-yellow.svg',
    category: 'icons'
  },
  {
    id: 'sun-orange',
    name: 'Orange Sun',
    url: '/stickers/sun-orange.svg',
    category: 'icons'
  },
  {
    id: 'moon-blue',
    name: 'Blue Moon',
    url: '/stickers/moon-blue.svg',
    category: 'icons'
  },
  {
    id: 'leaf-green',
    name: 'Green Leaf',
    url: '/stickers/leaf-green.svg',
    category: 'decorative'
  },
  {
    id: 'flower-pink',
    name: 'Pink Flower',
    url: '/stickers/flower-pink.svg',
    category: 'decorative'
  },
  {
    id: 'butterfly-purple',
    name: 'Purple Butterfly',
    url: '/stickers/butterfly-purple.svg',
    category: 'decorative'
  },
  {
    id: 'diamond-silver',
    name: 'Silver Diamond',
    url: '/stickers/diamond-silver.svg',
    category: 'shapes'
  },
  {
    id: 'crown-gold',
    name: 'Gold Crown',
    url: '/stickers/crown-gold.svg',
    category: 'decorative'
  },
  {
    id: 'arrow-left',
    name: 'Left Arrow',
    url: '/stickers/arrow-left.svg',
    category: 'icons'
  },
  {
    id: 'arrow-right',
    name: 'Right Arrow',
    url: '/stickers/arrow-right.svg',
    category: 'icons'
  },
  {
    id: 'check-green',
    name: 'Green Check',
    url: '/stickers/check-green.svg',
    category: 'icons'
  },
  {
    id: 'cross-red',
    name: 'Red Cross',
    url: '/stickers/cross-red.svg',
    category: 'icons'
  },
  {
    id: 'plus-blue',
    name: 'Blue Plus',
    url: '/stickers/plus-blue.svg',
    category: 'icons'
  },
  {
    id: 'snowflake-white',
    name: 'White Snowflake',
    url: '/stickers/snowflake-white.svg',
    category: 'seasonal'
  },
  {
    id: 'pumpkin-orange',
    name: 'Orange Pumpkin',
    url: '/stickers/pumpkin-orange.svg',
    category: 'seasonal'
  },
  {
    id: 'tree-green',
    name: 'Green Tree',
    url: '/stickers/tree-green.svg',
    category: 'seasonal'
  },
  {
    id: 'gift-red',
    name: 'Red Gift',
    url: '/stickers/gift-red.svg',
    category: 'seasonal'
  },
  {
    id: 'balloon-rainbow',
    name: 'Rainbow Balloon',
    url: '/stickers/balloon-rainbow.svg',
    category: 'decorative'
  }
];

export const mockEditorApi = {
  /**
   * Upload image file (simulated)
   */
  uploadImage: async (file: File): Promise<MockUploadResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (file.size > 10 * 1024 * 1024) {
          reject(new Error('File too large'));
          return;
        }

        if (!file.type.startsWith('image/')) {
          reject(new Error('Invalid file type'));
          return;
        }

        resolve({
          id: `upload-${Date.now()}`,
          url: URL.createObjectURL(file),
          originalName: file.name,
          size: file.size,
          mimeType: file.type
        });
      }, 1000 + Math.random() * 2000); // Simulate 1-3 second upload
    });
  },

  /**
   * Get available frames
   */
  getFrames: async (category?: string): Promise<MockFrame[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const frames = category 
          ? mockFrames.filter(f => f.category === category)
          : mockFrames;
        resolve(frames);
      }, 300);
    });
  },

  /**
   * Get available stickers
   */
  getStickers: async (category?: string): Promise<MockSticker[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stickers = category 
          ? mockStickers.filter(s => s.category === category)
          : mockStickers;
        resolve(stickers);
      }, 300);
    });
  },

  /**
   * Save design (simulated)
   */
  saveDesign: async (designData: any): Promise<MockDesignSaveResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!designData || !designData.layers) {
          reject(new Error('Invalid design data'));
          return;
        }

        // Simulate occasional save failure
        if (Math.random() < 0.05) {
          reject(new Error('Server error occurred'));
          return;
        }

        resolve({
          id: `design-${Date.now()}`,
          status: 'saved',
          message: 'Design saved successfully'
        });
      }, 800 + Math.random() * 1200); // Simulate 0.8-2 second save
    });
  },

  /**
   * Load design (simulated)
   */
  loadDesign: async (designId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!designId) {
          reject(new Error('Design ID required'));
          return;
        }

        // Simulate design not found
        if (Math.random() < 0.1) {
          reject(new Error('Design not found'));
          return;
        }

        resolve({
          id: designId,
          layers: [],
          canvasWidth: 800,
          canvasHeight: 600,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }, 500);
    });
  },

  /**
   * Generate preview thumbnail
   */
  generatePreview: async (designData: any): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real implementation, this would generate an actual preview
        // For now, return a placeholder data URL
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(0, 0, 200, 200);
          ctx.fillStyle = '#333';
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Preview', 100, 100);
        }

        resolve(canvas.toDataURL('image/png'));
      }, 1000);
    });
  }
};