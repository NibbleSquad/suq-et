import React, { useState } from 'react';
// Import icons and Button component
import { ArrowLeft, MoreVertical, Star, Plus, Minus } from 'lucide-react';
import { Button } from "./components/ui/Button";

// Props passed from App.jsx: product, goBack, handleAddToCart
const ProductDetailPage = ({ product, goBack, handleAddToCart }) => {
   
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="bg-background min-h-screen animate-in fade-in duration-300">
            {/* Header with back button, title, and options */}
            <header className="p-4 flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-sm z-40 border-b h-16">
                <Button variant="ghost" size="icon" onClick={goBack}><ArrowLeft /></Button>
                <h1 className="text-lg font-semibold text-foreground">Details</h1>
                <Button variant="ghost" size="icon"><MoreVertical /></Button>
            </header>
            {/* Main content area, allows scrolling */}
            <main className="pb-32"> {/* Padding bottom to avoid overlap with fixed footer */}
                {/* Product image section */}
                <div className="w-full aspect-square flex items-center justify-center bg-secondary/30">
                    <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain p-4" />
                </div>
                {/* Product details section */}
                <div className="p-5">
                    <h2 className="text-2xl font-bold text-foreground">{product.name}</h2>
                    {/* Rating display */}
                    <div className="flex items-center mt-2 text-sm">
                        <Star className="text-yellow-400 fill-yellow-400" size={18} />
                        <span className="text-foreground font-semibold ml-1">{product.rating}</span>
                        <span className="text-muted-foreground ml-1.5">({product.reviews} reviews)</span>
                    </div>
                    {/* Price and Quantity */}
                    <div className="mt-4 flex justify-between items-center">
                        <div>
                            <span className="text-2xl font-bold text-foreground">ETB {product.price.toFixed(2)}</span>
                            {/* Display old price if available */}
                            {product.oldPrice && <span className="text-muted-foreground line-through ml-2">ETB {product.oldPrice.toFixed(2)}</span>}
                        </div>
                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-2 bg-secondary rounded-full px-2 py-0.5 h-9">
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={16}/></Button>
                            <span className="font-bold text-base w-4 text-center">{quantity}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary" onClick={() => setQuantity(q => q + 1)}><Plus size={16}/></Button>
                        </div>
                    </div>
                    {/* Product Description */}
                    <p className="text-muted-foreground mt-5 leading-relaxed">{product.description}</p>
                </div>
            </main>
            {/* Fixed footer with action buttons */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t flex space-x-4 max-w-md mx-auto z-50 h-[88px] items-center">
                <Button onClick={() => handleAddToCart(product, quantity)} variant="secondary" className="flex-1 h-14 text-lg font-semibold">Add to cart</Button>
                <Button className="flex-1 h-14 text-lg font-semibold">Buy Now</Button> {/* Buy Now not implemented */}
            </div>
        </div>
    );
};

export default ProductDetailPage;