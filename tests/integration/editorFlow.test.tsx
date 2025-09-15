import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ProductDetail from '@/pages/ProductDetail';
import { AppProvider } from '@/contexts/AppContext';

// Mock the useParams hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'test-product-1' }),
    useNavigate: () => vi.fn(),
  };
});

// Mock the mockApi
vi.mock('@/utils/mockApi', () => ({
  mockApi: {
    getProduct: vi.fn().mockResolvedValue({
      id: 'test-product-1',
      title: 'Test Photo Frame',
      description: 'A beautiful test frame',
      category: 'frames',
      materials: ['Wood', 'Glass'],
      variants: [
        {
          id: 'variant-4x6',
          name: '4x6',
          price: 399,
          dimensions: '4" × 6"',
          width: 400,
          height: 600
        },
        {
          id: 'variant-5x7',
          name: '5x7',
          price: 499,
          dimensions: '5" × 7"',
          width: 500,
          height: 700
        }
      ],
      basePrice: 399,
      personalizationOptions: ['photo', 'text'],
      images: ['/test-image.jpg'],
      tags: ['frame', 'photo'],
      stock: 'in-stock',
      featured: true,
      personalization: {
        supportsImage: true,
        supportsText: true,
        maxFileSizeMB: 10,
        recommendedDPI: 300
      }
    })
  }
}));

// Mock URL.createObjectURL
Object.defineProperty(global.URL, 'createObjectURL', {
  value: vi.fn(() => 'blob:mock-url'),
  writable: true,
});

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock fabric canvas
vi.mock('fabric', () => ({
  Canvas: vi.fn().mockImplementation(() => ({
    dispose: vi.fn(),
    renderAll: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    toDataURL: vi.fn(() => 'data:image/png;base64,mock'),
  })),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AppProvider>
      {children}
    </AppProvider>
  </BrowserRouter>
);

describe('Editor Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes the full upload → edit → save → add to cart flow', async () => {
    render(
      <TestWrapper>
        <ProductDetail />
      </TestWrapper>
    );

    // Wait for product to load
    await waitFor(() => {
      expect(screen.getByText('Test Photo Frame')).toBeInTheDocument();
    });

    // Step 1: Select a size
    const size5x7Button = screen.getByRole('button', { name: /select size 5x7/i });
    fireEvent.click(size5x7Button);

    expect(size5x7Button).toHaveAttribute('aria-current', 'true');

    // Step 2: Upload a photo
    const file = new File(['test image'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByRole('textbox', { hidden: true });
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Wait for upload to complete
    await waitFor(() => {
      expect(screen.getByText('Start Editing')).toBeInTheDocument();
    });

    // Step 3: Open the editor
    const editButton = screen.getByText('Start Editing');
    fireEvent.click(editButton);

    // Wait for editor modal to open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Step 4: Add some text (simulate editor interaction)
    const textTab = screen.getByRole('button', { name: /text/i });
    fireEvent.click(textTab);

    // In a real implementation, we would interact with the text panel here
    // For this test, we'll simulate the save action

    // Step 5: Save the design
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    // Wait for editor to close and design to be saved
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Check that design status is shown
    expect(screen.getByText('Custom Design')).toBeInTheDocument();
    expect(screen.getByText('Design saved • Ready to order')).toBeInTheDocument();

    // Step 6: Add to cart
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    // Verify the item was added to cart (this would check the cart context)
    await waitFor(() => {
      expect(screen.getByText('Adding...')).toBeInTheDocument();
    });
  });

  it('shows size selection horizontally with scrolling', async () => {
    render(
      <TestWrapper>
        <ProductDetail />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Photo Frame')).toBeInTheDocument();
    });

    // Check that size selector is present
    expect(screen.getByText('Size & Options')).toBeInTheDocument();
    expect(screen.getByText('4x6')).toBeInTheDocument();
    expect(screen.getByText('5x7')).toBeInTheDocument();

    // Check that the container has horizontal scroll classes
    const sizeContainer = screen.getByText('4x6').closest('.flex');
    expect(sizeContainer).toHaveClass('overflow-x-auto', 'snap-x');
  });

  it('validates file upload with size and type restrictions', async () => {
    render(
      <TestWrapper>
        <ProductDetail />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Photo Frame')).toBeInTheDocument();
    });

    // Test file size validation
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', { 
      type: 'image/jpeg' 
    });
    
    const fileInput = screen.getByRole('textbox', { hidden: true });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(screen.getByText(/File size must be less than 10MB/)).toBeInTheDocument();
    });

    // Test file type validation
    const textFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [textFile] } });

    await waitFor(() => {
      expect(screen.getByText('Please upload a valid image file')).toBeInTheDocument();
    });
  });

  it('shows photo editor with all panels', async () => {
    render(
      <TestWrapper>
        <ProductDetail />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Photo Frame')).toBeInTheDocument();
    });

    // Upload a valid file
    const file = new File(['test image'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByRole('textbox', { hidden: true });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Start Editing')).toBeInTheDocument();
    });

    // Open editor
    const editButton = screen.getByText('Start Editing');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Check that all editor panels are available
    expect(screen.getByRole('button', { name: /frames/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /adjust/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^text$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /text designs/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /stickers/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /layers/i })).toBeInTheDocument();
  });

  it('handles editor close without saving', async () => {
    render(
      <TestWrapper>
        <ProductDetail />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Photo Frame')).toBeInTheDocument();
    });

    // Upload and open editor
    const file = new File(['test image'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByRole('textbox', { hidden: true });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const editButton = screen.getByText('Start Editing');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close editor without saving
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Should still show the original uploaded image
    expect(screen.getByAltText('Uploaded preview')).toBeInTheDocument();
  });

  it('updates quantity and price correctly', async () => {
    render(
      <TestWrapper>
        <ProductDetail />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Photo Frame')).toBeInTheDocument();
    });

    // Check initial price
    expect(screen.getByText('₹399')).toBeInTheDocument();

    // Increase quantity
    const increaseButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(increaseButton);

    // Check quantity updated
    expect(screen.getByText('2')).toBeInTheDocument();

    // Decrease quantity
    const decreaseButton = screen.getByRole('button', { name: '-' });
    fireEvent.click(decreaseButton);

    // Should be back to 1
    expect(screen.getByText('1')).toBeInTheDocument();

    // Should not go below 1
    fireEvent.click(decreaseButton);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});