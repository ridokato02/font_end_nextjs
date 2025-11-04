'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../types/product';
import { useCart } from '../contexts/CartContext';
import { useState, useEffect } from 'react';
import { getProductImages } from '../lib/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [images, setImages] = useState<{ id: number; url: string; alternativeText?: string }[]>([]);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    // Lấy ảnh trực tiếp từ product.image_url nếu có
    if (product.image_url && product.image_url.length > 0) {
      setImages(product.image_url);
      setLoadingImage(false);
    } else {
      // Fallback: thử fetch từ API nếu product chưa có image_url
      const fetchImages = async () => {
        try {
          const productImages = await getProductImages(product.id);
          setImages(productImages);
        } catch (error) {
          console.error('Error fetching product images:', error);
        } finally {
          setLoadingImage(false);
        }
      };
      fetchImages();
    }
  }, [product.id, product.image_url]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Kiểm tra quantity và status trước khi thêm vào giỏ
    if (product.quantity <= 0 || product.status_product === 'ngừng kinh doanh') {
      return;
    }
    
    setIsAdding(true);
    addToCart(product);
    
    // Show feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  // Get first image from Intermediate or use placeholder
  const getFirstImage = () => {
    if (images.length > 0) {
      return images[0].url;
    }
    return '/placeholder-product.jpg';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group w-full">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          {loadingImage ? (
            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          ) : (
            <Image
              src={getFirstImage()}
              alt={images[0]?.alternativeText || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {/* Sale badge */}
          {product.discount && product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              -{Math.round((product.discount / product.price) * 100)}%
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description_product || 'Không có mô tả'}
          </p>
          
          {/* Category */}
          {product.category_id && typeof product.category_id === 'object' && (
            <div className="mb-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {product.category_id.name}
              </span>
            </div>
          )}
          
          <div className="space-y-2">
            {/* Stock status */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${
                product.quantity > 10 
                  ? 'text-green-600' 
                  : product.quantity > 0 
                  ? 'text-yellow-600' 
                  : 'text-red-600'
              }`}>
                {product.quantity > 10 
                  ? `Còn hàng (${product.quantity} sản phẩm)`
                  : product.quantity > 0 
                  ? `Sắp hết hàng (${product.quantity} sản phẩm)`
                  : 'Hết hàng'
                }
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(product.price - (product.discount || 0))}
                </span>
                {product.discount && product.discount > 0 && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                      -{Math.round((product.discount / product.price) * 100)}%
                    </span>
                  </>
                )}
                {!product.discount && (
                  <span className="text-sm text-gray-500">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={isAdding || product.quantity <= 0 || product.status_product === 'ngừng kinh doanh' || isInCart(product.id)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  product.quantity <= 0 || product.status_product === 'ngừng kinh doanh'
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : isInCart(product.id)
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : isAdding
                    ? 'bg-yellow-600 text-white cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {product.quantity <= 0 || product.status_product === 'ngừng kinh doanh'
                  ? 'Hết hàng' 
                  : isInCart(product.id) 
                  ? 'Đã có trong giỏ' 
                  : isAdding 
                  ? 'Đang thêm...' 
                  : 'Thêm vào giỏ'
                }
              </button>
            </div>
            
            {/* Featured badge */}
            {product.featured === 'có' && (
              <div className="text-xs text-center">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  ⭐ Nổi bật
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
