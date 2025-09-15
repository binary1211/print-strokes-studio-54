export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  materials: string[];
  variants: ProductVariant[];
  basePrice: number;
  personalizationOptions: string[];
  images: string[];
  tags: string[];
  stock: string;
  featured: boolean;
  personalization?: {
    supportsImage: boolean;
    supportsText: boolean;
    maxFileSizeMB: number;
    recommendedDPI: number;
  };
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  dimensions: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

export interface DesignLayer {
  id: string;
  type: 'image' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  visible: boolean;
  zIndex: number;
}

export interface ImageLayer extends DesignLayer {
  type: 'image';
  url: string;
  originalUrl: string;
  scale: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
  };
}

export interface TextLayer extends DesignLayer {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  letterSpacing: number;
  lineHeight: number;
  hasDropShadow: boolean;
  hasStroke: boolean;
  strokeColor: string;
}

export interface Design {
  id: string;
  productId: string;
  variantId: string;
  layers: (ImageLayer | TextLayer)[];
  canvasWidth: number;
  canvasHeight: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  design?: Design;
  price: number;
  thumbnail?: string;
  personalizationSummary?: string;
  previewUrl?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface PersonalizationState {
  currentDesign: Design | null;
  isCanvasReady: boolean;
  selectedLayerId: string | null;
  canvasZoom: number;
  canvasOffsetX: number;
  canvasOffsetY: number;
}