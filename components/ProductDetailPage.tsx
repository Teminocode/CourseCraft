
import React from 'react';
// Fix: Use relative path for type imports
import type { Product } from '../types';

interface ProductDetailPageProps {
    product: Product;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <img src={product.imageUrl} alt={product.name} className="w-full h-96 object-cover my-4 rounded-lg" />
            <p className="text-lg">{product.description}</p>
        </div>
    );
};

export default ProductDetailPage;
