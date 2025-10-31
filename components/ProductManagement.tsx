import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import Icon from './Icon';

interface ProductManagementProps {
    products: Product[];
    onEditProduct: (product: Product) => void;
    onDeleteProduct: (product: Product) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ products, onEditProduct, onDeleteProduct }) => {
    return (
        <div>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            context="dashboard"
                            onEdit={onEditProduct}
                            onDelete={onDeleteProduct}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-lg">
                    <Icon name="briefcase" className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No products yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Click "Add New Product" to create your first one.</p>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
