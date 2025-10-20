import React, {useEffect, useRef} from 'react';
// Import icons from lucide-react library
import {Home, LayoutGrid, ShoppingCart, Settings, ScanIcon, NfcIcon} from 'lucide-react';
import {Button} from '@/components/ui/Button.jsx';

// Reusable component for each navigation item
const NavItem = ({page, icon, label, isActive, onNavigate, count}) => {
 
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
        <span
          className="absolute top-0 right-1/2 translate-x-3 md:translate-x-4 w-4 h-4 bg-primary text-white text-[10px] leading-4 font-bold rounded-full flex items-center justify-center">
                    {/* Display count or 9+ */}
          {count > 9 ? '9+' : count}
                </span>
      )}
    </button>
  );
};

// Main Bottom Navigation Bar component
const BottomNav = ({activePage, onNavigate, cartCount}) => {
 
  const navItems = [
    {page: 'home', icon: <Home size={24} strokeWidth={activePage === 'home' ? 2.5 : 2}/>, label: 'Home'},
    {
      page: 'categories',
      icon: <LayoutGrid size={24} strokeWidth={activePage === 'categories' ? 2.5 : 2}/>,
      label: 'Categories',
    },
    {
      page: 'cart',
      icon: <ShoppingCart size={24} strokeWidth={activePage === 'cart' ? 2.5 : 2}/>,
      label: 'Cart',
      count: cartCount,
    },
    {
      page: 'settings',
      icon: <Settings size={24} strokeWidth={activePage === 'settings' ? 2.5 : 2}/>,
      label: 'Settings',
    },
  ];

  const nfc = useRef(null);

  const onNfcData = () => {
    // TODO: retrieve product
    alert("Scan");
  };

  const scanNfc = async () => {
    if (nfc.current == null) {
      if (typeof window.NDEFReader == 'undefined') {
        alert('Your device doesn\'t support this feature.');
        return;
      }

      nfc.current = new NDEFReader();
      await nfc.current.scan();
    }

    const reader = nfc.current;

    reader.addEventListener('reading', onNfcData);
    reader.addEventListener('readingerror', onNfcData);
  };

  useEffect(() => {
    return () => {
      if (nfc.current == null)
        return;

      const reader = nfc.current;
      reader.removeEventListener('reading', onNfcData);
      reader.removeEventListener('readingerror', onNfcData);
      nfc.current = null;
    };
  }, []);

  return (
   
    <nav
      className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t flex justify-around p-2 max-w-md mx-auto z-50 h-[60px]">

      <div className="absolute right-0 bottom-[60px] p-4 flex gap-2">
        <Button onClick={scanNfc} size="icon" className="shadow-md">
          <NfcIcon/>
        </Button>
      </div>

      {navItems.map(item => (
       
        <NavItem key={item.page} {...item} isActive={activePage === item.page} onNavigate={onNavigate}/>
      ))}
    </nav>
  );
};

export default BottomNav;
