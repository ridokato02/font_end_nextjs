'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../lib/orders';
import { Order, OrderItem, OrderStatus } from '../../types/order';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params?.id as string;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/orders/${orderId}`);
    }
  }, [isAuthenticated, authLoading, router, orderId]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      setLoading(true);
      setError(null);
      try {
        // Fetch order details
        const orderResponse = await orderService.getOrderById(orderId);
        const orderData = orderResponse.data;

        // Check if order belongs to current user
        if (user?.id && orderData.users_id) {
          const userId = typeof orderData.users_id === 'object' 
            ? orderData.users_id.id 
            : orderData.users_id;
          
          if (userId !== user.id) {
            setError('Bạn không có quyền xem đơn hàng này.');
            setLoading(false);
            return;
          }
        }

        setOrder(orderData);

        // If deep-populated items exist, use them; otherwise fetch
        const deepItems = Array.isArray((orderData as any).order_items)
          ? (orderData as any).order_items
          : [];
        if (deepItems.length > 0) {
          setOrderItems(deepItems);
        } else {
          const orderIdNum = typeof orderData.id === 'number' ? orderData.id : parseInt(String(orderData.id));
          const itemsResponse = await orderService.getOrderItems(orderIdNum);
          setOrderItems(itemsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId && user?.id) {
      fetchOrderDetails();
    }
  }, [orderId, user]);

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case 'đang chờ xử lý':
        return 'bg-yellow-100 text-yellow-800';
      case 'đã xử lý':
        return 'bg-blue-100 text-blue-800';
      case 'đã giao hàng':
        return 'bg-green-100 text-green-800';
      case 'hủy đơn hàng':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{error}</h3>
              <Link
                href="/orders"
                className="inline-block mt-4 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Quay lại danh sách đơn hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <p className="text-gray-600">Không tìm thấy đơn hàng.</p>
            <Link
              href="/orders"
              className="inline-block mt-4 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Quay lại danh sách đơn hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = order.shipping_fee || 0;
  const total = order.total || subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại danh sách đơn hàng
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
              <p className="text-gray-600 mt-2">Đơn hàng #{order.id}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadgeColor(
                order.status_order || 'đang chờ xử lý'
              )}`}
            >
              {order.status_order || 'đang chờ xử lý'}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Sản phẩm đã đặt</h2>
              </div>
              <div className="p-6">
                {orderItems.length === 0 ? (
                  <p className="text-gray-600">Không có sản phẩm nào trong đơn hàng này.</p>
                ) : (
                  <div className="space-y-4">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                        <div className="w-20 h-20 relative flex-shrink-0 bg-gray-100 rounded-lg">
                          {item.product_id && typeof item.product_id === 'object' && item.product_id.image_url?.[0]?.url ? (
                            <Image
                              src={item.product_id.image_url[0].url}
                              alt={item.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Số lượng: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            Đơn giá: {item.price.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Lịch sử đơn hàng</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">Đơn hàng đã được tạo</p>
                      <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  {order.completed_at && (
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-gray-900">Đơn hàng đã được xử lý</p>
                        <p className="text-sm text-gray-600">{formatDate(order.completed_at)}</p>
                      </div>
                    </div>
                  )}
                  {order.delivery_at && (
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-gray-900">Đơn hàng đã được giao</p>
                        <p className="text-sm text-gray-600">{formatDate(order.delivery_at)}</p>
                      </div>
                    </div>
                  )}
                  {order.canceled_at && (
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-gray-900">Đơn hàng đã bị hủy</p>
                        <p className="text-sm text-gray-600">{formatDate(order.canceled_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Tóm tắt đơn hàng</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính ({orderItems.length} sản phẩm)</span>
                  <span className="font-medium text-gray-900">
                    {subtotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium text-gray-900">
                    {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}₫`}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Tổng cộng</span>
                    <span className="text-red-600">{total.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Thông tin đơn hàng</h2>
              </div>
              <div className="p-6 space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <p className="font-medium text-gray-900">#{order.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Ngày đặt hàng:</span>
                  <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Trạng thái:</span>
                  <p className="font-medium text-gray-900">
                    {order.status_order || 'đang chờ xử lý'}
                  </p>
                </div>
                {order.documentId && (
                  <div>
                    <span className="text-gray-600">Mã tài liệu:</span>
                    <p className="font-medium text-gray-900">{order.documentId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <Link
                href="/products"
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors block text-center"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

