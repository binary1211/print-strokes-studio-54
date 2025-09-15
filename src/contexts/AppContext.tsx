import { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { CartItem, CartState, AuthState, User, PersonalizationState, Design } from "@/types";
import { toast } from "sonner";

// Cart Context
interface CartContextType {
  state: CartState;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  updateCartItemDesign: (itemId: string, design: Design) => void;
}

// Auth Context
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Personalization Context
interface PersonalizationContextType {
  state: PersonalizationState;
  setCurrentDesign: (design: Design | null) => void;
  setCanvasReady: (ready: boolean) => void;
  setSelectedLayer: (layerId: string | null) => void;
  setCanvasZoom: (zoom: number) => void;
  setCanvasOffset: (x: number, y: number) => void;
  saveDesign: (design: Design) => Promise<string>;
  loadDesign: (designId: string) => Promise<Design | null>;
}

// Reducers
const cartReducer = (state: CartState, action: any): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const newItem: CartItem = {
        ...action.payload,
        id: Date.now().toString(),
      };
      const newItems = [...state.items, newItem];
      return {
        ...state,
        items: newItems,
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };
    
    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        itemCount: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
        total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };
    
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.itemId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };
    
    case 'UPDATE_ITEM_DESIGN':
      const itemsWithUpdatedDesign = state.items.map(item =>
        item.id === action.payload.itemId
          ? { 
              ...item, 
              design: action.payload.design,
              personalizationSummary: generatePersonalizationSummary(action.payload.design)
            }
          : item
      );
      return {
        ...state,
        items: itemsWithUpdatedDesign,
      };
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };
    
    default:
      return state;
  }
};

const authReducer = (state: AuthState, action: any): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case 'LOGIN_ERROR':
      return {
        ...state,
        isLoading: false,
      };
    
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    default:
      return state;
  }
};

const personalizationReducer = (state: PersonalizationState, action: any): PersonalizationState => {
  switch (action.type) {
    case 'SET_CURRENT_DESIGN':
      return { ...state, currentDesign: action.payload };
    
    case 'SET_CANVAS_READY':
      return { ...state, isCanvasReady: action.payload };
    
    case 'SET_SELECTED_LAYER':
      return { ...state, selectedLayerId: action.payload };
    
    case 'SET_CANVAS_ZOOM':
      return { ...state, canvasZoom: action.payload };
    
    case 'SET_CANVAS_OFFSET':
      return { 
        ...state, 
        canvasOffsetX: action.payload.x, 
        canvasOffsetY: action.payload.y 
      };
    
    default:
      return state;
  }
};

// Helper functions
const generatePersonalizationSummary = (design: Design | undefined): string => {
  if (!design) return 'No customization';
  
  const imageLayers = design.layers.filter(l => l.type === 'image').length;
  const textLayers = design.layers.filter(l => l.type === 'text').length;
  
  const parts = [];
  if (imageLayers > 0) parts.push(`${imageLayers} Image${imageLayers > 1 ? 's' : ''}`);
  if (textLayers > 0) parts.push(`${textLayers} Text Layer${textLayers > 1 ? 's' : ''}`);
  
  return parts.length > 0 ? parts.join(', ') : 'Custom Design';
};

// Contexts
const CartContext = createContext<CartContextType | null>(null);
const AuthContext = createContext<AuthContextType | null>(null);
const PersonalizationContext = createContext<PersonalizationContextType | null>(null);

// Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [cartState, cartDispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  const [authState, authDispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const [personalizationState, personalizationDispatch] = useReducer(personalizationReducer, {
    currentDesign: null,
    isCanvasReady: false,
    selectedLayerId: null,
    canvasZoom: 1,
    canvasOffsetX: 0,
    canvasOffsetY: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('printstrokes_cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      cart.items.forEach((item: CartItem) => {
        cartDispatch({ type: 'ADD_TO_CART', payload: item });
      });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('printstrokes_cart', JSON.stringify(cartState));
  }, [cartState]);

  // Cart actions
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    cartDispatch({ type: 'ADD_TO_CART', payload: item });
    toast.success('Added to cart!', {
      action: {
        label: 'View Cart',
        onClick: () => window.location.href = '/cart',
      },
    });
  };

  const removeFromCart = (itemId: string) => {
    cartDispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    toast.success('Removed from cart');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    cartDispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    cartDispatch({ type: 'CLEAR_CART' });
  };

  const updateCartItemDesign = (itemId: string, design: Design) => {
    cartDispatch({ type: 'UPDATE_ITEM_DESIGN', payload: { itemId, design } });
  };

  // Auth actions (mock implementations)
  const login = async (email: string, password: string) => {
    authDispatch({ type: 'LOGIN_START' });
    
    // Mock API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'demo@printstrokes.com' && password === 'demo123') {
        const user: User = {
          id: '1',
          name: 'Demo User',
          email,
          avatar: '/placeholder.svg',
        };
        authDispatch({ type: 'LOGIN_SUCCESS', payload: user });
        localStorage.setItem('printstrokes_user', JSON.stringify(user));
        toast.success('Welcome back!');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      authDispatch({ type: 'LOGIN_ERROR' });
      toast.error('Invalid email or password');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    authDispatch({ type: 'LOGIN_START' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: Date.now().toString(),
        name,
        email,
        avatar: '/placeholder.svg',
      };
      
      authDispatch({ type: 'LOGIN_SUCCESS', payload: user });
      localStorage.setItem('printstrokes_user', JSON.stringify(user));
      toast.success('Account created successfully!');
    } catch (error) {
      authDispatch({ type: 'LOGIN_ERROR' });
      toast.error('Registration failed');
      throw error;
    }
  };

  const logout = () => {
    authDispatch({ type: 'LOGOUT' });
    localStorage.removeItem('printstrokes_user');
    toast.success('Logged out successfully');
  };

  // Personalization actions
  const setCurrentDesign = (design: Design | null) => {
    personalizationDispatch({ type: 'SET_CURRENT_DESIGN', payload: design });
  };

  const setCanvasReady = (ready: boolean) => {
    personalizationDispatch({ type: 'SET_CANVAS_READY', payload: ready });
  };

  const setSelectedLayer = (layerId: string | null) => {
    personalizationDispatch({ type: 'SET_SELECTED_LAYER', payload: layerId });
  };

  const setCanvasZoom = (zoom: number) => {
    personalizationDispatch({ type: 'SET_CANVAS_ZOOM', payload: zoom });
  };

  const setCanvasOffset = (x: number, y: number) => {
    personalizationDispatch({ type: 'SET_CANVAS_OFFSET', payload: { x, y } });
  };

  const saveDesign = async (design: Design): Promise<string> => {
    // Mock save to localStorage
    const designId = `design_${Date.now()}`;
    const designWithId = { ...design, id: designId };
    
    const savedDesigns = JSON.parse(localStorage.getItem('printstrokes_designs') || '[]');
    savedDesigns.push(designWithId);
    localStorage.setItem('printstrokes_designs', JSON.stringify(savedDesigns));
    
    return designId;
  };

  const loadDesign = async (designId: string): Promise<Design | null> => {
    const savedDesigns = JSON.parse(localStorage.getItem('printstrokes_designs') || '[]');
    return savedDesigns.find((d: Design) => d.id === designId) || null;
  };

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('printstrokes_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      authDispatch({ type: 'LOGIN_SUCCESS', payload: user });
    }
  }, []);

  return (
    <CartContext.Provider value={{ 
      state: cartState, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      updateCartItemDesign 
    }}>
      <AuthContext.Provider value={{ 
        state: authState, 
        login, 
        register, 
        logout 
      }}>
        <PersonalizationContext.Provider value={{
          state: personalizationState,
          setCurrentDesign,
          setCanvasReady,
          setSelectedLayer,
          setCanvasZoom,
          setCanvasOffset,
          saveDesign,
          loadDesign,
        }}>
          {children}
        </PersonalizationContext.Provider>
      </AuthContext.Provider>
    </CartContext.Provider>
  );
};

// Hooks
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within AppProvider');
  return context;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AppProvider');
  return context;
};

export const usePersonalization = () => {
  const context = useContext(PersonalizationContext);
  if (!context) throw new Error('usePersonalization must be used within AppProvider');
  return context;
};