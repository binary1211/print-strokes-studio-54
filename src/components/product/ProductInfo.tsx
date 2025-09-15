import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, ProductVariant } from "@/types";
import { cn } from "@/lib/utils";

interface ProductInfoProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const ProductInfo = ({
  product,
  selectedVariant,
  onVariantChange,
  quantity,
  onQuantityChange,
}: ProductInfoProps) => {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    onQuantityChange(newQuantity);
  };

  return (
    <div className="space-y-6">
      {/* Variant Selection */}
      {product.variants.length > 1 && (
        <div>
          <h3 className="font-semibold mb-3">Size & Variant</h3>
          <div className="grid grid-cols-1 gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => onVariantChange(variant)}
                className={cn(
                  "flex items-center justify-between p-3 border rounded-lg text-left transition-all",
                  selectedVariant?.id === variant.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-muted-foreground"
                )}
              >
                <div>
                  <div className="font-medium">{variant.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {variant.dimensions}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    ₹{variant.price.toLocaleString('en-IN')}
                  </div>
                  {selectedVariant?.id === variant.id && (
                    <Badge variant="default" className="mt-1">
                      Selected
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Materials */}
      <div>
        <h3 className="font-semibold mb-3">Materials</h3>
        <div className="flex flex-wrap gap-2">
          {product.materials.map((material) => (
            <Badge key={material} variant="outline" className="px-3 py-1">
              {material}
            </Badge>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div>
        <h3 className="font-semibold mb-3">Quantity</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="h-10 w-10 p-0 rounded-r-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="px-4 py-2 font-medium min-w-[3rem] text-center border-x">
              {quantity}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= 10}
              className="h-10 w-10 p-0 rounded-l-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Maximum 10 items per order
          </div>
        </div>
      </div>

      {/* Personalization Options */}
      {product.personalizationOptions.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Personalization Available</h3>
          <div className="flex flex-wrap gap-2">
            {product.personalizationOptions.map((option) => (
              <Badge key={option} variant="secondary" className="px-3 py-1">
                {option === 'photo' ? '📸 Photo Upload' : '✏️ Custom Text'}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Use the personalizer to add your custom designs
          </p>
        </div>
      )}

      {/* Product Tags */}
      <div>
        <h3 className="font-semibold mb-3">Perfect For</h3>
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="px-2 py-1 text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            product.stock === 'in-stock' ? 'bg-green-500' : 'bg-red-500'
          )}
        />
        <span className="text-sm font-medium">
          {product.stock === 'in-stock' ? 'In Stock' : 'Out of Stock'}
        </span>
        {product.stock === 'in-stock' && (
          <span className="text-sm text-muted-foreground">
            • Ready to ship
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;