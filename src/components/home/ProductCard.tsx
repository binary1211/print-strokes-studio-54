import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button-enhanced";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    basePrice: number;
    images: string[];
    materials: string[];
    tags: string[];
    featured?: boolean;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: number) => `₹${price}`;

  return (
    <div className="product-card group">
      <div className="relative overflow-hidden">
        {/* Product Image */}
        <div className="aspect-square bg-muted/30 relative">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* Featured Badge */}
          {product.featured && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
          
          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="icon" variant="ghost" className="bg-background/80 backdrop-blur-sm hover:bg-background">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick Add to Cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="brand" size="sm" className="w-full">
              <ShoppingCart className="h-4 w-4" />
              Quick Add
            </Button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-heading font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              <Link to={`/product/${product.id}`} className="line-clamp-2">
                {product.title}
              </Link>
            </h3>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
          
          {/* Materials */}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.materials.slice(0, 2).map((material) => (
              <Badge key={material} variant="secondary" className="text-xs">
                {material}
              </Badge>
            ))}
            {product.materials.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{product.materials.length - 2}
              </Badge>
            )}
          </div>
          
          {/* Price and Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-primary">
                {formatPrice(product.basePrice)}
              </span>
              <span className="text-sm text-muted-foreground">onwards</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">4.8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;