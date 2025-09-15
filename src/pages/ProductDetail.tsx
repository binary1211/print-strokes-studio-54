import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Share, Heart, Image, Upload } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import SizeSelector from "@/components/SizeSelector";
import FileUploader from "@/components/FileUploader";
import EditorModal from "@/components/PhotoEditor/EditorModal";
import ProductTabs from "@/components/product/ProductTabs";
import { Button } from "@/components/ui/button-enhanced";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Product, ProductVariant, Design } from "@/types";
import { mockApi } from "@/utils/mockApi";
import { useCart } from "@/contexts/AppContext";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  
  // Photo editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [design, setDesign] = useState<Design | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // File upload hook
  const { 
    uploadedFile, 
    handleFile, 
    removeFile, 
    validateFile,
    estimatePrintResolution,
    error: uploadError 
  } = useFileUpload(10);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productData = await mockApi.getProduct(id);
        
        if (productData) {
          setProduct(productData);
          setSelectedVariant(productData.variants[0]);
        } else {
          toast.error('Product not found');
          navigate('/');
        }
      } catch (error) {
        toast.error('Failed to load product');
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;

    try {
      setIsSaving(true);
      
      addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
        price: selectedVariant.price,
        design: design || undefined,
        personalizationSummary: design ? 'Custom Photo Design' : 'No customization',
        previewUrl: previewUrl || undefined,
      });
      
      toast.success('Added to cart!');
      
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error('Error adding to cart:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      navigate('/cart');
    }, 500);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')} variant="brand">
            Return to Home
          </Button>
        </div>
      </Layout>
    );
  }

  const canPersonalize = product.personalization && 
    (product.personalization.supportsImage || product.personalization.supportsText);

  const handleFileUpload = async (file: File, url: string) => {
    if (!validateFile(file)) return;
    
    handleFile(file, url);
    
    // Estimate print quality
    try {
      const resolution = await estimatePrintResolution(file);
      if (resolution.quality === 'low' && selectedVariant) {
        toast.warning(`Image resolution is ${resolution.dpi} DPI. For best print quality at ${selectedVariant.name}, consider using a higher resolution image.`);
      }
    } catch (error) {
      console.error('Error estimating resolution:', error);
    }
  };

  const handleEditorSave = (savedDesign: Design, savedPreviewUrl: string) => {
    setDesign(savedDesign);
    setPreviewUrl(savedPreviewUrl);
    setEditorOpen(false);
    toast.success('Design saved successfully!');
  };

  const handleOpenEditor = () => {
    if (!uploadedFile) {
      toast.error('Please upload a photo first');
      return;
    }
    setEditorOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {/* Product Images */}
          <div className="lg:col-span-1">
            <ProductImageGallery 
              images={product.images}
              title={product.title}
            />
          </div>

          {/* Preview Area (when photo uploaded) */}
          {(uploadedFile || previewUrl) && (
            <div className="lg:col-span-1 xl:col-span-1">
              <div className="bg-card rounded-2xl border-2 border-dashed border-border p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Design Preview
                </h3>
                <div className="aspect-square bg-muted rounded-xl overflow-hidden mb-4">
                  <img
                    src={previewUrl || uploadedFile?.url}
                    alt="Design preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                      <Button
                        onClick={handleOpenEditor}
                        className="flex-1 bg-printStrokes-primary hover:bg-printStrokes-primary/90"
                        variant="default"
                      >
                    <Image className="h-4 w-4 mr-2" />
                    Edit Design
                  </Button>
                  <Button
                    variant="outline"
                    onClick={removeFile}
                    className="px-3"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Product Info & Controls */}
          <div className="lg:col-span-1 xl:col-span-1 space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
                  {product.title}
                </h1>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-4 w-4 fill-yellow-400 text-yellow-400" 
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">(127 reviews)</span>
                </div>
                <Badge variant={product.stock === 'in-stock' ? 'default' : 'secondary'}>
                  {product.stock === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>

              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <SizeSelector
                variants={product.variants}
                selected={selectedVariant?.id || ''}
                onSelect={(variantId) => {
                  const variant = product.variants.find(v => v.id === variantId);
                  if (variant) setSelectedVariant(variant);
                }}
              />
              
              {/* Quantity Selection */}
              <div className="flex items-center justify-between">
                <label className="font-semibold">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            {/* Photo Upload & Customization */}
            {canPersonalize && (
              <div className="border rounded-2xl p-6 bg-gradient-to-br from-background to-muted/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Upload & Customize</h3>
                  <Badge variant="secondary" className="bg-printStrokes-secondary/10 text-printStrokes-secondary">
                    Photo Editor
                  </Badge>
                </div>
                
                {!uploadedFile ? (
                  <FileUploader
                    onFile={handleFileUpload}
                    accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }}
                    maxSizeMB={10}
                    className="mb-4"
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="relative group">
                      <div className="aspect-video w-full max-w-xs mx-auto rounded-xl overflow-hidden bg-muted border">
                        <img
                          src={previewUrl || uploadedFile.url}
                          alt="Uploaded preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={handleOpenEditor}
                        className="flex-1 bg-printStrokes-primary hover:bg-printStrokes-primary/90"
                        variant="default"
                      >
                        <Image className="h-4 w-4 mr-2" />
                        {design ? 'Edit Design' : 'Start Editing'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={removeFile}
                        className="px-4"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Replace
                      </Button>
                    </div>
                    
                    {design && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        <Badge variant="outline" className="text-xs">
                          ✨ Custom Design
                        </Badge>
                        <span>Design saved • Ready to order</span>
                      </div>
                    )}
                  </div>
                )}
                
                {uploadError && (
                  <div className="mt-3 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                    {uploadError}
                  </div>
                )}
              </div>
            )}


            {/* Add to Cart Section */}
            <div className="space-y-3 pt-6 border-t">
              <div className="text-3xl font-heading font-bold">
                ₹{selectedVariant?.price.toLocaleString('en-IN')}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="brand-outline"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isSaving || product.stock !== 'in-stock'}
                  className="flex-1"
                >
                  {isSaving ? 'Adding...' : 'Add to Cart'}
                </Button>
                
                <Button
                  variant="brand"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={isSaving || product.stock !== 'in-stock'}
                  className="flex-1"
                >
                  Buy Now
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                Free shipping on orders above ₹499 • 7-day returns
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 pt-6 border-t">
              <div>
                <h4 className="font-semibold mb-2">Materials</h4>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material) => (
                    <Badge key={material} variant="outline">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {selectedVariant && (
                <div>
                  <h4 className="font-semibold mb-2">Dimensions</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedVariant.dimensions}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <ProductTabs product={product} />
      </div>

      {/* Photo Editor Modal */}
      <EditorModal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleEditorSave}
        initialImage={uploadedFile?.url}
        initialDesign={design}
        productVariant={selectedVariant ? {
          width: selectedVariant.width || 800,
          height: selectedVariant.height || 600,
          aspectRatio: selectedVariant.aspectRatio
        } : undefined}
      />
    </Layout>
  );
};

export default ProductDetail;