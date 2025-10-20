import React from 'react'; // Only need React here, useState/useEffect removed for cleaner logic
import { Search, User } from 'lucide-react';
import { Card, CardContent } from "./components/ui/Card"; 
import { Button } from "./components/ui/Button"; 
import { useNavigate } from 'react-router-dom'; // Crucial for navigation

// Props passed down from App.jsx: navigate, categories, products (mocked)
const HomePage = ({ navigate, categories, products }) => {
    
    // Logic to select recommended products (first 4 products from the general list)
    const recommendedProducts = products.slice(0, 4);

    // Logic to derive a list of featured shops for display purposes
    // (This mocks fetching featured items until API is fully integrated)
    const featuredShops = products.slice(0, 2).map(p => ({
        id: p.shopId, 
        name: p.shopId.charAt(0).toUpperCase() + p.shopId.slice(1),
        category: 'unknown', 
        image: p.image, 
        description: `Products from ${p.shopId}`
    })); 

    return (
        <div className="animate-in fade-in duration-300">
            {/* Header section */}
            <header className="p-4 flex justify-between items-center bg-background sticky top-0 z-40 border-b h-16">
                <h1 className="text-2xl font-bold text-foreground">Suq.et</h1>
                <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="icon"><Search className="text-muted-foreground" /></Button>
                    {/* Placeholder Profile Icon */}
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <User size={16} className="text-muted-foreground" />
                    </div>
                </div>
            </header>
            
            {/* Main content area with padding and spacing */}
            <main className="p-4 space-y-6">
                
                {/* Categories Section */}
                <section>
                    <h2 className="text-lg font-semibold text-foreground mb-3">Popular Categories</h2>
                    {/* Horizontal scrollable list */}
                    <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
                        {/* Display first 5 categories */}
                        {categories.slice(0, 5).map(cat => (
                            <div 
                                key={cat.id} 
                                className="flex-shrink-0 text-center cursor-pointer group" 
                                // --- ROUTER NAVIGATION: Navigate to the Shop List page using the category ID ---
                                onClick={() => navigate(`/shoplist/${cat.id}`)}
                            >
                                <div className="w-16 h-16 bg-card rounded-2xl border flex items-center justify-center mb-1.5 overflow-hidden transition-transform group-hover:scale-105 shadow-sm">
                                    <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                                </div>
                                <p className="text-xs font-medium text-muted-foreground">{cat.name}</p>
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* Promotional Banner Section (linking to groceries) */}
                <section className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-5 flex items-center border border-green-200 shadow-sm overflow-hidden">
                    <div className="flex-1 z-10">
                        <h3 className="text-xl font-bold text-green-900">Fresh Groceries</h3>
                        <p className="text-green-800 text-sm mt-1">Daily essentials delivered to your door.</p>
                        <Button
                          className="mt-3 bg-green-700 text-white hover:bg-green-700/90 h-8 px-4"
                          size="sm"
                          // --- ROUTER NAVIGATION: Navigate directly to the groceries shop list ---
                          onClick={() => navigate(`/shoplist/groceries`)}
                        >
                          Shop Now
                        </Button>
                    </div>
                    {/* Decorative image */}
                    <img 
                      src="/images/groceries_banner.jpg" 
                      className="w-20 h-auto rounded-lg ml-3 opacity-80" 
                      alt="Groceries Promotion"
                    />
                </section>
                
                {/* Recommended Products Section */}
                <section>
                    <h2 className="text-lg font-semibold text-foreground mb-3">Recommended</h2>
                    {/* Grid layout for products */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Display products */}
                        {recommendedProducts.map(product => (
                            <Card 
                                key={product._id} 
                                className="cursor-pointer overflow-hidden group shadow-sm" 
                                // --- ROUTER NAVIGATION: Navigate to the product detail page using the product's ID ---
                                onClick={() => navigate(`/product/${product._id}`)} 
                            >
                                <CardContent className="p-0">
                                  {/* Product image */}
                                  <div className="aspect-square overflow-hidden bg-secondary">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                  </div>
                                  {/* Product details */}
                                  <div className="p-3">
                                    <h3 className="font-semibold text-foreground text-sm truncate">{product.name}</h3>
                                    <p className="font-bold text-primary mt-1 text-base">ETB {product.price.toFixed(2)}</p>
                                  </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;