import type { Order } from './order';
import type { User } from './auth';

export type PaymentMethod = 'cod' | 'credit_card' | 'paypal' | 'bank_transfer' | 'momo' | 'vnpay';
export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'refunded';

export interface Payment {
  id: number;
  documentId?: string;
  method?: PaymentMethod;
  transaction_id?: string; // Text field in backend
  amount?: number; // Decimal field
  status_payment?: PaymentStatus;
  paid_at?: string | null;
  order?: Order | number | null; // manyToOne relation - Payment belongs to one Order
  users_permissions_user?: User | number | null; // manyToOne relation - Payment belongs to one User
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentResponse {
  data: Payment[];
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

