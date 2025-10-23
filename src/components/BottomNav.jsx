import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import icons from lucide-react library
import { Home, LayoutGrid, ShoppingCart, Settings, NfcIcon, XIcon, ScanIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { toast, Toaster } from 'sonner';
import { ScanModal } from './ScanModal';
import { playBase64Audio } from './AudioPlayer';

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
    const nfcRef = useRef(null); // will hold NDEFReader instance
    const controllerRef = useRef(null); // will hold AbortController for scan
    const readingListenerRef = useRef(null);
    const errorListenerRef = useRef(null);
    const timeoutRef = useRef(null);

    const [isScanning, setIsScanning] = useState(false); // State for button feedback
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);

    const handleScanSuccess = (result) => {
        setIsScanModalOpen(false); // Close the modal

        if (result?.length > 0) {
            // const prodId = result[0].rawValue
            navigate(`/product/${NFC_MOCK_PRODUCT._id}`);
        } else {
            toast.error('Could not find the product.');
        }
    };

    // Helper: when NFC is detected, navigate to product
    const handleNfcDetected = (event) => {
        setIsScanning(false);
        playBase64Audio()
        // Prefer serialNumber if present (many readers/tags expose it)
        // const scannedId = event && event.serialNumber ? event.serialNumber : NFC_MOCK_PRODUCT._id;
        // Small delay so UI can settle (optional)
        setTimeout(() => {
            navigate(`/product/${NFC_MOCK_PRODUCT._id}`);
        }, 50);
    };

    const onScanError = (error) => {
        console.error("NFC Reading Error:", error);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsScanning(false);
        toast('NFC Scan failed. Ensure NFC is enabled and try tapping again.', {
            icon: <XIcon />,
        });
        // abort the scan to be safe
        if (controllerRef.current) {
            controllerRef.current.abort();
            controllerRef.current = null;
        }
    }

    // Function to initiate the NFC scan with a fallback
    const scanNfc = async () => {
        // --- STEP 1: CHECK FOR SUPPORT ---
        if (typeof window.NDEFReader === 'undefined') {
            toast('Device error: Web NFC is not supported.', {
                icon: <XIcon />,
            });
            return;
        }


        toast('Ready to scan. Hold your phone close to the product.', {
            icon: <NfcIcon />,
        });

        // Prevent duplicate scans
        if (isScanning) return;

        setIsScanning(true);

        try {
            // Create or reuse reader instance
            if (!nfcRef.current) {
                nfcRef.current = new window.NDEFReader();
            }

            // AbortController so we can stop the scan cleanly
            if (controllerRef.current) {
                // previous controller exists -> abort it first
                controllerRef.current.abort();
                controllerRef.current = null;
            }
            controllerRef.current = new AbortController();

            // Start scanning (pass the signal so we can cancel)
            await nfcRef.current.scan({ signal: controllerRef.current.signal });

            // Set the manual bypass timer for the hackathon demo
            timeoutRef.current = setTimeout(() => {
                // If 8 seconds pass, offer manual navigation
                toast('Scan failed or timed out.', {
                    description: 'Please make sure your phone is close to the product.',
                    icon: <XIcon />,
                });

                setIsScanning(false); // Stop spinner
                // abort the scan to clean up
                if (controllerRef.current) {
                    controllerRef.current.abort();
                    controllerRef.current = null;
                }
            }, 8000); // 8-second timeout

            // Prepare listeners (store refs so we can remove them on cleanup)
            readingListenerRef.current = (event) => {
                // Clear timeout and proceed even if there are no records (locked tag / reader)
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
                // Some ATMs/readers don't expose NDEF records but will still fire 'reading'
                // So we accept that as detection. Event may include serialNumber.
                handleNfcDetected(event);
            };

            errorListenerRef.current = handleNfcDetected;

            // Add listeners
            nfcRef.current.addEventListener('reading', readingListenerRef.current);
            nfcRef.current.addEventListener('readingerror', errorListenerRef.current);

        } catch (error) {
            console.error("NFC Scan initiation failed:", error);
            setIsScanning(false);
            // If the controller exists, abort and cleanup
            if (controllerRef.current) {
                try { controllerRef.current.abort(); } catch (e) { }
                controllerRef.current = null;
            }
            toast('NFC setup failed. Please try tapping the button again.', {
                icon: <XIcon />,
            });
        }
    };

    // Cleanup NFC listener on component unmount
    useEffect(() => {
        return () => {
            // Abort any active scan
            if (controllerRef.current) {
                try { controllerRef.current.abort(); } catch (e) { }
                controllerRef.current = null;
            }

            // Remove attached listeners if present
            try {
                if (nfcRef.current) {
                    if (readingListenerRef.current) {
                        nfcRef.current.removeEventListener('reading', readingListenerRef.current);
                        readingListenerRef.current = null;
                    }
                    if (errorListenerRef.current) {
                        nfcRef.current.removeEventListener('readingerror', errorListenerRef.current);
                        errorListenerRef.current = null;
                    }
                }
            } catch (e) {
                // ignore removal errors
            }

            // Clear timeout if any
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }

            setIsScanning(false);
        };
    }, []);

    const navItems = [
        { page: 'home', icon: <Home size={24} strokeWidth={activePage === 'home' ? 2.5 : 2} />, label: 'Home' },
        { page: 'categories', icon: <LayoutGrid size={24} strokeWidth={activePage === 'categories' ? 2.5 : 2} />, label: 'Categories' },
        { page: 'cart', icon: <ShoppingCart size={24} strokeWidth={activePage === 'cart' ? 2.5 : 2} />, label: 'Cart', count: cartCount },
        { page: 'settings', icon: <Settings size={24} strokeWidth={activePage === 'settings' ? 2.5 : 2} />, label: 'Settings' },
    ];

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t flex justify-around p-2 max-w-md mx-auto z-50 h-[60px]">
                <Toaster />
                {/* NFC/Scan Button - Only visible on Home page */}
                {activePage === 'home' && (
                    <div className="absolute right-0 bottom-[60px] p-4 flex flex-col gap-4">
                        <Button
                            onClick={() => setIsScanModalOpen(true)}
                            size="icon"
                            className="shadow-lg h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700"
                        >
                            <ScanIcon size={24} />
                        </Button>

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
                )}

                {navItems.map(item => (
                    <NavItem key={item.page} {...item} isActive={activePage === item.page} onNavigate={onNavigate} />
                ))}
            </nav>
            <ScanModal
                isOpen={isScanModalOpen}
                onClose={() => setIsScanModalOpen(false)}
                onScanSuccess={handleScanSuccess}
            />
        </>
    );
};

export default BottomNav;
