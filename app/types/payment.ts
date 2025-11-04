export type PaymentMethod = 'cod' | 'credit_card' | 'paypal' | 'bank_transfer' | 'momo' | 'vnpay';
export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'refunded';

export interface Payment {
  id: number;
  documentId?: string;
  method?: PaymentMethod;
  transaction_id?: string;
  amount?: number;
  status_payment?: PaymentStatus;
  paid_at?: string | null;
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

