import React, { useState } from 'react';
// Import Page Components (now directly in src/)
import HomePage from './HomePage';
import CategoriesPage from './CategoriesPage';
import ShopListPage from './ShopListPage';
import ShopPage from './ShopPage';
import ProductDetailPage from './ProductDetailPage';
import CartPage from './CartPage';
import SettingsPage from './SettingsPage';
// Import Reusable Component
import BottomNav from './components/BottomNav';

/// Mock Data (UPDATED WITH YOUR LOCAL FILE PATHS)
const MOCK_SHOPS = [
   
    { 
        id: 'shoa', 
        name: 'Shoa Supermarket', 
        category: 'groceries', 
        image: '/images/shoa.jpg', 
        description: 'Your everyday essentials.' 
    },
    { 
        id: 'tomoca', 
        name: 'Tomoca Coffee', 
        category: 'cafe', 
        image: '/images/Tomoca Coffee.jpg',
        description: 'The original Ethiopian coffee.' 
    },
    { 
        id: 'gebeya', 
        name: 'Gebeya Electronics', 
        category: 'electronics', 
        image: '/images/Gebeya Electronics.png',
        description: 'Latest gadgets and tech.'
    },
];

const MOCK_PRODUCTS = [
   
    { _id: 'prod1', id: 1, name: 'Fresh Avocado', price: 89.50, oldPrice: 120.00, image: '/images/avocado.png', shopId: 'shoa', rating: 4.8, reviews: 70, description: "Fresh, creamy avocados, perfect for any meal." },
    { _id: 'prod3', id: 3, name: 'Organic Honey', price: 450.00, image: '/images/honey.png', shopId: 'shoa', rating: 4.7, reviews: 45, description: "100% pure organic honey, sourced locally." },
    
   
    { _id: 'prod2', id: 5, name: 'Espresso', price: 40.00, image: '/images/espresso.png', shopId: 'tomoca', rating: 4.9, reviews: 150, description: "A rich and aromatic single shot of our finest blend."},
    { _id: 'prod5', id: 6, name: 'Jebena Coffee Pot', price: 950.00, image: '/images/jebena.png', shopId: 'tomoca', rating: 4.5, reviews: 30, description: "Traditional Ethiopian clay coffee pot."},
    
   
    { _id: 'prod4', id: 2, name: 'Wireless Headphones', price: 2350.00, image: '/images/headset.png', shopId: 'gebeya', rating: 4.6, reviews: 98, description: "High-fidelity sound with noise-cancelling technology."},
    
   
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

function App() {
   
    const [pageStack, setPageStack] = useState([{ name: 'home' }]);
   
    const [cart, setCart] = useState([]);

   
    const currentPage = pageStack[pageStack.length - 1];

   
   
    const navigateTo = (pageName, data = {}) => {
        setPageStack(prevStack => [...prevStack, { name: pageName, data }]);
    };
   
    const goBack = () => {
        if (pageStack.length > 1) {
            setPageStack(prevStack => prevStack.slice(0, -1));
        }
    };
   
    const navigateTab = (pageName) => {
        setPageStack([{ name: pageName }]);
    };

   
   
    const handleAddToCart = (product, quantity) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item => item._id === product._id);
            if (existingItemIndex > -1) {
               
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += quantity;
                return updatedCart;
            } else {
               
                return [...prevCart, { ...product, quantity }];
            }
        });
        alert(`${quantity} of ${product.name} added to cart!`);
        navigateTab('cart');
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

   
   
    const renderPage = () => {
       
        const props = {
            navigateTo, goBack, handleAddToCart, cart, handleUpdateCart,
            shops: MOCK_SHOPS,
            products: MOCK_PRODUCTS,
            categories: MOCK_CATEGORIES,
            ...currentPage.data
        };
        switch (currentPage.name) {
            case 'home': return <HomePage {...props} />;
            case 'categories': return <CategoriesPage {...props} />;
            case 'shopList': return <ShopListPage {...props} />;
            case 'shopPage': return <ShopPage {...props} />;
            case 'productDetail': return <ProductDetailPage {...props} />;
            case 'cart': return <CartPage {...props} />;
            case 'settings': return <SettingsPage {...props} />;
            default: return <HomePage {...props} />;
        }
    };

   
    const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
       
        <div className="max-w-md mx-auto bg-background text-foreground min-h-screen pb-24 relative">
            {renderPage()}
            {/* Render BottomNav only if not on product detail page */}
            {currentPage.name !== 'productDetail' && (
              <BottomNav activePage={currentPage.name} onNavigate={navigateTab} cartCount={cartItemCount} />
            )}
        </div>
    );
}

export default App;
