'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-red-600">
                Chiaki
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-red-600 font-medium">
              Trang chủ
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-red-600 font-medium">
              Sản phẩm
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-red-600 font-medium">
              Giới thiệu
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-red-600 font-medium">
              Liên hệ
            </Link>
          </nav>

          {/* Cart and User */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative text-gray-700 hover:text-red-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Xin chào, {user?.username}</span>
                <button 
                  onClick={logout}
                  className="text-gray-700 hover:text-red-600 text-sm"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Đăng nhập
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700 hover:text-red-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-red-600">
                Trang chủ
              </Link>
              <Link href="/products" className="block px-3 py-2 text-gray-700 hover:text-red-600">
                Sản phẩm
              </Link>
              <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-red-600">
                Giới thiệu
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-red-600">
                Liên hệ
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
