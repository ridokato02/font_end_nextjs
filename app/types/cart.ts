import { User } from './auth';
import { Product } from './product';

export interface Cart {
  id: number;
  documentId?: string;
  users_id?: User | number | null;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: number;
  documentId?: string;
  cart_id?: Cart | number | null;
  product_id?: Product | number | null;
  quantity: number;
  price_cart: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartResponse {
  data: Cart[];
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface CartItemResponse {
  data: CartItem[];
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

