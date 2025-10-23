import React from 'react';
import PageHeader from './components/PageHeader';
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { Plus, Minus, ShoppingCart } from 'lucide-react';

const CartPage = ({ cart, handleUpdateCart, setPaymentStatus }) => {
   
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 0 ? 50.00 : 0;
    const total = subtotal + deliveryFee;

   
    const handleCheckout = () => {
        if (cart.length === 0) return;
        setPaymentStatus('pending');
    };

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader title="My Cart" />
            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center text-muted-foreground p-8">
                    <ShoppingCart size={64} className="text-gray-300" strokeWidth={1} />
                    <h3 className="mt-4 text-lg font-semibold text-foreground">Your cart is empty</h3>
                    <p className="mt-1 text-sm">Looks like you haven't added anything yet.</p>
                </div>
            ) : (
                <main className="p-4 space-y-3 pb-48">
                    {cart.map((item) => (
                        <Card key={item._id} className="flex items-center p-3 overflow-hidden shadow-sm">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                              <img src={item.image} className="w-full h-full object-cover" alt={item.name}/>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground text-sm truncate">{item.name}</h3>
                                <p className="font-bold text-primary mt-1 text-base">ETB {item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center space-x-1.5 ml-2">
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => handleUpdateCart(item._id, -1)}><Minus size={14} /></Button>
                                <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-primary" onClick={() => handleUpdateCart(item._id, 1)}><Plus size={14} /></Button>
                            </div>
                        </Card>
                    ))}
                </main>
            )}
            {cart.length > 0 && (
                <div className="fixed bottom-[60px] left-0 right-0 bg-background/90 backdrop-blur-sm p-4 border-t max-w-md mx-auto z-40">
                   <div className="space-y-1.5 mb-3">
                        <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>ETB {subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm text-muted-foreground"><span>Delivery Fee</span><span>ETB {deliveryFee.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-lg text-foreground"><span>Total</span><span>ETB {total.toFixed(2)}</span></div>
                    </div>
                    <Button onClick={handleCheckout} className="w-full h-14 text-lg font-semibold">Proceed to Checkout</Button>
                </div>
            )}
        </div>
    );
};

export default CartPage;