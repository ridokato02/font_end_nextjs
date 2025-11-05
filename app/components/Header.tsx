'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Header */}
      <div className="bg-[#F8F8F8] text-gray-600 py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center space-x-4">
              <span>Tải ứng dụng Chiaki</span>
              <span className="text-gray-300">|</span>
              <span>Chăm sóc khách hàng</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/help" className="hover:text-[#E02020]">Tra cứu đơn hàng</Link>
              <span className="text-gray-300">|</span>
              <Link href="/track" className="hover:text-[#E02020]">Đăng ký bán hàng</Link>
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
              <div className="text-4xl font-bold text-[#E02020]">
                Chiaki
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E02020] focus:border-[#E02020] text-sm"
              />
              <button className="absolute right-0 top-0 h-full bg-[#E02020] text-white px-4 rounded-r-md hover:bg-red-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Cart and User */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative flex items-center space-x-2 text-gray-700 hover:text-[#E02020] transition-colors">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span className="text-sm">Giỏ hàng</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E02020] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-xs text-gray-500">Xin chào</div>
                  <div className="text-sm font-medium text-gray-700">{user?.username}</div>
                </div>
                <button 
                  onClick={logout}
                  className="text-gray-700 hover:text-[#E02020] text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
               <div className="hidden lg:flex items-center space-x-1">
                 <Link href="/login" className="text-sm text-gray-700 hover:text-[#E02020] transition-colors">Đăng nhập</Link>
                 <span className="text-gray-300">/</span>
                 <Link href="/register" className="text-sm text-gray-700 hover:text-[#E02020] transition-colors">Đăng ký</Link>
               </div>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-gray-700 hover:text-[#E02020]"
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
            {/* Navigation Menu */}
            <nav className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-[#E02020] font-medium text-sm transition-colors">
                <span>Trang chủ</span>
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-[#E02020] font-medium text-sm transition-colors">
                Sản phẩm
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-[#E02020] font-medium text-sm transition-colors">
                Tin tức
              </Link>
              <Link href="/orders" className="text-gray-700 hover:text-[#E02020] font-medium text-sm transition-colors">
                Đơn hàng
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
