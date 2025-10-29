'use client';

import React from 'react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Đặt hàng thành công!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
        </p>

        {/* Order Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Mã đơn hàng: <span className="font-semibold text-gray-900">#ORD-{Date.now().toString().slice(-6)}</span></p>
            <p>• Thời gian đặt hàng: <span className="font-semibold text-gray-900">{new Date().toLocaleString('vi-VN')}</span></p>
            <p>• Dự kiến giao hàng: <span className="font-semibold text-gray-900">1-3 ngày làm việc</span></p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-left mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Bước tiếp theo:</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>1. Chúng tôi sẽ gửi email xác nhận đơn hàng</p>
            <p>2. Đơn hàng sẽ được chuẩn bị và đóng gói</p>
            <p>3. Bạn sẽ nhận được thông báo khi hàng được giao</p>
            <p>4. Kiểm tra và thanh toán khi nhận hàng (COD)</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/products"
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors block"
          >
            Tiếp tục mua sắm
          </Link>
          
          <Link
            href="/"
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors block"
          >
            Về trang chủ
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t">
          <p className="text-sm text-gray-500 mb-2">Cần hỗ trợ?</p>
          <div className="text-sm text-gray-600 space-y-1">
            <p>📞 Hotline: 1900 1234</p>
            <p>📧 Email: support@chiaki.vn</p>
            <p>💬 Chat: 24/7 online support</p>
          </div>
        </div>
      </div>
    </div>
  );
}
