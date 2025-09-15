import { Link } from "react-router-dom";
import { Frame, Coffee, Gift, Smartphone, Clock, Award } from "lucide-react";

const CategoryGrid = () => {
  const categories = [
    {
      name: "Wall Decoratives",
      description: "Frames, clocks, and wall art",
      icon: Frame,
      href: "/category/wall-decoratives",
      color: "from-primary/20 to-primary/5",
      count: "25+ items"
    },
    {
      name: "Desk Items",
      description: "Mugs, stands, and office accessories",
      icon: Coffee,
      href: "/category/desk-items", 
      color: "from-secondary/20 to-secondary/5",
      count: "18+ items"
    },
    {
      name: "Gifts",
      description: "Perfect for special occasions",
      icon: Gift,
      href: "/category/gifts",
      color: "from-green-500/20 to-green-500/5",
      count: "15+ items"
    },
    {
      name: "Accessories",
      description: "Cases, keychains, and more",
      icon: Smartphone,
      href: "/category/accessories",
      color: "from-purple-500/20 to-purple-500/5", 
      count: "12+ items"
    },
    {
      name: "Travel",
      description: "Luggage tags and travel essentials",
      icon: Clock,
      href: "/category/travel",
      color: "from-blue-500/20 to-blue-500/5",
      count: "8+ items"
    },
    {
      name: "Premium",
      description: "Luxury personalized products",
      icon: Award,
      href: "/category/premium",
      color: "from-yellow-500/20 to-yellow-500/5",
      count: "10+ items"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Explore Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of personalization options across different product categories
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <Link
                key={category.name}
                to={category.href}
                className="group card-elegant hover:shadow-brand transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-8 w-8 text-foreground/80" />
                </div>
                
                <h3 className="font-heading font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-muted-foreground mb-3">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">
                    {category.count}
                  </span>
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;