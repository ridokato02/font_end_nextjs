'use client';

import React from 'react';
import { useCart } from '../contexts/CartContext';
import Image from 'next/image';

export default function OrderSummary() {
  const { items, totalItems, totalPrice } = useCart();

  const shippingFee = totalPrice > 500000 ? 0 : 30000;
  const finalTotal = totalPrice + shippingFee;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
      
      {/* Stock Warning */}
      {items.some(item => item.product.stock <= 5) && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-yellow-800">
              Một số sản phẩm sắp hết hàng. Vui lòng đặt hàng sớm để đảm bảo có sản phẩm.
            </p>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image
                src={item.product.picture?.[0]?.url || '/placeholder-product.jpg'}
                alt={item.product.picture?.[0]?.alternativeText || item.product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {item.product.name}
              </h4>
              <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
              <p className={`text-xs ${
                item.product.stock > 10 
                  ? 'text-green-600' 
                  : item.product.stock > 0 
                  ? 'text-yellow-600' 
                  : 'text-red-600'
              }`}>
                Còn {item.product.stock} sản phẩm
              </p>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {(item.price * item.quantity).toLocaleString('vi-VN')}₫
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 border-t pt-4">
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

      {/* Security Information */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
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

      {/* Delivery Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Thông tin giao hàng</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Giao hàng trong 1-3 ngày làm việc</p>
          <p>• Miễn phí vận chuyển cho đơn hàng từ 500.000₫</p>
          <p>• Hỗ trợ đổi trả trong 7 ngày</p>
        </div>
      </div>

      <div className="mt-6">
        <button className="bg-red-600 text-white w-full px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Đặt hàng
        </button>
      </div>
    </div>
  );
}
