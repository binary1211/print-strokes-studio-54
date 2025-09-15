import { Product } from "@/types";
import productsData from "@/data/products.json";

// Mock API utilities
export const mockApi = {
  // Get single product
  getProduct: async (id: string): Promise<Product | null> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    const product = productsData.find(p => p.id === id);
    if (!product) return null;

    // Enhance product with personalization data
    return {
      ...product,
      variants: product.sizes.map((size, index) => ({
        id: `v${index + 1}`,
        name: size.name,
        price: size.price,
        dimensions: size.dimensions,
        width: size.name.includes('x') ? parseInt(size.name.split('x')[0]) * 25 : 300,
        height: size.name.includes('x') ? parseInt(size.name.split('x')[1]) * 25 : 300,
      })),
      personalization: {
        supportsImage: product.personalizationOptions.includes('photo'),
        supportsText: product.personalizationOptions.includes('text'),
        maxFileSizeMB: 10,
        recommendedDPI: 300,
      },
    };
  },

  // Upload image (mock)
  uploadImage: async (file: File): Promise<{ url: string; thumbnailUrl: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload
    
    // Create object URL for preview
    const url = URL.createObjectURL(file);
    
    return {
      url,
      thumbnailUrl: url, // In real app, this would be a smaller version
    };
  },

  // Save design (mock)
  saveDesign: async (designData: any): Promise<{ designId: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const designId = `design_${Date.now()}`;
    
    // Save to localStorage (mock backend)
    const savedDesigns = JSON.parse(localStorage.getItem('saved_designs') || '[]');
    savedDesigns.push({ id: designId, ...designData, createdAt: new Date().toISOString() });
    localStorage.setItem('saved_designs', JSON.stringify(savedDesigns));
    
    return { designId };
  },

  // Create order (mock)
  createOrder: async (orderData: any): Promise<{ orderId: string; confirmationNumber: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const orderId = `order_${Date.now()}`;
    const confirmationNumber = `PS${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Save to localStorage (mock backend)
    const orders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    orders.push({
      id: orderId,
      confirmationNumber,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    });
    localStorage.setItem('user_orders', JSON.stringify(orders));
    
    return { orderId, confirmationNumber };
  },

  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const lowerQuery = query.toLowerCase();
    return productsData
      .filter(product => 
        product.title.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        product.category.toLowerCase().includes(lowerQuery)
      )
      .map(product => ({
        ...product,
        variants: product.sizes.map((size, index) => ({
          id: `v${index + 1}`,
          name: size.name,
          price: size.price,
          dimensions: size.dimensions,
          width: size.name.includes('x') ? parseInt(size.name.split('x')[0]) * 25 : 300,
          height: size.name.includes('x') ? parseInt(size.name.split('x')[1]) * 25 : 300,
        })),
        personalization: {
          supportsImage: product.personalizationOptions.includes('photo'),
          supportsText: product.personalizationOptions.includes('text'),
          maxFileSizeMB: 10,
          recommendedDPI: 300,
        },
      }));
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return productsData
      .filter(product => product.category.toLowerCase() === category.toLowerCase())
      .map(product => ({
        ...product,
        variants: product.sizes.map((size, index) => ({
          id: `v${index + 1}`,
          name: size.name,
          price: size.price,
          dimensions: size.dimensions,
          width: size.name.includes('x') ? parseInt(size.name.split('x')[0]) * 25 : 300,
          height: size.name.includes('x') ? parseInt(size.name.split('x')[1]) * 25 : 300,
        })),
        personalization: {
          supportsImage: product.personalizationOptions.includes('photo'),
          supportsText: product.personalizationOptions.includes('text'),
          maxFileSizeMB: 10,
          recommendedDPI: 300,
        },
      }));
  },
};

// Canvas utilities for image processing
export const canvasUtils = {
  // Resize image to fit canvas while maintaining aspect ratio
  resizeImageToFit: (
    img: HTMLImageElement, 
    maxWidth: number, 
    maxHeight: number
  ): { width: number; height: number } => {
    const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
    return {
      width: img.width * ratio,
      height: img.height * ratio,
    };
  },

  // Create canvas from image with filters applied
  createFilteredCanvas: (
    img: HTMLImageElement,
    filters: { brightness: number; contrast: number; saturation: number }
  ): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Apply filters using CSS filter property
    ctx.filter = `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturation}%)
    `;
    
    ctx.drawImage(img, 0, 0);
    return canvas;
  },

  // Export canvas as blob
  exportCanvasAsBlob: async (canvas: HTMLCanvasElement, quality = 0.9): Promise<Blob> => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', quality);
    });
  },

  // Create thumbnail from canvas
  createThumbnail: async (canvas: HTMLCanvasElement, maxSize = 200): Promise<string> => {
    const thumbCanvas = document.createElement('canvas');
    const ctx = thumbCanvas.getContext('2d')!;
    
    const ratio = Math.min(maxSize / canvas.width, maxSize / canvas.height);
    thumbCanvas.width = canvas.width * ratio;
    thumbCanvas.height = canvas.height * ratio;
    
    ctx.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
    
    return thumbCanvas.toDataURL('image/jpeg', 0.8);
  },
};

// Font utilities
export const fontUtils = {
  availableFonts: [
    { name: 'Poppins', value: 'Poppins, sans-serif', category: 'sans' },
    { name: 'Inter', value: 'Inter, sans-serif', category: 'sans' },
    { name: 'Arial', value: 'Arial, sans-serif', category: 'sans' },
    { name: 'Helvetica', value: 'Helvetica, sans-serif', category: 'sans' },
    { name: 'Georgia', value: 'Georgia, serif', category: 'serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif', category: 'serif' },
    { name: 'Courier', value: 'Courier, monospace', category: 'mono' },
    { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive', category: 'display' },
  ],

  fontWeights: [
    { name: 'Light', value: '300' },
    { name: 'Normal', value: '400' },
    { name: 'Medium', value: '500' },
    { name: 'Semibold', value: '600' },
    { name: 'Bold', value: '700' },
  ],

  presetColors: [
    '#000000', '#FFFFFF', '#E93F31', '#275682',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  ],
};