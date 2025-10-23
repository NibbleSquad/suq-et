import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// --- Import Page Components ---
// All paths are relative to the src/ folder where App.jsx lives.
import HomePage from './HomePage';
import CategoriesPage from './CategoriesPage';
import ShopListPage from './ShopListPage';
import ShopPage from './ShopPage';
import ProductDetailPage from './ProductDetailPage';
import CartPage from './CartPage';
import SettingsPage from './SettingsPage';
// Import Reusable Component
import BottomNav from './components/BottomNav';
import PaymentStatusModal from './components/PaymentStatusModal';


// --- MOCK DATA DEFINITIONS ---
const MOCK_SHOPS = [
    { id: 'shoa', name: 'Shoa Supermarket', category: 'groceries', image: '/images/shoa.jpg', description: 'Your everyday essentials.' },
    { id: 'tomoca', name: 'Tomoca Coffee', category: 'cafe', image: '/images/Tomoca Coffee.jpg', description: 'The original Ethiopian coffee.' },
    { id: 'gebeya', name: 'Gebeya Electronics', category: 'electronics', image: '/images/Gebeya Electronics.png', description: 'Latest gadgets and tech.'},
    { id: 'bookworld', name: 'Book World', category: 'books', image: '/images/shop_bookworld.jpg', description: 'Your source for bestsellers and classics.'},
];
const MOCK_PRODUCTS = [
    { _id: 'prod1', id: 1, name: 'Fresh Avocado', price: 89.50, oldPrice: 120.00, image: '/images/avocado.png', shopId: 'shoa', rating: 4.8, reviews: 70, description: "Fresh, creamy avocados, perfect for any meal." },
    { _id: 'prod2', id: 5, name: 'Espresso', price: 40.00, image: '/images/espresso.png', shopId: 'tomoca', rating: 4.9, reviews: 150, description: "A rich and aromatic single shot of our finest blend."},
    { _id: 'prod3', id: 3, name: 'Organic Honey', price: 450.00, image: '/images/honey.png', shopId: 'shoa', rating: 4.7, reviews: 45, description: "100% pure organic honey, sourced locally." },
    { _id: 'prod4', id: 4, name: 'The Mountain Is You', price: 850.00, oldPrice: 990.00, image: '/images/themountainisyou.jpg', shopId: 'bookworld', rating: 4.9, reviews: 320, description: "A life-changing book by Brianna Wiest about transforming self-sabotage into self-mastery."},
    { _id: 'prod6', id: 7, name: 'Elegant Shirt', price: 1200.00, image: '/icons/cloths.png', shopId: 'apparel', rating: 4.2, reviews: 50, description: "A high-quality garment for formal wear."},
];
const MOCK_CATEGORIES = [
    { id: 'groceries', name: 'Groceries', image: '/icons/grocery.png' },
    { id: 'electronics', name: 'Electronics', image: '/icons/electronics.png' },
    { id: 'cafe', name: 'Cafe', image: '/icons/cafe.jpg' }, 
    { id: 'fashion', name: 'Apparel', image: '/icons/cloths.png'},
    { id: 'beauty', name: 'Beauty', image: '/icons/beauty.png'},
    { id: 'home', name: 'Home Goods', image: '/icons/Home Goods.png'},
];
// -----------------------------------------------------------


function App() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle' | 'pending' | 'success'
    
    // --- Cart Functions ---
    const handleAddToCart = (product, quantity) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item => item._id === product._id); 
            if (existingItemIndex > -1) {
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += quantity;
                return updatedCart;
            } else {
                return [...prevCart, { ...product, quantity, shopId: product.shopId }];
            }
        });
        alert(`${quantity} of ${product.name} added to cart!`); 
        navigate('/cart');
    };

    const handleUpdateCart = (productId, change) => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item => {
                if (item._id === productId) {
                    const newQuantity = item.quantity + change;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                }
                return item;
            }).filter(Boolean);
            return updatedCart;
        });
    };
    // ------------------------------------------

    const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
    const activePath = window.location.pathname;

    // Props object passed to all Route elements
    const globalProps = {
        handleAddToCart, 
        cart, 
        handleUpdateCart,
        shops: MOCK_SHOPS, 
        products: MOCK_PRODUCTS, 
        categories: MOCK_CATEGORIES, 
        navigate,
        setPaymentStatus
    };

    // Determine which tab is active for the BottomNav based on URL path
    const getActiveTab = (path) => {
        if (path === '/') return 'home';
        if (path.startsWith('/categories')) return 'categories';
        if (path.startsWith('/shoplist')) return 'categories'; 
        if (path.startsWith('/cart')) return 'cart';
        if (path.startsWith('/settings')) return 'settings';
        return 'home';
    };


    return (
        // Main container
        <div className="max-w-md mx-auto bg-background text-foreground min-h-screen pb-24 relative">
            {/* The Routes defines the URL to Component mapping */}
            <Routes>
                {/* 1. Main Tabs */}
                <Route path="/" element={<HomePage {...globalProps} />} />
                <Route path="/categories" element={<CategoriesPage {...globalProps} />} />
                <Route path="/cart" element={<CartPage {...globalProps} />} />
                <Route path="/settings" element={<SettingsPage {...globalProps} />} />

                {/* 2. Dynamic/Detail Pages - These rely on useParams() */}
                <Route path="/shoplist/:categoryId" element={<ShopListPage {...globalProps} />} />
                <Route path="/shop/:shopId" element={<ShopPage {...globalProps} />} />
                <Route path="/product/:productId" element={<ProductDetailPage {...globalProps} />} />
                
                {/* 3. Fallback */}
                <Route path="*" element={<HomePage {...globalProps} />} /> 
            </Routes>
            
            {/* Bottom Nav: Only visible on main navigation tabs */}
            {/* Hide on dynamic detail pages (/product/ or /shop/) */}
            {!(activePath.startsWith('/product/') || activePath.startsWith('/shop/')) && (
                <BottomNav 
                    activePage={getActiveTab(activePath)} 
                    onNavigate={(page) => navigate(`/${page}`)} // Uses the navigate function for routing
                    cartCount={cartItemCount} 
                />
            )}
            
            {/* Payment Status Modal */}
            <PaymentStatusModal 
                paymentStatus={paymentStatus} 
                setPaymentStatus={setPaymentStatus} 
            />
        </div>
    );
}

export default App;
