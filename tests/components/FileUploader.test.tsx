import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUploader from '@/components/FileUploader';

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();

Object.defineProperty(global.URL, 'createObjectURL', {
  value: mockCreateObjectURL,
  writable: true,
});

Object.defineProperty(global.URL, 'revokeObjectURL', {
  value: mockRevokeObjectURL,
  writable: true,
});

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('FileUploader', () => {
  const mockOnFile = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateObjectURL.mockReturnValue('blob:mock-url');
  });

  it('renders upload area when no file is uploaded', () => {
    render(
      <FileUploader
        onFile={mockOnFile}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('Upload Your Photo')).toBeInTheDocument();
    expect(screen.getByText('Drag & drop or click to browse')).toBeInTheDocument();
    expect(screen.getByText(/JPG, PNG, WebP • Max 10MB/)).toBeInTheDocument();
  });

  it('shows preview after file upload', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(
      <FileUploader
        onFile={mockOnFile}
        onRemove={mockOnRemove}
      />
    );

    const input = screen.getByRole('textbox', { hidden: true });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockOnFile).toHaveBeenCalledWith(file, 'blob:mock-url');
    });
  });

  it('validates file size', async () => {
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', { 
      type: 'image/jpeg' 
    });
    
    render(
      <FileUploader
        onFile={mockOnFile}
        maxSizeMB={10}
      />
    );

    const input = screen.getByRole('textbox', { hidden: true });
    fireEvent.change(input, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(screen.getByText(/File size must be less than 10MB/)).toBeInTheDocument();
    });

    expect(mockOnFile).not.toHaveBeenCalled();
  });

  it('validates file type', async () => {
    const textFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    render(
      <FileUploader
        onFile={mockOnFile}
      />
    );

    const input = screen.getByRole('textbox', { hidden: true });
    fireEvent.change(input, { target: { files: [textFile] } });

    await waitFor(() => {
      expect(screen.getByText('Please upload a valid image file')).toBeInTheDocument();
    });

    expect(mockOnFile).not.toHaveBeenCalled();
  });

  it('handles drag and drop', () => {
    render(
      <FileUploader
        onFile={mockOnFile}
      />
    );

    const dropZone = screen.getByText('Upload Your Photo').closest('div');
    
    fireEvent.dragEnter(dropZone!);
    expect(screen.getByText('Drop your photo here')).toBeInTheDocument();

    fireEvent.dragLeave(dropZone!);
    expect(screen.getByText('Upload Your Photo')).toBeInTheDocument();
  });

  it('shows upload progress', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(
      <FileUploader
        onFile={mockOnFile}
      />
    );

    const input = screen.getByRole('textbox', { hidden: true });
    fireEvent.change(input, { target: { files: [file] } });

    // Should show uploading state
    expect(screen.getByText('Uploading...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles file removal', () => {
    render(
      <FileUploader
        onFile={mockOnFile}
        onRemove={mockOnRemove}
        currentFile="blob:existing-url"
      />
    );

    // Should show preview when currentFile is provided
    expect(screen.getByAltText('Uploaded preview')).toBeInTheDocument();
    
    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalled();
  });

  it('revokes object URL on unmount', () => {
    const { unmount } = render(
      <FileUploader
        onFile={mockOnFile}
        currentFile="blob:test-url"
      />
    );

    unmount();

    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test-url');
  });

  it('accepts custom file types', () => {
    render(
      <FileUploader
        onFile={mockOnFile}
        accept={{ 'image/png': ['.png'] }}
      />
    );

    const input = screen.getByRole('textbox', { hidden: true });
    expect(input).toHaveAttribute('accept');
  });

  it('applies custom className', () => {
    render(
      <FileUploader
        onFile={mockOnFile}
        className="custom-uploader"
      />
    );

    const container = screen.getByText('Upload Your Photo').closest('.custom-uploader');
    expect(container).toHaveClass('custom-uploader');
  });

  it('shows pro tip about image quality', () => {
    render(
      <FileUploader
        onFile={mockOnFile}
      />
    );

    expect(screen.getByText(/Pro tip:/)).toBeInTheDocument();
    expect(screen.getByText(/at least 300 DPI/)).toBeInTheDocument();
  });

  it('disables interaction during upload', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(
      <FileUploader
        onFile={mockOnFile}
      />
    );

    const dropZone = screen.getByText('Upload Your Photo').closest('div');
    const input = screen.getByRole('textbox', { hidden: true });
    
    fireEvent.change(input, { target: { files: [file] } });

    // During upload, the drop zone should be disabled
    expect(dropZone).toHaveClass('pointer-events-none');
  });
});