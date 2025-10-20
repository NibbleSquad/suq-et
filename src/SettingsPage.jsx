import React from 'react';
// Import reusable components and icons
import PageHeader from './components/PageHeader';
import { Card } from "./components/ui/Card";
import { ChevronRight, User, CreditCard, History, Bell, HelpCircle, LogOut } from 'lucide-react';

// Settings Page Component
const SettingsPage = () => {
   
    const settingsItems = [
        { label: "My Profile", icon: <User size={20} className="text-muted-foreground" /> },
        { label: "Payment Methods", icon: <CreditCard size={20} className="text-muted-foreground" /> },
        { label: "Order History", icon: <History size={20} className="text-muted-foreground" /> },
        { label: "Notifications", icon: <Bell size={20} className="text-muted-foreground" /> },
        { label: "Help Center", icon: <HelpCircle size={20} className="text-muted-foreground" /> },
        { label: "Log Out", icon: <LogOut size={20} className="text-red-500" />, color: "text-red-500" },
    ];
    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader title="Settings" />
            <main className="p-4">
                <Card>
                    {/* Map through settings items and display each one */}
                    {settingsItems.map((item, index) => (
                        <div
                            key={item.label}
                           
                            className={`flex items-center p-4 ${index < settingsItems.length - 1 ? 'border-b' : ''} cursor-pointer hover:bg-secondary/50 active:bg-secondary/80`}
                           
                        >
                            {/* Icon */}
                            {item.icon}
                            {/* Label */}
                            <p className={`flex-1 ml-4 font-medium text-sm ${item.color || 'text-foreground'}`}>{item.label}</p>
                            {/* Chevron icon indicating navigation */}
                            <ChevronRight size={18} className="text-muted-foreground" />
                        </div>
                    ))}
                </Card>
            </main>
        </div>
    );
};

export default SettingsPage;