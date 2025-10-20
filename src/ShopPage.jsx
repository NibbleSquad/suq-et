import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from './components/PageHeader';
import { Card, CardContent } from "./components/ui/Card"; 

const ShopPage = ({ products, shops }) => { // Props: products, shops
    const navigate = useNavigate();
    const { shopId } = useParams(); // Gets the ID from the URL
    
    // Find the current shop based on the URL parameter
    const shop = shops.find(s => s.id === shopId);
    // Filter products belonging to the current shop ID
    const shopProducts = products.filter(p => p.shopId === shopId);

    // Handle case where shop is not found (or data is still loading)
    if (!shop) {
        return (
            <div className="p-8 text-center">
                <PageHeader title="Shop Not Found" onBack={() => navigate(-1)} />
                <p className='mt-8 text-muted-foreground'>Shop data could not be loaded or URL is invalid.</p>
            </div>
        );
    }
    
    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader title={shop.name} onBack={() => navigate(-1)} /> 
            <main className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    {shopProducts.map(product => (
                        <Card
                            key={product._id} 
                            className="cursor-pointer overflow-hidden group shadow-sm"
                            // CORRECT USAGE: This line is inside the JSX for the Card
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