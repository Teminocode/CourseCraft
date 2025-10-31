import React from 'react';
// Fix: Use relative path for type imports
import { Product } from '../types';
import ProductCard from './ProductCard';
import Icon from './Icon';

interface StudentLibraryProps {
  products: Product[];
  onViewContent: (product: Product) => void;
}

const StudentLibrary: React.FC<StudentLibraryProps> = ({ products, onViewContent }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Library</h1>
        <p className="mt-1 text-lg text-gray-600">Access all your purchased products here.</p>
      </div>
      
      <div>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                context="library" 
                onViewContent={onViewContent}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
            <Icon name="library" className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Your library is empty</h3>
            <p className="mt-1 text-sm text-gray-500">Products you purchase will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentLibrary;
