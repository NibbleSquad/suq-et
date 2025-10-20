import React from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Crucial imports
import PageHeader from './components/PageHeader';
import { Card, CardContent } from "./components/ui/Card"; 

// Props passed from App.jsx: categories, shops (MOCK_SHOPS)
const ShopListPage = ({ categories, shops }) => {
    const navigate = useNavigate();
    const { categoryId } = useParams(); // Gets the ID from the URL (e.g., 'groceries')

    // 1. Find the category object based on the URL parameter for the title
    const category = categories.find(c => c.id === categoryId);
    
    // 2. Filter shops based on the category ID read from the URL
    const filteredShops = shops.filter(shop => shop.category === categoryId);

    // Set title, handling case where category might not be found in mock data
    const title = category ? category.name : 'Shops';

    return (
        <div className="animate-in fade-in duration-300">
            {/* Header: Back button uses router history */}
            <PageHeader title={title} onBack={() => navigate(-1)} /> 
            
            <main className="p-4 space-y-4">
                {/* 3. Render the filtered shops */}
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
                    // Display message if no shops are found
                    <p className="text-center text-muted-foreground mt-8 pt-8">No shops found in the {title} category yet.</p>
                )}
            </main>
        </div>
    );
};

export default ShopListPage;