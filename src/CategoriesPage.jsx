import React from 'react';
import { useNavigate } from 'react-router-dom'; // <-- NEW IMPORT
import PageHeader from './components/PageHeader';
import { Card, CardContent } from "./components/ui/Card"; 

const CategoriesPage = ({ categories }) => {
    const navigate = useNavigate(); // <-- Initialize router hook

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader title="All Categories" />
            <main className="p-4 grid grid-cols-2 gap-4">
                {categories.map(cat => (
                    <Card
                        key={cat.id}
                        className="flex flex-col items-center text-center p-4 transition-transform hover:scale-105 cursor-pointer shadow-sm"
                        // --- FIX: Use navigate() to push the new URL ---
                        onClick={() => navigate(`/shoplist/${cat.id}`)}
                    >
                        <CardContent className="p-0 flex flex-col items-center">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary mb-2">
                                <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                            </div>
                            <p className="text-sm font-semibold text-foreground mt-1">{cat.name}</p>
                        </CardContent>
                    </Card>
                ))}
            </main>
        </div>
    );
};

export default CategoriesPage;