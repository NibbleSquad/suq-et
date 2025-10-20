import React from 'react';
// Import reusable components
import PageHeader from './components/PageHeader';
import { Card, CardContent } from "./components/ui/Card";

// Props passed from App.jsx: navigateTo, goBack, category, shops
const ShopListPage = ({ navigateTo, goBack, category, shops }) => {
   
    const filteredShops = shops.filter(shop => shop.category === category.id);

    return (
        <div className="animate-in fade-in duration-300">
            {/* Header showing the category name and back button */}
            <PageHeader title={category.name} onBack={goBack} />
            {/* Main content area with spacing */}
            <main className="p-4 space-y-4">
                {/* Check if any shops were found */}
                {filteredShops.length > 0 ? (
                   
                    filteredShops.map(shop => (
                        <Card
                            key={shop.id}
                           
                            className="cursor-pointer transition-shadow hover:shadow-md group shadow-sm overflow-hidden"
                           
                            onClick={() => navigateTo('shopPage', { shop })}
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
                   
                    <p className="text-center text-muted-foreground mt-8 pt-8">No shops found in this category yet.</p>
                )}
            </main>
        </div>
    );
};

export default ShopListPage;