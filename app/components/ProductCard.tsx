'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../types/product';
import { useCart } from '../contexts/CartContext';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [images, setImages] = useState<{ id: number; url: string; alternativeText?: string }[]>([]);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    if (product.image_url && product.image_url.length > 0) {
      setImages(product.image_url);
      setLoadingImage(false);
    } else {
      setLoadingImage(false); // No images to load
    }
  }, [product.image_url]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const imageUrl = images.length > 0 ? images[0].url : '/placeholder-product.jpg';
  const finalPrice = product.price - (product.discount || 0);
  const discountPercentage = product.discount ? Math.round((product.discount / product.price) * 100) : 0;

  return (
    <Link href={`/products/${product.id}`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group block">
      <div className="relative aspect-square overflow-hidden">
        {loadingImage ? (
          <div className="w-full h-full bg-gray-200 animate-pulse"></div>
        ) : (
          <Image
            src={imageUrl}
            alt={images[0]?.alternativeText || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 15vw"
          />
        )}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-white text-[#E02020] text-xs font-bold px-2 py-1 rounded border border-[#E02020]">
            -{discountPercentage}%
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 h-10 group-hover:text-[#E02020]">
          {product.name}
        </h3>
        
        <div className="flex items-end justify-between">
            <div>
                <p className="text-base font-bold text-[#E02020]">
                    {formatPrice(finalPrice)}
                </p>
                {product.discount && product.discount > 0 && (
                    <p className="text-xs text-gray-500 line-through">
                        {formatPrice(product.price)}
                    </p>
                )}
            </div>
        </div>

        <button 
          onClick={handleAddToCart}
          className="w-full mt-3 bg-[#E02020] text-white text-sm font-semibold py-2 rounded-md hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
        >
          Thêm vào giỏ
        </button>
      </div>
    </Link>
  );
}
