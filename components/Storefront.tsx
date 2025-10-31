
import React from 'react';
// Fix: Use relative path for type imports
import { Product, User } from '../types';
import ProductCard from './ProductCard';

interface StorefrontProps {
    creator: User;
    products: Product[];
    onViewProduct: (product: Product) => void;
    onAddToCart: (product: Product) => void;
    onGetFree: (product: Product) => void;
}

const Storefront: React.FC<StorefrontProps> = ({ creator, products, onViewProduct, onAddToCart, onGetFree }) => {
    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">{creator.name}'s Store</h1>
                    <p className="mt-4 text-xl text-gray-600">{creator.bio}</p>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map(product => (
                            <ProductCard 
                                key={product.id}
                                product={product}
                                context="storefront"
                                onView={onViewProduct}
                                onAddToCart={onAddToCart}
                                onGetFree={onGetFree}
                                displayCurrency={creator.defaultCurrency}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-800">Coming Soon!</h2>
                        <p className="mt-2 text-gray-500">This creator hasn't published any products yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Storefront;
