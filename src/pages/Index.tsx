import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import SearchBar from "@/components/home/SearchBar";
import ProductSection from "@/components/home/ProductSection";
import CategoryGrid from "@/components/home/CategoryGrid";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Search Bar */}
      <section className="py-8 bg-background">
        <div className="container mx-auto">
          <SearchBar />
        </div>
      </section>
      
      {/* Featured Products */}
      <ProductSection
        title="Featured Products"
        subtitle="Handpicked favorites that customers love"
        showFeatured={true}
        limit={6}
        viewAllLink="/category/featured"
      />
      
      {/* Category Grid */}
      <CategoryGrid />
      
      {/* New Arrivals */}
      <ProductSection
        title="Newly Launched"
        subtitle="Fresh designs and latest additions to our collection"
        showFeatured={false}
        limit={8}
        viewAllLink="/category/new"
      />
      
      {/* Popular Wall Decoratives */}
      <section className="bg-muted/30">
        <ProductSection
          title="Wall Decoratives"
          subtitle="Transform your walls with personalized art"
          categoryFilter="Wall Decoratives"
          limit={6}
          viewAllLink="/category/wall-decoratives"
        />
      </section>
      
      {/* Desk Items */}
      <ProductSection
        title="Desk Essentials"
        subtitle="Personalize your workspace"
        categoryFilter="Desk Items"
        limit={6}
        viewAllLink="/category/desk-items"
      />
    </Layout>
  );
};

export default Index;
