import React from 'react';
// Import reusable components
import PageHeader from './components/PageHeader';
import { Card, CardContent } from "./components/ui/Card";

// Props passed from App.jsx: navigateTo, categories
const CategoriesPage = ({ navigateTo, categories }) => (
    <div className="animate-in fade-in duration-300">
        <PageHeader title="All Categories" />
        {/* Main content area with grid layout */}
        <main className="p-4 grid grid-cols-2 gap-4">
            {/* Map through all categories and display them */}
            {categories.map(cat => (
                <Card
                    key={cat.id}
                   
                    className="flex flex-col items-center text-center p-4 transition-transform hover:scale-105 cursor-pointer shadow-sm"
                   
                    onClick={() => navigateTo('shopList', { category: cat })}
                >
                    <CardContent className="p-0 flex flex-col items-center">
                        {/* Category image */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary mb-2">
                           <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                        </div>
                        {/* Category name */}
                        <p className="text-sm font-semibold text-foreground mt-1">{cat.name}</p>
                    </CardContent>
                </Card>
            ))}
        </main>
    </div>
);

export default CategoriesPage;