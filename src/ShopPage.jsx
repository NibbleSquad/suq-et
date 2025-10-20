import React from 'react';
// Import reusable components
import PageHeader from './components/PageHeader';
import { Card, CardContent } from "./components/ui/Card";

// Props passed from App.jsx: navigateTo, goBack, shop, products
const ShopPage = ({ navigateTo, goBack, shop, products }) => {
   
    const shopProducts = products.filter(p => p.shopId === shop.id);

    return (
        <div className="animate-in fade-in duration-300">
            {/* Header showing shop name and back button */}
            <PageHeader title={shop.name} onBack={goBack} />
            {/* Main content area with grid layout */}
            <main className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    {/* Map through the shop's products and display them */}
                    {shopProducts.map(product => (
                        <Card
                            key={product._id}
                           
                            className="cursor-pointer overflow-hidden group shadow-sm"
                           
                            onClick={() => navigateTo('productDetail', { product })}
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
                {/* Display message if shop has no products */}
                {shopProducts.length === 0 && (
                  <p className="text-center text-muted-foreground mt-8 pt-8">No products available in this shop yet.</p>
                )}
            </main>
        </div>
    );
};

export default ShopPage;