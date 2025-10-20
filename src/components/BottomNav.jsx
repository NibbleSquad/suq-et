import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import icons from lucide-react library
import { Home, LayoutGrid, ShoppingCart, Settings, NfcIcon } from 'lucide-react';
import { Button } from './ui/Button'; 

// --- MOCK PRODUCT DATA (The product we will "read" from the card) ---
const NFC_MOCK_PRODUCT = { 
    _id: 'prod4', // Wireless Headphones ID
    name: 'Wireless Headphones', 
};
// ------------------------------------------------------------------


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
            {/* Show badge only if count is greater than 0 */}
            {count > 0 && (
                <span className="absolute top-0 right-1/2 translate-x-3 md:translate-x-4 w-4 h-4 bg-primary text-white text-[10px] leading-4 font-bold rounded-full flex items-center justify-center">
                    {count > 9 ? '9+' : count}
                </span>
            )}
        </button>
    );
};


// Main Bottom Navigation Bar component
const BottomNav = ({ activePage, onNavigate, cartCount }) => {
    const navigate = useNavigate(); // Router hook for programmatic navigation
    const nfc = useRef(null);
    const [isScanning, setIsScanning] = useState(false); // State for button feedback

    // 1. The function that runs when NFC data is successfully read
    const onNfcData = (event) => {
        setIsScanning(false);
        const scannedId = NFC_MOCK_PRODUCT._id; 
        
        // Use a non-blocking navigation for a smoother experience
        setTimeout(() => {
             alert(`Tag Detected! Redirecting to Product: ${NFC_MOCK_PRODUCT.name}`);
             navigate(`/product/${scannedId}`); // Navigate using the router
        }, 50); 
    };

    // 2. Function to initiate the NFC scan with a fallback
    const scanNfc = async () => {
        // --- STEP 1: CHECK FOR SUPPORT ---
        if (typeof window.NDEFReader === 'undefined') {
            alert('Device error: Web NFC is not supported. Use latest Android Chrome on HTTPS.');
            return;
        }

        setIsScanning(true);
        
        try {
            if (nfc.current === null) {
                nfc.current = new window.NDEFReader();
            }

            // Start scanning - this opens the OS prompt
            await nfc.current.scan();
            
            // Set the manual bypass timer for the hackathon demo
            let scanTimeout = setTimeout(() => {
                // If 8 seconds pass, offer manual navigation
                const proceed = confirm("Scan failed or timed out. Do you want to proceed to the product page manually?");
                if (proceed) {
                    onNfcData(); // Manually trigger navigation
                } else {
                    setIsScanning(false); // Stop spinner
                }
            }, 8000); // 8-second timeout

            // Attach success and error listeners
            const reader = nfc.current;
            
            // Event listeners to clear the timeout and handle success/error
            const readingListener = (event) => {
                clearTimeout(scanTimeout); 
                onNfcData(event); // Proceed with navigation
            };
            
            const errorListener = (error) => {
                console.error("NFC Reading Error:", error);
                clearTimeout(scanTimeout);
                setIsScanning(false);
                alert("NFC Scan failed. Ensure NFC is enabled and try tapping the card again.");
            };

            // Add listeners
            reader.addEventListener('reading', readingListener, { once: true });
            reader.addEventListener('readingerror', errorListener, { once: true });

        } catch (error) {
            console.error("NFC Scan initiation failed:", error);
            setIsScanning(false);
            alert("NFC setup failed. Please try tapping the button again.");
        }
    };
    
    // 3. Cleanup NFC listener on component unmount
    useEffect(() => {
        return () => {
            // Standard cleanup logic
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

            {/* NFC/Scan Button */}
            <div className="absolute right-0 bottom-[60px] p-4">
                <Button 
                    onClick={scanNfc} 
                    size="icon" 
                    className="shadow-lg h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700"
                    disabled={isScanning} 
                >
                    {isScanning ? (
                        // Spinner feedback
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <NfcIcon size={24} />
                    )}
                </Button>
            </div>

            {navItems.map(item => (
                <NavItem key={item.page} {...item} isActive={activePage === item.page} onNavigate={onNavigate} />
            ))}
        </nav>
    );
};

export default BottomNav;