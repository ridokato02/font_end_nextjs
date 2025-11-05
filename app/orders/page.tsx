'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../lib/orders';
import { Order, OrderStatus } from '../types/order';

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);
      try {
        const response = await orderService.getOrdersByUserId(user.id);
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

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

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status_order === filterStatus);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
          <p className="text-gray-600 mt-2">
            Xem tất cả đơn hàng bạn đã đặt
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus('đang chờ xử lý')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'đang chờ xử lý'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đang chờ xử lý ({orders.filter(o => o.status_order === 'đang chờ xử lý').length})
            </button>
            <button
              onClick={() => setFilterStatus('đã xử lý')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'đã xử lý'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đã xử lý ({orders.filter(o => o.status_order === 'đã xử lý').length})
            </button>
            <button
              onClick={() => setFilterStatus('đã giao hàng')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'đã giao hàng'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đã giao hàng ({orders.filter(o => o.status_order === 'đã giao hàng').length})
            </button>
            <button
              onClick={() => setFilterStatus('hủy đơn hàng')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'hủy đơn hàng'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đã hủy ({orders.filter(o => o.status_order === 'hủy đơn hàng').length})
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filterStatus === 'all' ? 'Chưa có đơn hàng nào' : `Chưa có đơn hàng ${filterStatus}`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'all' 
                ? 'Bạn chưa đặt đơn hàng nào. Hãy bắt đầu mua sắm ngay!' 
                : `Bạn chưa có đơn hàng nào với trạng thái "${filterStatus}"`}
            </p>
            <Link
              href="/products"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Đơn hàng #{order.id}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                            order.status_order || 'đang chờ xử lý'
                          )}`}
                        >
                          {order.status_order || 'đang chờ xử lý'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Ngày đặt:</span>{' '}
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Tổng tiền:</span>{' '}
                          <span className="text-red-600 font-semibold">
                            {order.total?.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        {order.delivery_at && (
                          <div>
                            <span className="font-medium">Ngày giao:</span>{' '}
                            {new Date(order.delivery_at).toLocaleDateString('vi-VN')}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href={`/orders/${order.id}`}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

