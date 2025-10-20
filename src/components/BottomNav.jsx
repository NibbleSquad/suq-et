import React, { useEffect, useRef } from 'react';
// Import icons
import { Home, LayoutGrid, ShoppingCart, Settings, NfcIcon } from 'lucide-react';
import { Button } from './ui/Button'; 
import { useNavigate } from 'react-router-dom'; // <-- NEW IMPORT

// --- MOCK PRODUCT DATA (for the NFC scan result) ---
// When NFC scans, it gives us an ID (prod4). We look up the full product details here.
const NFC_MOCK_PRODUCT = { 
    _id: 'prod4', 
    id: 2, 
    name: 'Wireless Headphones', 
    price: 2350.00, 
    image: '/images/headset.png', 
    shopId: 'gebeya', 
    rating: 4.6, 
    reviews: 98, 
    description: "High-fidelity sound with noise-cancelling technology." 
};
// --------------------------------------------------


// Reusable component for each navigation item
const NavItem = ({ page, icon, label, isActive, onNavigate, count }) => {
    const activeClass = isActive ? 'text-primary' : 'text-gray-400';
    return (
        <button
            onClick={() => onNavigate(page)}
            className={`relative flex flex-col items-center justify-center w-1/4 pt-1 transition-colors duration-200 ${activeClass} hover:text-primary focus:outline-none`}
        >
            {icon}
            <span className="text-xs mt-1 font-medium">{label}</span>
            {count > 0 && (
                <span className="absolute top-0 right-1/2 translate-x-3 md:translate-x-4 w-4 h-4 bg-primary text-white text-[10px] leading-4 font-bold rounded-full flex items-center justify-center">
                    {count > 9 ? '9+' : count}
                </span>
            )}
        </button>
    );
};

// Main Bottom Navigation Bar component
// Removed navigateTo prop and used useNavigate hook internally
const BottomNav = ({ activePage, onNavigate, cartCount }) => {
    const navigate = useNavigate(); // Initialize router hook
    const nfc = useRef(null);

    // --- NFC Handlers ---

    // 1. The function that runs when NFC data is successfully read
    const onNfcData = (event) => {
        // In a real app, you would parse event.message/data to get the product ID.
        // For now, we use a fixed mock product ID: 'prod4'
        const scannedId = NFC_MOCK_PRODUCT._id; 
        
        // --- CRITICAL FIX: Use router navigate to the correct URL ---
        // This opens the URL: http://localhost:5173/product/prod4
        alert(`NFC Scanned! Redirecting to Product ID: ${scannedId}`);
        navigate(`/product/${scannedId}`);
    };

    const scanNfc = async () => {
        // Check if NFC API is available (only available on modern Android devices in the browser)
        if (typeof window.NDEFReader === 'undefined') {
            alert('Your device does not support Web NFC or the feature is unavailable.');
            return;
        }

        try {
            if (nfc.current === null) {
                nfc.current = new NDEFReader();
            }

            await nfc.current.scan();
            const reader = nfc.current;

            // Only add listeners once per scan session
            const readingListener = (event) => onNfcData(event);
            const errorListener = (error) => console.error("NFC Reading Error:", error);
            
            reader.addEventListener('reading', readingListener, { once: true });
            reader.addEventListener('readingerror', errorListener, { once: true });
            
            // Clean up the listeners when the component unmounts
            return () => {
                 reader.removeEventListener('reading', readingListener);
                 reader.removeEventListener('readingerror', errorListener);
            };

        } catch (error) {
            console.error("NFC Scan failed:", error);
            alert("NFC Scan failed. Ensure NFC is enabled.");
        }
    };

    // Cleanup NFC listener on component unmount
    useEffect(() => {
        // The return function acts as cleanup when the component is removed
        return () => {
            if (nfc.current) {
                // If you call this manually, you'd need to stop the scan too, but
                // usually letting the component handle the cleanup is cleaner.
            }
        };
    }, []);

    const navItems = [
        { page: 'home', icon: <Home size={24} strokeWidth={activePage === 'home' ? 2.5 : 2} />, label: 'Home' },
        { page: 'categories', icon: <LayoutGrid size={24} strokeWidth={activePage === 'categories' ? 2.5 : 2} />, label: 'Categories' },
        { page: 'cart', icon: <ShoppingCart size={24} strokeWidth={activePage === 'cart' ? 2.5 : 2} />, label: 'Cart', count: cartCount },
        { page: 'settings', icon: <Settings size={24} strokeWidth={activePage === 'settings' ? 2.5 : 2} />, label: 'Settings' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t flex justify-around p-2 max-w-md mx-auto z-50 h-[60px]">

            {/* NFC/Scan Button: Fixed bottom-right corner */}
            {/* Using a margin below the button to position it above the Nav bar */}
            <div className="absolute right-0 bottom-[60px] p-4">
                <Button onClick={scanNfc} size="icon" className="shadow-lg h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700">
                    <NfcIcon size={24} />
                </Button>
            </div>

            {navItems.map(item => (
                <NavItem key={item.page} {...item} isActive={activePage === item.page} onNavigate={onNavigate} />
            ))}
        </nav>
    );
};

export default BottomNav;