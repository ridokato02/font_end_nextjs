'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types/product';

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    // Kiểm tra stock trước khi thêm vào giỏ
    if (product.stock <= 0) {
      alert('Sản phẩm đã hết hàng!');
      return;
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        // Kiểm tra tổng số lượng không vượt quá stock
        if (newQuantity > product.stock) {
          alert(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
          return prevItems;
        }
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Kiểm tra số lượng thêm vào không vượt quá stock
        if (quantity > product.stock) {
          alert(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
          return prevItems;
        }
        return [...prevItems, {
          id: product.id,
          product,
          quantity,
          price: product.price
        }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems => {
      const item = prevItems.find(item => item.id === productId);
      if (item && quantity > item.product.stock) {
        alert(`Chỉ còn ${item.product.stock} sản phẩm trong kho!`);
        return prevItems;
      }
      
      return prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (productId: number) => {
    return items.some(item => item.id === productId);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
