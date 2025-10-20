import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // NEW IMPORTS
import { ArrowLeft, MoreVertical, Star, Plus, Minus } from 'lucide-react';
import { Button } from "./components/ui/Button"; 

// Props: products (mock data), handleAddToCart
const ProductDetailPage = ({ products, handleAddToCart }) => {
    const navigate = useNavigate();
    const { productId } = useParams(); // Get product ID from URL: /product/:productId
    const [quantity, setQuantity] = useState(1);
    
    // Find the product data based on the ID from the URL
    const product = products.find(p => p._id === productId);

    // Handle product not found
    if (!product) {
        return (
            <div className="p-8 text-center">
                <h1 className='text-xl font-semibold'>Product Not Found</h1>
                <Button onClick={() => navigate('/')} className='mt-4'>Go Home</Button>
            </div>
        );
    }
    
    const { name, price, oldPrice, image, rating, reviews, description } = product;

    return (
        <div className="bg-background min-h-screen animate-in fade-in duration-300">
            {/* Header with back button, title, and options */}
            <header className="p-4 flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-sm z-40 border-b h-16">
                {/* Use navigate(-1) for the back button */}
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft /></Button>
                <h1 className="text-lg font-semibold text-foreground">Details</h1>
                <Button variant="ghost" size="icon"><MoreVertical /></Button>
            </header>
            <main className="pb-32">
                {/* Product image section */}
                <div className="w-full aspect-square flex items-center justify-center bg-secondary/30">
                    <img src={image} alt={name} className="max-w-full max-h-full object-contain p-4" />
                </div>
                {/* Product details section */}
                <div className="p-5">
                    <h2 className="text-2xl font-bold text-foreground">{name}</h2>
                    {/* Rating display */}
                    <div className="flex items-center mt-2 text-sm">
                        <Star className="text-yellow-400 fill-yellow-400" size={18} />
                        <span className="text-foreground font-semibold ml-1">{rating}</span>
                        <span className="text-muted-foreground ml-1.5">({reviews} reviews)</span>
                    </div>
                    {/* Price and Quantity */}
                    <div className="mt-4 flex justify-between items-center">
                        <div>
                            <span className="text-2xl font-bold text-foreground">ETB {price.toFixed(2)}</span>
                            {product.oldPrice && <span className="text-muted-foreground line-through ml-2">ETB {oldPrice.toFixed(2)}</span>}
                        </div>
                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-2 bg-secondary rounded-full px-2 py-0.5 h-9">
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={16}/></Button>
                            <span className="font-bold text-base w-4 text-center">{quantity}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary" onClick={() => setQuantity(q => q + 1)}><Plus size={16}/></Button>
                        </div>
                    </div>
                    {/* Product Description */}
                    <p className="text-muted-foreground mt-5 leading-relaxed">{description}</p>
                </div>
            </main>
            {/* Fixed footer with action buttons */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t flex space-x-4 max-w-md mx-auto z-50 h-[88px] items-center">
                {/* Add to Cart button uses the handleAddToCart prop */}
                <Button onClick={() => handleAddToCart(product, quantity)} variant="secondary" className="flex-1 h-14 text-lg font-semibold">Add to cart</Button>
                <Button className="flex-1 h-14 text-lg font-semibold">Buy Now</Button>
            </div>
        </div>
    );
};

export default ProductDetailPage;