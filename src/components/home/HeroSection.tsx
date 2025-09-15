import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button-enhanced";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-products.jpg";

const HeroSection = () => {
  return (
    <section className="gradient-hero py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Create Something Unique
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-heading font-bold leading-tight">
              Transform Your
              <span className="text-gradient-brand block">
                Memories Into Art
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl">
              Personalize premium products with your photos and text. From acrylic frames 
              to custom mobile cases, create something special that tells your story.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" asChild>
                <Link to="/personalize">
                  Create Your Design
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/category/all">
                  Browse Products
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Free Shipping
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Premium Quality
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Quick Delivery
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="relative z-10 animate-float">
              <img
                src={heroImage}
                alt="Personalized print products including acrylic frames, custom cases, and more"
                className="w-full h-auto rounded-3xl shadow-elegant"
                loading="eager"
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse-slow"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary/20 rounded-full blur-xl animate-pulse-slow delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;