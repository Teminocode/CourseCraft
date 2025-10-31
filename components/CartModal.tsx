
import React from 'react';
import Modal from './Modal';
import Button from './Button';
// Fix: Use relative path for type imports
import type { CartItem } from '../types';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, items }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Your Cart">
            <div className="p-4">
                {items.length > 0 ? (
                    <ul className="space-y-4">
                        {items.map(item => (
                            <li key={item.product.id} className="flex justify-between items-center">
                                <span>{item.product.name}</span>
                                <span>${item.product.price}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Your cart is empty.</p>
                )}
                {items.length > 0 && <Button className="w-full mt-4">Checkout</Button>}
            </div>
        </Modal>
    );
};

export default CartModal;
