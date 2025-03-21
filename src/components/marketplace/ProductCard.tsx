
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Star, Tag } from 'lucide-react';
import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ProductCardActions from './ProductCardActions';

interface ProductCardProps {
  product: Product;
  onUpdate?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate = () => {} }) => {
  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  // Ensure the category is one of the allowed values
  const validateCategory = (category: string): 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'other' => {
    const validCategories = ['vegetables', 'fruits', 'grains', 'dairy', 'other'] as const;
    return validCategories.includes(category as any) 
      ? (category as 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'other') 
      : 'other';
  };

  const safeCategory = validateCategory(product.category);

  return (
    <div className="relative group rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Product Actions (Edit/Delete) */}
      <ProductCardActions product={{...product, category: safeCategory}} onUpdate={onUpdate} />
      
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        {product.discountPrice && (
          <Badge className="absolute top-2 left-2 z-10 bg-red-500 border-none">
            <Tag className="h-3 w-3 mr-1" /> {discountPercentage}% OFF
          </Badge>
        )}
        
        {product.organic && (
          <Badge className="absolute top-2 right-2 z-10 bg-green-500 border-none">
            <Leaf className="h-3 w-3 mr-1" /> Organic
          </Badge>
        )}
        
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Link
            to={`/farmers/${product.farmerId}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {product.farmerName}
          </Link>
          
          {product.rating > 0 && (
            <div className="flex items-center">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        
        <div className="flex items-end justify-between mb-3">
          <div>
            {product.discountPrice ? (
              <div className="flex items-center">
                <span className="text-lg font-bold mr-2">${product.discountPrice.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            )}
            <div className="text-xs text-muted-foreground">
              per {product.unit}
            </div>
          </div>
          
          <Badge variant="outline" className="font-normal text-xs">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </Badge>
        </div>
        
        <Button className="w-full" disabled={product.stock <= 0}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
