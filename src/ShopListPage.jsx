import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from './components/PageHeader';
import { Card, CardContent } from "./components/ui/Card"; 

// Props passed from App.jsx: categories, shops
const ShopListPage = ({ categories, shops }) => {
    const navigate = useNavigate();
    const { categoryId } = useParams(); // <-- Get category ID from URL

    // Find the category object based on the URL parameter for the title
    const category = categories.find(c => c.id === categoryId);
    
    // Filter shops based on the category ID read from the URL
    const filteredShops = shops.filter(shop => shop.category === categoryId);

    // If the data structure is mocked/loading, show a fallback title
    const title = category ? category.name : 'Shops';

    return (
        <div className="animate-in fade-in duration-300">
            {/* FIX: Use navigate(-1) for a reliable history back action */}
            <PageHeader title={title} onBack={() => navigate(-1)} /> 
            
            <main className="p-4 space-y-4">
                {filteredShops.length > 0 ? (
                    filteredShops.map(shop => (
                        <Card
                            key={shop.id}
                            className="cursor-pointer transition-shadow hover:shadow-md group shadow-sm overflow-hidden"
                            // Navigate to the specific shop's page
                            onClick={() => navigate(`/shop/${shop.id}`)}
                        >
                            <CardContent className="p-0">
                                {/* Shop banner image */}
                                <div className="h-24 bg-secondary overflow-hidden">
                                  <img src={shop.image} className="w-full h-full object-cover" alt={shop.name}/>
                                </div>
                                {/* Shop details */}
                                <div className="p-4 pt-3">
                                    <h3 className="font-semibold text-lg text-foreground">{shop.name}</h3>
                                    <p className="text-muted-foreground text-sm mt-0.5">{shop.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-muted-foreground mt-8 pt-8">No shops found in the {title} category yet.</p>
                )}
            </main>
        </div>
    );
};

export default ShopListPage;
