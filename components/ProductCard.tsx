
import React from 'react';
// Fix: Use relative path for type imports
import { Product, Currency } from '../types';
import Button from './Button';
import StarRating from './StarRating';
import Icon from './Icon';

interface ProductCardProps {
  product: Product;
  context: 'storefront' | 'library' | 'dashboard';
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onViewContent?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onGetFree?: (product: Product) => void;
  displayCurrency?: Currency;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
    product, context, onView, onEdit, onDelete, onViewContent, onAddToCart, onGetFree, displayCurrency 
}) => {
  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    : 0;
  
  const formatPrice = (price: number, currency: Currency) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
  };

  const finalCurrency = displayCurrency || product.currency;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group border hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <button onClick={() => context === 'storefront' ? onView?.(product) : onViewContent?.(product)} className="block w-full">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
        </button>
        <div className="absolute top-2 right-2 bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">{product.type}</div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
        {context === 'storefront' && (
          <div className="flex items-center mt-1">
            <StarRating rating={averageRating} size="sm" />
            <span className="text-xs text-gray-500 ml-2">{product.reviews?.length || 0} reviews</span>
          </div>
        )}
        <p className="text-sm text-gray-600 mt-2 flex-grow">{product.description.substring(0, 100)}{product.description.length > 100 ? '...' : ''}</p>
        
        <div className="mt-4">
          <p className="text-xl font-bold text-gray-900">{formatPrice(product.price, finalCurrency)}</p>
        </div>
      </div>
      <div className="p-4 bg-gray-50 border-t">
        {context === 'storefront' && (
          <>
            <Button onClick={() => onView?.(product)} variant="secondary" className="w-full mb-2">View Details</Button>
            {product.price === 0 ? (
                <Button onClick={() => onGetFree?.(product)} className="w-full">Get for Free</Button>
            ) : (
                <Button onClick={() => onAddToCart?.(product)} className="w-full">Add to Cart</Button>
            )}
          </>
        )}
        {context === 'library' && <Button onClick={() => onViewContent?.(product)} className="w-full">View Content</Button>}
        {context === 'dashboard' && (
          <div className="flex gap-2">
            <Button onClick={() => onEdit?.(product)} variant="secondary" className="flex-1">
                <Icon name="edit" className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button onClick={() => onDelete?.(product)} variant="ghost" className="text-red-600 flex-1 hover:bg-red-50">
                <Icon name="trash" className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
