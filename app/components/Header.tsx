'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();

  const categories = [
    { name: 'Thực phẩm chức năng', icon: '🌿' },
    { name: 'Collagen', icon: '💊' },
    { name: 'Mỹ phẩm', icon: '💄' },
    { name: 'Mẹ và Bé', icon: '👶' },
    { name: 'Thời trang', icon: '👗' },
    { name: 'Đồ gia dụng', icon: '🏠' },
    { name: 'Nhà Cửa & Đời Sống', icon: '🏡' },
    { name: 'Thực phẩm - Hàng tiêu dùng', icon: '🛒' },
    { name: 'Thiết bị chăm sóc sức khỏe', icon: '🏥' },
    { name: 'Đồ thể thao - Du lịch', icon: '⚽' },
    { name: 'Sách truyện', icon: '📚' },
    { name: 'Văn phòng phẩm', icon: '📝' },
    { name: 'Thiết bị - Phụ kiện số', icon: '📱' },
    { name: 'Đồng hồ', icon: '⌚' },
    { name: 'Chăm sóc thú cưng', icon: '🐕' },
    { name: 'Điện máy - Điện lạnh', icon: '❄️' },
    { name: 'Điện thoại - Máy tính bảng', icon: '📱' },
    { name: 'Thương hiệu nổi bật', icon: '⭐' }
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Header */}
      <div className="bg-red-600 text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span>📞 Hotline: 1900 1234</span>
              <span>|</span>
              <span>🚚 Miễn phí vận chuyển cho đơn hàng trên 300.000đ</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/help" className="hover:underline">Hỗ trợ</Link>
              <span>|</span>
              <Link href="/track" className="hover:underline">Tra cứu đơn hàng</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="text-2xl lg:text-3xl font-bold text-red-600">
                Chiaki
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                className="w-full px-4 py-2.5 lg:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm lg:text-base"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white px-4 py-1.5 lg:py-2 rounded hover:bg-red-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Cart and User */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            <Link href="/cart" className="relative text-gray-700 hover:text-red-600 transition-colors">
              <svg className="w-6 h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l2.5 5M17 13h-4.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
              <span className="hidden lg:block text-xs text-gray-600 mt-1">Giỏ hàng</span>
            </Link>
            
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-xs text-gray-500">Xin chào</div>
                  <div className="text-sm font-medium text-gray-700">{user?.username}</div>
                </div>
                <button 
                  onClick={logout}
                  className="text-gray-700 hover:text-red-600 text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-red-600 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-md hover:bg-red-700 transition-colors text-sm lg:text-base font-medium"
              >
                Đăng nhập
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-gray-700 hover:text-red-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category Menu Bar */}
        <div className="hidden lg:block border-t border-gray-200 relative">
          <div className="flex items-center h-12">
            <div className="relative">
              <button
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors h-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Danh mục sản phẩm</span>
              </button>
              
              {/* Category Dropdown */}
              {isCategoryMenuOpen && (
                <div
                  onMouseEnter={() => setIsCategoryMenuOpen(true)}
                  onMouseLeave={() => setIsCategoryMenuOpen(false)}
                  className="absolute left-0 top-full bg-white shadow-lg border border-gray-200 w-64 max-h-[600px] overflow-y-auto z-50"
                >
                  <nav className="py-2">
                    {categories.map((category, index) => (
                      <Link
                        key={index}
                        href={`/products?category=${category.name}`}
                        className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <span className="text-gray-400">›</span>
                      </Link>
                    ))}
                  </nav>
                </div>
              )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex items-center space-x-6 px-4">
              <Link href="/" className="text-gray-700 hover:text-red-600 font-medium text-sm transition-colors">
                Trang chủ
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-red-600 font-medium text-sm transition-colors">
                Sản phẩm
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-red-600 font-medium text-sm transition-colors">
                Giới thiệu
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-red-600 font-medium text-sm transition-colors">
                Liên hệ
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded">
                Trang chủ
              </Link>
              <Link href="/products" className="block px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded">
                Sản phẩm
              </Link>
              <div className="px-3 py-2 text-gray-700 font-medium border-b border-gray-200">Danh mục</div>
              {categories.slice(0, 6).map((category, index) => (
                <Link
                  key={index}
                  href={`/products?category=${category.name}`}
                  className="block px-6 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded"
                >
                  {category.icon} {category.name}
                </Link>
              ))}
              <Link href="/about" className="block px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded">
                Giới thiệu
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded">
                Liên hệ
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
