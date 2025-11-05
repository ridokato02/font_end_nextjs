import type { User } from './auth';
import type { Payment } from './payment';
import type { Coupon } from './coupon';
import type { Affiliate } from './affiliate';
import type { Product } from './product';

export type OrderStatus = 'đang chờ xử lý' | 'đã xử lý' | 'đã giao hàng' | 'hủy đơn hàng';

export interface Order {
  id: number;
  documentId?: string;
  users_id?: User | number | null;
  status_order?: OrderStatus;
  shipping_fee?: number;
  total?: number;
  payment_ids?: Payment[] | number[] | null; // oneToMany relation - Order can have multiple payments
  coupon_id?: Coupon | number | null;
  affiliate_id?: Affiliate | number | null;
  canceled_at?: string | null;
  completed_at?: string | null;
  delivery_at?: string | null;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  documentId?: string;
  order_id?: Order | number | null;
  product_id?: Product | number | null;
  name: string;
  quantity: number;
  price: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderResponse {
  data: Order[];
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface OrderItemResponse {
  data: OrderItem[];
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

