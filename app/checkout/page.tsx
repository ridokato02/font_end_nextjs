'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CheckoutForm, { CheckoutFormData } from '../components/CheckoutForm';
import OrderSummary from '../components/OrderSummary';
import { orderService } from '../lib/orders';
import { paymentService } from '../lib/payments';
import { authService } from '../lib/auth';
import { PaymentMethod } from '../types/payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, router]);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  const handleSubmit = async (formData: CheckoutFormData) => {
    setIsLoading(true);
    
    try {
      // Kiểm tra tồn kho trước khi thanh toán
      const outOfStockItems = items.filter(item => item.quantity > item.product.quantity);
      if (outOfStockItems.length > 0) {
        const productNames = outOfStockItems.map(item => item.product.name).join(', ');
        alert(`Một số sản phẩm đã hết hàng hoặc không đủ số lượng: ${productNames}. Vui lòng kiểm tra lại giỏ hàng.`);
        setIsLoading(false);
        return;
      }

      if (!user) {
        alert('Bạn cần đăng nhập để đặt hàng.');
        router.push('/login?redirect=/checkout');
        return;
      }

      // Tính tổng tiền với giá đã giảm (nếu có)
      const lineTotal = items.reduce((sum, item) => {
        const effectivePrice = Math.max(0, (item.product.price - (item.product.discount || 0)));
        return sum + effectivePrice * item.quantity;
      }, 0);

      // 0) Cập nhật thông tin user từ form (lưu vào backend)
      // Map form data sang backend User fields
      await authService.updateUser(user.id, {
        username: formData.fullName,
        email: formData.email,
        phone_number: formData.phone ? Number(formData.phone.replace(/\s/g, '')) : undefined,
        address_line: formData.address, // Backend uses 'address_line' not 'address'
        city: formData.city,
        ward: formData.ward, // Backend has 'ward' field
        country: formData.country || undefined,
        postal_code: formData.postal_code || undefined,
      });

      // 1) Tạo order trước (gắn user hiện tại)
      // Order có payment_ids (oneToMany) - sẽ thêm payment ID sau khi tạo payment
      const order = await orderService.createOrder({
        users_id: user.id,
        status_order: 'đang chờ xử lý',
        shipping_fee: '0',
        total: String(lineTotal)
      });

      // 2) Tạo payment và liên kết với order và user
      // Payment có order (manyToOne) và users_permissions_user (manyToOne)
      // Khi Payment có order field, Strapi sẽ tự động thêm payment vào payment_ids của Order (vì mappedBy: "order")
      const payment = await paymentService.createPayment({
        method: (formData.paymentMethod as PaymentMethod) || 'cod',
        amount: String(lineTotal),
        status_payment: 'pending',
        order: order.data.id, // Payment thuộc về Order - Strapi sẽ tự động thêm vào payment_ids
        users_permissions_user: user.id // Payment thuộc về User
      });

      // Note: Không cần cập nhật payment_ids vì Strapi tự động thêm payment vào payment_ids
      // khi Payment có order field (mappedBy: "order" trong schema)
      // Nếu cần cập nhật thủ công, sử dụng documentId thay vì id

      // 4) Thêm order items
      for (const item of items) {
        const effectivePrice = Math.max(0, (item.product.price - (item.product.discount || 0)));
        await orderService.addOrderItem({
          order_id: order.data.id,
          product_id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: effectivePrice
        });
      }

      // 5) Điều hướng đến trang thành công và xóa giỏ hàng
      // Chuyển hướng trước để tránh race condition với useEffect kiểm tra giỏ hàng rỗng
      router.replace(`/order-success?orderId=${order.data.id}`);
      clearCart();
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
          <p className="text-gray-600 mt-2">
            Vui lòng điền thông tin để hoàn tất đơn hàng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm onSubmit={handleSubmit} isLoading={isLoading} formId="checkout-form" />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary submitFormId="checkout-form" isLoading={isLoading} />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Tại sao chọn chúng tôi?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Sản phẩm chính hãng</h4>
              <p className="text-sm text-gray-600">100% sản phẩm chính hãng, có nguồn gốc rõ ràng</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Giao hàng nhanh</h4>
              <p className="text-sm text-gray-600">Giao hàng trong 1-3 ngày làm việc</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Đổi trả dễ dàng</h4>
              <p className="text-sm text-gray-600">Đổi trả trong 7 ngày, hoàn tiền 100%</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Bảo mật thông tin</h4>
              <p className="text-sm text-gray-600">Thông tin khách hàng được bảo mật tuyệt đối</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
