'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../types/product';
import { productService } from '../../lib/products';
import { useCart } from '../../contexts/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart, isInCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (params.id) {
          const response = await productService.getProductById(Number(params.id));
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getImages = () => {
    if (product?.picture && product.picture.length > 0) {
      return product.picture;
    }
    return [{ url: '/placeholder-product.jpg', alternativeText: product?.name || 'Product' }];
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (product.stock <= 0) {
      alert('Sản phẩm đã hết hàng!');
      return;
    }

    if (quantity > product.stock) {
      alert(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
      return;
    }

    setIsAdding(true);
    addToCart(product, quantity);
    
    // Show feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sản phẩm không tồn tại</h1>
          <Link href="/products" className="text-red-600 hover:text-red-700">
            ← Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const images = getImages();

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-red-600">Trang chủ</Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/products" className="hover:text-red-600">Sản phẩm</Link>
              </li>
              <li>/</li>
              <li className="text-gray-900">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                <Image
                  src={images[selectedImageIndex].url}
                  alt={images[selectedImageIndex].alternativeText || product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 ${
                        selectedImageIndex === index ? 'border-red-600' : 'border-gray-300'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.alternativeText || product.name}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-red-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price * 1.25)}
                  </span>
                </div>
                <div className="ml-4 bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                  -20%
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                <span className={`text-sm font-medium ${
                  product.stock > 10 
                    ? 'text-green-600' 
                    : product.stock > 0 
                    ? 'text-yellow-600' 
                    : 'text-red-600'
                }`}>
                  {product.stock > 10 
                    ? `Còn hàng (${product.stock} sản phẩm)`
                    : product.stock > 0 
                    ? `Sắp hết hàng (${product.stock} sản phẩm)`
                    : 'Hết hàng'
                  }
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Số lượng</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className={`w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center ${
                      quantity <= 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    -
                  </button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className={`w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center ${
                      quantity >= product.stock 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    +
                  </button>
                </div>
                {quantity >= product.stock && product.stock > 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    Đã đạt giới hạn số lượng có sẵn
                  </p>
                )}
              </div>

              <div className="flex space-x-4 mb-8">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || isAdding || isInCart(product.id)}
                  className={`flex-1 py-3 px-6 rounded-lg transition-colors font-medium ${
                    product.stock <= 0
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : isInCart(product.id)
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : isAdding
                      ? 'bg-yellow-600 text-white cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {product.stock <= 0 
                    ? 'Hết hàng' 
                    : isInCart(product.id) 
                    ? 'Đã có trong giỏ' 
                    : isAdding 
                    ? 'Đang thêm...' 
                    : 'Thêm vào giỏ hàng'
                  }
                </button>
                <button 
                  disabled={product.stock <= 0}
                  className={`flex-1 py-3 px-6 rounded-lg transition-colors font-medium ${
                    product.stock <= 0
                      ? 'bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed'
                      : 'bg-white text-red-600 border border-red-600 hover:bg-red-50'
                  }`}
                >
                  {product.stock <= 0 ? 'Hết hàng' : 'Mua ngay'}
                </button>
              </div>

              {/* Product Features */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tính năng nổi bật</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Chất lượng cao, chính hãng
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Giao hàng miễn phí
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Đổi trả trong 30 ngày
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Bảo hành 12 tháng
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
