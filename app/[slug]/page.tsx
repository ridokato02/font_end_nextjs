'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../types/product';
import { productService, getProductImages } from '../lib/products';
import { useCart } from '../contexts/CartContext';
import { categorieService } from '../lib/categories';
import { Categorie } from '../types/categorie';
import ProductCard from '../components/ProductCard';

export default function SlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';
  const { addToCart, isInCart } = useCart();
  
  // Product state
  const [product, setProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<{ id: number; url: string; alternativeText?: string }[]>([]);
  const [loadingProductImages, setLoadingProductImages] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  // Category state
  const [category, setCategory] = useState<Categorie | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  
  // Common state
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'product' | 'category' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Try to find product first
        const productRes = await productService.getProductBySlug(slug);
        if (!isMounted) return;
        
        if (productRes.data) {
          // Found product
          setProduct(productRes.data);
          setType('product');
          
          // Load product images
          if (productRes.data.image_url && productRes.data.image_url.length > 0) {
            setProductImages(productRes.data.image_url);
            setSelectedImageIndex(0);
          } else {
            // Fallback: try to fetch from API
            try {
              const images = await getProductImages(productRes.data.id);
              setProductImages(images);
              if (images.length > 0) {
                setSelectedImageIndex(0);
              }
            } catch (error) {
              console.error('Error fetching product images:', error);
            }
          }
          setLoadingProductImages(false);
        } else {
          // Try to find category
          try {
            const catRes = await categorieService.getCategorieBySlug(slug);
            if (!isMounted) return;
            setCategory(catRes.data);
            setType('category');
            
            // Load category products
            const prodRes = await productService.getProductsByCategory(catRes.data.id);
            if (!isMounted) return;
            setCategoryProducts(prodRes.data);
          } catch (catError) {
            // Neither product nor category found
            setError('Không tìm thấy sản phẩm hoặc danh mục');
          }
        }
      } catch (e: any) {
        if (!isMounted) return;
        setError('Đã xảy ra lỗi khi tải dữ liệu');
        console.error('Error loading data:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getImages = () => {
    if (productImages.length > 0) {
      return productImages;
    }
    return [{ url: '/placeholder-product.jpg', alternativeText: product?.name || 'Product' }];
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (product.quantity <= 0 || product.status_product === 'ngừng kinh doanh') {
      alert('Sản phẩm đã hết hàng hoặc ngừng kinh doanh!');
      return;
    }

    if (quantity > product.quantity) {
      alert(`Chỉ còn ${product.quantity} sản phẩm trong kho!`);
      return;
    }

    setIsAdding(true);
    addToCart(product, quantity);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    if (product.quantity <= 0 || product.status_product === 'ngừng kinh doanh') {
      alert('Sản phẩm đã hết hàng hoặc ngừng kinh doanh!');
      return;
    }

    if (quantity > product.quantity) {
      alert(`Chỉ còn ${product.quantity} sản phẩm trong kho!`);
      return;
    }

    // Add to cart and navigate to cart page
    addToCart(product, quantity);
    router.push('/cart');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <Link href="/products" className="text-red-600 hover:text-red-700">
            ← Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  // Product detail page
  if (type === 'product' && product) {
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
                {loadingProductImages ? (
                  <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-200 animate-pulse flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* Product Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                
                {/* Category */}
                {product.category_id && typeof product.category_id === 'object' && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">Danh mục: </span>
                    <Link 
                      href={`/${product.category_id.slug}`}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      {product.category_id.name}
                    </Link>
                  </div>
                )}

                <div className="flex items-center mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-red-600">
                      {formatPrice(product.price - (product.discount || 0))}
                    </span>
                    {product.discount && product.discount > 0 && (
                      <>
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                        <div className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                          -{Math.round((product.discount / product.price) * 100)}%
                        </div>
                      </>
                    )}
                    {!product.discount && (
                      <span className="text-lg text-gray-500">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  <span className="ml-4 text-sm text-gray-600">Đã bán {product.sold ?? 0}</span>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description_product || 'Không có mô tả'}
                  </p>
                </div>

                {/* Stock Status */}
                <div className="mb-4">
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
                  {product.status_product === 'ngừng kinh doanh' && (
                    <span className="ml-2 text-sm text-red-600 font-medium">
                      (Ngừng kinh doanh)
                    </span>
                  )}
                  {product.featured === 'có' && (
                    <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      ⭐ Nổi bật
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Số lượng</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className={`w-10 h-10 border text-gray-900 border-gray-300 rounded-lg flex items-center justify-center ${
                        quantity <= 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      -
                    </button>
                    <span className="text-lg font-medium w-12 text-center text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= product.quantity || product.status_product === 'ngừng kinh doanh'}
                      className={`w-10 h-10 border text-gray-900 border-gray-300 rounded-lg flex items-center justify-center ${
                        quantity >= product.quantity || product.status_product === 'ngừng kinh doanh'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      +
                    </button>
                  </div>
                  {quantity >= product.quantity && product.quantity > 0 && (
                    <p className="text-sm text-red-600 mt-1">
                      Đã đạt giới hạn số lượng có sẵn
                    </p>
                  )}
                </div>

                <div className="flex space-x-4 mb-8">
                  <button 
                    onClick={handleAddToCart}
                    disabled={product.quantity <= 0 || product.status_product === 'ngừng kinh doanh' || isAdding || isInCart(product.id)}
                    className={`flex-1 py-3 px-6 rounded-lg transition-colors font-medium ${
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
                      : 'Thêm vào giỏ hàng'
                    }
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    disabled={product.quantity <= 0 || product.status_product === 'ngừng kinh doanh'}
                    className={`flex-1 py-3 px-6 rounded-lg transition-colors font-medium ${
                      product.quantity <= 0 || product.status_product === 'ngừng kinh doanh'
                        ? 'bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed'
                        : 'bg-white text-red-600 border border-red-600 hover:bg-red-50'
                    }`}
                  >
                    {product.quantity <= 0 || product.status_product === 'ngừng kinh doanh' ? 'Hết hàng' : 'Mua ngay'}
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

  // Category detail page
  if (type === 'category' && category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {category.name}
              </h1>
              <p className="text-lg text-gray-600">
                {category.description_categorie || 'Các sản phẩm thuộc danh mục này'}
              </p>
            </div>

            {categoryProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có sản phẩm</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return null;
}
