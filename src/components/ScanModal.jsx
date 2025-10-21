import { XIcon } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';

export const ScanModal = ({ isOpen, onClose, onScanSuccess }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-[110] rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                aria-label="Close scanner"
            >
                <XIcon size={28} />
            </button>

            {/* Title */}
            <div className="absolute top-10 z-[110] rounded-md bg-black/50 p-2 px-4 text-lg font-semibold text-white">
                Scan Product QR/Barcode
            </div>

            {/* The Scanner element */}
            <div className="h-full w-full">
                <Scanner
                    formats={["any"]}
                    onScan={onScanSuccess}
                    onError={(error) => console.log(error?.message)}
                />
            </div>
        </div>
    );
};