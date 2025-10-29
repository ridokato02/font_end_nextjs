'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface CheckoutFormProps {
  onSubmit: (formData: CheckoutFormData) => void;
  isLoading?: boolean;
}

export interface CheckoutFormData {
  // Customer Information
  fullName: string;
  email: string;
  phone: string;
  
  // Shipping Information
  address: string;
  city: string;
  district: string;
  ward: string;
  note?: string;
  
  // Payment Information
  paymentMethod: 'cod' | 'bank_transfer' | 'momo' | 'zalopay';
  
  // Additional
  receiveNewsletter: boolean;
}

export default function CheckoutForm({ onSubmit, isLoading = false }: CheckoutFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user?.username || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: '',
    paymentMethod: 'cod',
    receiveNewsletter: false,
  });

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Họ tên là bắt buộc';
    if (!formData.email.trim()) newErrors.email = 'Email là bắt buộc';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc';
    else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Số điện thoại không hợp lệ';
    if (!formData.address.trim()) newErrors.address = 'Địa chỉ là bắt buộc';
    if (!formData.city.trim()) newErrors.city = 'Tỉnh/Thành phố là bắt buộc';
    if (!formData.district.trim()) newErrors.district = 'Quận/Huyện là bắt buộc';
    if (!formData.ward.trim()) newErrors.ward = 'Phường/Xã là bắt buộc';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập họ và tên"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Địa chỉ giao hàng</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ chi tiết *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Số nhà, tên đường"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tỉnh/Thành phố *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Chọn tỉnh/thành phố</option>
                <option value="hanoi">Hà Nội</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
                <option value="danang">Đà Nẵng</option>
                <option value="haiphong">Hải Phòng</option>
                <option value="cantho">Cần Thơ</option>
              </select>
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quận/Huyện *
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.district ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập quận/huyện"
              />
              {errors.district && (
                <p className="text-red-500 text-sm mt-1">{errors.district}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phường/Xã *
              </label>
              <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.ward ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập phường/xã"
              />
              {errors.ward && (
                <p className="text-red-500 text-sm mt-1">{errors.ward}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú đơn hàng
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phương thức thanh toán</h3>
        
        <div className="space-y-3">
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === 'cod'}
              onChange={handleInputChange}
              className="mr-3"
            />
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-bold">💰</span>
              </div>
              <div>
                <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
              </div>
            </div>
          </label>

          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="bank_transfer"
              checked={formData.paymentMethod === 'bank_transfer'}
              onChange={handleInputChange}
              className="mr-3"
            />
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">🏦</span>
              </div>
              <div>
                <div className="font-medium">Chuyển khoản ngân hàng</div>
                <div className="text-sm text-gray-500">Chuyển khoản qua ngân hàng</div>
              </div>
            </div>
          </label>

          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="momo"
              checked={formData.paymentMethod === 'momo'}
              onChange={handleInputChange}
              className="mr-3"
            />
            <div className="flex items-center">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-pink-600 font-bold">💳</span>
              </div>
              <div>
                <div className="font-medium">Ví MoMo</div>
                <div className="text-sm text-gray-500">Thanh toán qua ví MoMo</div>
              </div>
            </div>
          </label>

          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="zalopay"
              checked={formData.paymentMethod === 'zalopay'}
              onChange={handleInputChange}
              className="mr-3"
            />
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-600 font-bold">💳</span>
              </div>
              <div>
                <div className="font-medium">ZaloPay</div>
                <div className="text-sm text-gray-500">Thanh toán qua ZaloPay</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="receiveNewsletter"
            checked={formData.receiveNewsletter}
            onChange={handleInputChange}
            className="mr-3"
          />
          <span className="text-sm text-gray-700">
            Tôi muốn nhận thông tin khuyến mãi và sản phẩm mới qua email
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang xử lý...' : 'Đặt hàng'}
        </button>
      </div>
    </form>
  );
}
