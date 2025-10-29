'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../types/product';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    addToCart(product);
    
    // Show feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const getFirstImage = () => {
    if (product.picture && product.picture.length > 0) {
      // Nếu URL bắt đầu bằng /, thêm base URL của Strapi
      const imageUrl = product.picture[0].url;
      if (imageUrl.startsWith('/')) {
        return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}${imageUrl}`;
      }
      return imageUrl;
    }
    return '/placeholder-product.jpg' as string;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group w-full">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={getFirstImage() as string}
            alt={product.picture?.[0]?.alternativeText || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Sale badge */}
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            -20%
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-red-600">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price * 1.25)}
              </span>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                isInCart(product.id)
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : isAdding
                  ? 'bg-yellow-600 text-white cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isInCart(product.id) ? 'Đã có trong giỏ' : isAdding ? 'Đang thêm...' : 'Thêm vào giỏ'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
