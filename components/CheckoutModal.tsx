
import React from 'react';
import Modal from './Modal';
import Button from './Button';
// Fix: Use relative path for type imports
import type { CartItem } from '../types';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems }) => {
    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Checkout">
            <div className="space-y-4">
                {cartItems.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center">
                        <span>{item.product.name}</span>
                        <span>${item.product.price.toFixed(2)}</span>
                    </div>
                ))}
                <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <Button className="w-full">Confirm Purchase</Button>
            </div>
        </Modal>
    );
};

export default CheckoutModal;
