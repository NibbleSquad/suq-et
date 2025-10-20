import React from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // NEW IMPORTS
import PageHeader from './components/PageHeader';
import { Card, CardContent } from "./components/ui/Card"; 

// Props: goBack is replaced by navigate(-1). 'shop' is derived from URL/MOCK DATA
const ShopPage = ({ products, shops }) => {
    const navigate = useNavigate();
    const { shopId } = useParams(); // Get shop ID from URL: /shop/:shopId
    
    // Find the current shop and its products using the ID from the URL
    const shop = shops.find(s => s.id === shopId);
    const shopProducts = products.filter(p => p.shopId === shopId);

    // Handle case where shop is not found (or data is still loading)
    if (!shop) {
        return (
            <div className="p-8 text-center">
                <PageHeader title="Loading..." onBack={() => navigate(-1)} />
                <p className='mt-8 text-muted-foreground'>Loading shop data or shop not found...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-300">
            {/* Use navigate(-1) for back */}
            <PageHeader title={shop.name} onBack={() => navigate(-1)} /> 
            <main className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    {shopProducts.map(product => (
                        <Card
                            key={product._id} 
                            className="cursor-pointer overflow-hidden group shadow-sm"
                            // --- UPDATED NAVIGATION ---
                            onClick={() => navigate(`/product/${product._id}`)}
                        >
                            <CardContent className="p-0">
                                <div className="aspect-square overflow-hidden bg-secondary">
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                </div>
                                <div className="p-3">
                                    <h3 className="font-semibold text-foreground text-sm truncate">{product.name}</h3>
                                    <p className="font-bold text-primary mt-1 text-base">ETB {product.price.toFixed(2)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {shopProducts.length === 0 && (
                  <p className="text-center text-muted-foreground mt-8 pt-8">No products available in this shop yet.</p>
                )}
            </main>
        </div>
    );
};

export default ShopPage;