import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button-enhanced";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { useRef } from "react";
import productsData from "@/data/products.json";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  showFeatured?: boolean;
  categoryFilter?: string;
  limit?: number;
  showViewAll?: boolean;
  viewAllLink?: string;
}

const ProductSection = ({ 
  title, 
  subtitle, 
  showFeatured = false, 
  categoryFilter,
  limit = 8,
  showViewAll = true,
  viewAllLink = "/category/all"
}: ProductSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Filter products based on props
  let filteredProducts = productsData;
  
  if (showFeatured) {
    filteredProducts = filteredProducts.filter(product => product.featured);
  }
  
  if (categoryFilter) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase().includes(categoryFilter.toLowerCase())
    );
  }
  
  const displayProducts = filteredProducts.slice(0, limit);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Width of product card + gap
      const currentScrollLeft = scrollContainerRef.current.scrollLeft;
      const targetScrollLeft = direction === 'left' 
        ? currentScrollLeft - scrollAmount 
        : currentScrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-muted-foreground">{subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Carousel Controls */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('left')}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('right')}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* View All Button */}
            {showViewAll && (
              <Button variant="brand-outline" asChild>
                <Link to={viewAllLink}>
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
        
        {/* Products Grid/Carousel */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 md:grid md:product-grid md:overflow-visible"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {displayProducts.map((product) => (
              <div key={product.id} className="flex-none w-80 md:w-auto">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile View All */}
        {showViewAll && (
          <div className="flex justify-center mt-8 md:hidden">
            <Button variant="brand-outline" asChild>
              <Link to={viewAllLink}>
                View All Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;