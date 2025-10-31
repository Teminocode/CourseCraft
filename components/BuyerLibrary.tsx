
import React from 'react';
// Fix: Use relative path for type imports
import { Product } from '../types';
import ProductCard from './ProductCard';

interface BuyerLibraryProps {
  products: Product[];
  onViewContent: (product: Product) => void;
}

const BuyerLibrary: React.FC<BuyerLibraryProps> = ({ products, onViewContent }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Library</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} context="library" onViewContent={onViewContent} />
        ))}
      </div>
    </div>
  );
};

export default BuyerLibrary;
