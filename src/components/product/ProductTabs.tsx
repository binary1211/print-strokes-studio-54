import { Star, Truck, RotateCcw, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types";

interface ProductTabsProps {
  product: Product;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: "Priya S.",
      rating: 5,
      date: "2024-01-15",
      comment: "Amazing quality! The acrylic finish is perfect and the personalization came out beautifully.",
      verified: true,
    },
    {
      id: 2,
      name: "Rajesh K.",
      rating: 5,
      date: "2024-01-12",
      comment: "Fast delivery and excellent packaging. Will definitely order again!",
      verified: true,
    },
    {
      id: 3,
      name: "Sneha M.",
      rating: 4,
      date: "2024-01-08",
      comment: "Good quality but delivery took a bit longer than expected. Product is exactly as shown.",
      verified: true,
    },
  ];

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specs">Specifications</TabsTrigger>
        <TabsTrigger value="reviews">Reviews (127)</TabsTrigger>
        <TabsTrigger value="shipping">Shipping</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="space-y-6">
        <div className="prose prose-neutral max-w-none">
          <h3 className="text-xl font-heading font-semibold mb-4">Product Description</h3>
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
          
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4">Key Features</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                Premium quality materials with UV-resistant coating
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                High-resolution photo printing with vibrant colors
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                Easy-to-use personalizer with real-time preview
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                Durable construction for long-lasting memories
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4">Perfect Gift For</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h5 className="font-medium mb-2">Personal Use</h5>
                <p className="text-sm text-muted-foreground">
                  Decorate your home with personalized memories
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h5 className="font-medium mb-2">Gift Giving</h5>
                <p className="text-sm text-muted-foreground">
                  Perfect for birthdays, anniversaries, and special occasions
                </p>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="specs" className="space-y-6">
        <div>
          <h3 className="text-xl font-heading font-semibold mb-6">Specifications</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Available Sizes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {product.variants.map((variant) => (
                  <div key={variant.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{variant.name}</div>
                    <div className="text-sm text-muted-foreground">{variant.dimensions}</div>
                    <div className="text-sm font-semibold mt-1">
                      ₹{variant.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">Materials & Construction</h4>
              <div className="space-y-2">
                {product.materials.map((material) => (
                  <div key={material} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="font-medium">{material}</span>
                    <Badge variant="outline">Premium Grade</Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">Technical Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Print Technology</div>
                  <div className="text-sm text-muted-foreground">UV Digital Printing</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Color Accuracy</div>
                  <div className="text-sm text-muted-foreground">98% Color Gamut</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Durability</div>
                  <div className="text-sm text-muted-foreground">5+ Years Fade Resistant</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Finish</div>
                  <div className="text-sm text-muted-foreground">Glossy/Matte Options</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-heading font-semibold">Customer Reviews</h3>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">4.8 out of 5</span>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-5 gap-2 text-sm">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span>{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${rating === 5 ? 85 : rating === 4 ? 10 : 3}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{review.name}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${
                              i < review.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="shipping" className="space-y-6">
        <div>
          <h3 className="text-xl font-heading font-semibold mb-6">Shipping & Returns</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Shipping Options</h4>
              </div>
              
              <div className="space-y-3 pl-8">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">Standard Delivery</div>
                    <div className="text-sm text-muted-foreground">5-7 business days</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹49</div>
                    <div className="text-xs text-muted-foreground">Free above ₹499</div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">Express Delivery</div>
                    <div className="text-sm text-muted-foreground">2-3 business days</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹99</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Returns Policy */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Returns Policy</h4>
              </div>
              
              <div className="space-y-3 pl-8">
                <div>
                  <div className="font-medium">7-Day Easy Returns</div>
                  <div className="text-sm text-muted-foreground">
                    Return unused items within 7 days for full refund
                  </div>
                </div>
                
                <div>
                  <div className="font-medium">Personalized Items</div>
                  <div className="text-sm text-muted-foreground">
                    Returns accepted only for manufacturing defects
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Additional Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-sm">Secure Packaging</div>
                <div className="text-xs text-muted-foreground">Protected delivery</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
              <Truck className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-sm">Track Your Order</div>
                <div className="text-xs text-muted-foreground">Real-time updates</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
              <RotateCcw className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-sm">Quality Guarantee</div>
                <div className="text-xs text-muted-foreground">100% satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;