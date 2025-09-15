import { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>{children}</main>
      <footer className="bg-muted/30 mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-lg text-gradient-brand">
                Print Strokes
              </h3>
              <p className="text-sm text-muted-foreground">
                Transform your memories into beautiful personalized products.
                High-quality printing on premium materials.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-heading font-medium">Categories</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/category/wall-decoratives" className="hover:text-primary transition-colors">Wall Decoratives</a></li>
                <li><a href="/category/desk-items" className="hover:text-primary transition-colors">Desk Items</a></li>
                <li><a href="/category/gifts" className="hover:text-primary transition-colors">Gifts</a></li>
                <li><a href="/category/accessories" className="hover:text-primary transition-colors">Accessories</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-heading font-medium">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/faq" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="/shipping" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
                <li><a href="/contact" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="/about" className="hover:text-primary transition-colors">About</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-heading font-medium">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Print Strokes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;