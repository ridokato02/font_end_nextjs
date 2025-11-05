'use client';

import { useEffect, useState } from 'react';
import ProductCard from './components/ProductCard';
import { Product } from './types/product';
import { productService } from './lib/products';
import { categorieService } from './lib/categories';
import { Categorie } from './types/categorie';
import Link from 'next/link';
import Banner from './components/Banner';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Categorie[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categorieService.getAllCategories();
        const rootCategories = response.data.filter(
          (cat) => cat.status_categorie === 'Active' && !cat.categorie_id
        );
        setCategories(rootCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryIcon = (categoryName: string): string => {
    const iconMap: { [key: string]: string } = {
        'Thực phẩm chức năng': '🌿',
        'Mẹ và Bé': '👶',
        'Mỹ phẩm': '💄',
        'Thời trang': '👗',
        'Đồ gia dụng nhà bếp': '🍳',
        'Thiết bị chăm sóc sức khỏe': '🏥',
        'Đồ thể thao - Du lịch': '⚽',
        'Thực phẩm - Hàng tiêu dùng': '🛒',
        'Voucher khuyến mại': '🎫',
        'Nhà Cửa & Đời Sống': '🏡',
        'Chăm sóc thú cưng': '🐕',
        'Thiết bị - Phụ kiện số': '📱',
        'Điện máy - Điện lạnh': '❄️',
        'Văn phòng phẩm': '📝',
        'Ô tô, xe máy, xe đạp': '🚗',
        'Dụng cụ và thiết bị tiện ích': '🔧',
        'Ngành hàng khác': '📦',
        'Chăm sóc cá nhân': '🧴'
      };
    return iconMap[categoryName] || '📦';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 py-6">
          {/* Left Sidebar - Category List */}
          <aside className="w-full lg:w-64 flex-shrink-0 bg-white rounded-lg shadow-sm hidden lg:block h-fit sticky top-20">
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">Danh mục sản phẩm</h2>
              <nav className="space-y-1">
                {categories.map((category, index) => (
                  <Link
                    key={category.id || index}
                    href={category.slug ? `/${category.slug}` : '#'}
                    className="flex items-center p-2.5 text-gray-700 hover:bg-red-50 hover:text-[#E02020] rounded-md transition-all duration-200 group"
                  >
                    <span className="mr-3 text-xl">{getCategoryIcon(category.name)}</span>
                    <span className="text-sm font-medium group-hover:font-semibold">{category.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Hero Banner Section - Full Width */}
            <Banner />

            {/* Flash Sale Section */}
            <section className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-[#E02020] to-red-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
                    <span className="mr-2 text-2xl">⚡</span>
                    FLASH SALE
                  </h2>
                  <Link href="/flash-sale" className="text-sm font-medium text-white hover:text-yellow-200 transition-colors flex items-center">
                    Xem tất cả
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="p-4 md:p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E02020]"></div>
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {products.slice(0, 10).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>Chưa có sản phẩm flash sale</p>
                  </div>
                )}
              </div>
            </section>

            {/* Best Selling Products Section */}
            <section className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2 text-2xl">🔥</span>
                    Sản phẩm bán chạy
                  </h2>
                  <Link href="/products?sort=bestseller" className="text-sm font-medium text-[#E02020] hover:underline flex items-center">
                    Xem tất cả
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="p-4 md:p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E02020]"></div>
                  </div>
                ) : products.length > 10 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {products.slice(10, 20).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>Chưa có sản phẩm bán chạy</p>
                  </div>
                )}
              </div>
            </section>

            {/* Featured Products Section */}
            <section className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2 text-2xl">⭐</span>
                    Sản phẩm nổi bật
                  </h2>
                  <Link href="/products" className="text-sm font-medium text-[#E02020] hover:underline flex items-center">
                    Xem tất cả
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="p-4 md:p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E02020]"></div>
                  </div>
                ) : products.length > 20 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {products.slice(20, 30).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>Chưa có sản phẩm nổi bật</p>
                  </div>
                )}
              </div>
            </section>

            {/* New Products Section */}
            <section className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2 text-2xl">🆕</span>
                    Sản phẩm mới
                  </h2>
                  <Link href="/products?sort=newest" className="text-sm font-medium text-[#E02020] hover:underline flex items-center">
                    Xem tất cả
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="p-4 md:p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E02020]"></div>
                  </div>
                ) : products.length > 30 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {products.slice(30, 40).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>Chưa có sản phẩm mới</p>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
