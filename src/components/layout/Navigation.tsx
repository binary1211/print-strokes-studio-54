import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button-enhanced";
import { Badge } from "@/components/ui/badge";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemCount = 0; // TODO: Connect to cart state

  const categories = [
    { name: "Wall Decoratives", href: "/category/wall-decoratives" },
    { name: "Desk Items", href: "/category/desk-items" },
    { name: "Gifts", href: "/category/gifts" },
    { name: "Accessories", href: "/category/accessories" },
    { name: "Travel", href: "/category/travel" },
  ];

  return (
    <nav className="nav-sticky">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center md:flex-initial">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-heading font-bold text-gradient-brand">
                Print Strokes
              </div>
            </Link>
          </div>

          {/* Right: Cart and Auth */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label="Shopping cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button variant="brand-outline" size="sm" asChild>
              <Link to="/auth">
                <User className="h-4 w-4" />
                Login
              </Link>
            </Button>
          </div>
        </div>

        {/* Desktop Categories Menu */}
        <div className="hidden md:flex items-center justify-center space-x-8 py-3 border-t border-border">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.href}
                  className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;