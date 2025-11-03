'use client';

import React from 'react';
import { useCart } from '../contexts/CartContext';
import Link from 'next/link';

export default function CartSummary() {
  const { items, totalItems, totalPrice } = useCart();

  const shippingFee = totalPrice > 500000 ? 0 : 30000; // Free shipping over 500k
  const finalTotal = totalPrice + shippingFee;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tạm tính ({totalItems} sản phẩm)</span>
          <span className="font-medium text-gray-900">{totalPrice.toLocaleString('vi-VN')}₫</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="font-medium text-gray-900">
            {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}₫`}
          </span>
        </div>
        
        {shippingFee > 0 && (
          <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
            Mua thêm {(500000 - totalPrice).toLocaleString('vi-VN')}₫ để được miễn phí vận chuyển
          </div>
        )}
        
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-900">Tổng cộng</span>
            <span className="text-red-600">{finalTotal.toLocaleString('vi-VN')}₫</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Link
          href="/checkout"
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors text-center block"
        >
          Tiến hành thanh toán
        </Link>
        
        <Link
          href="/products"
          className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center block"
        >
          Tiếp tục mua sắm
        </Link>
      </div>

      {/* Security badges */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Bảo mật
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Đảm bảo
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            Nhanh chóng
          </div>
        </div>
      </div>
    </div>
  );
}
