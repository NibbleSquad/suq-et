import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';

const PaymentStatusModal = ({ paymentStatus, setPaymentStatus }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (paymentStatus === 'pending') {
            const timer = setTimeout(() => {
                setPaymentStatus('success');
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [paymentStatus, setPaymentStatus]);

    const handleDone = () => {
        setPaymentStatus('idle');
        navigate('/');
    };

    if (paymentStatus === 'idle') return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
                {paymentStatus === 'pending' && (
                    <div className="bg-background rounded-lg p-8 flex flex-col items-center justify-center space-y-4 max-w-sm w-full">
                        <Loader2 className="w-16 h-16 text-primary animate-spin" />
                        <h2 className="text-xl font-semibold text-foreground">Processing Payment...</h2>
                        <p className="text-sm text-muted-foreground text-center">
                            Please wait while we process your payment
                        </p>
                    </div>
                )}

                {paymentStatus === 'success' && (
                    <Card className="max-w-sm w-full animate-in zoom-in-95 duration-300">
                        <CardHeader className="text-center pb-4">
                            <div className="flex justify-center mb-4">
                                <CheckCircle2 className="w-20 h-20 text-green-500" />
                            </div>
                            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-muted-foreground">
                                Your order has been placed successfully. Thank you for your purchase!
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-center pt-4">
                            <Button 
                                onClick={handleDone}
                                className="w-full h-12 text-lg font-semibold"
                            >
                                Done
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </>
    );
};

export default PaymentStatusModal;
