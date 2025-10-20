import React from 'react';
// Import icon
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';

// Header component for pages other than Home
const PageHeader = ({ title, onBack }) => (
   
    <header className="p-4 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b h-16">
        {/* Show back button only if onBack function is provided */}
        {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2 mr-2 text-foreground">
                <ArrowLeft size={24} />
            </Button>
        )}
        {/* Page Title */}
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
    </header>
);

export default PageHeader;