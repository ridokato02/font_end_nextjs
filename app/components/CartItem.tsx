'use client';

import React from 'react';
import { CartItem as CartItemType } from '../contexts/CartContext';
import { useCart } from '../contexts/CartContext';
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="w-20 h-20 relative flex-shrink-0">
          <Image
            src={item.product.picture?.[0]?.url || '/placeholder-product.jpg'}
            alt={item.product.picture?.[0]?.alternativeText || item.product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {item.product.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {item.product.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-red-600">
              {item.price.toLocaleString('vi-VN')}₫
            </span>
            <span className={`text-sm font-medium ${
              item.product.stock > 10 
                ? 'text-green-600' 
                : item.product.stock > 0 
                ? 'text-yellow-600' 
                : 'text-red-600'
            }`}>
              Còn {item.product.stock} sản phẩm
            </span>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
          >
            -
          </button>
          <span className="w-12 text-center font-semibold">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.product.stock}
            className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center ${
              item.quantity >= item.product.stock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-50'
            }`}
          >
            +
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <div className="text-lg font-bold text-red-600">
            {(item.price * item.quantity).toLocaleString('vi-VN')}₫
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Xóa sản phẩm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
