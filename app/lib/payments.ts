import { apiClient } from './api';
import { Payment, PaymentResponse, PaymentMethod, PaymentStatus } from '../types/payment';

// Helper function để transform Strapi Payment
function transformStrapiPayment(strapiPayment: any): Payment {
  let data = strapiPayment.data || strapiPayment;
  if (!data) {
    throw new Error('Invalid payment data: missing data field');
  }

  if (data.method && !data.attributes) {
    return data as Payment;
  }

  const attributes = data.attributes || {};

  return {
    id: data.id,
    documentId: data.documentId || attributes.documentId,
    method: attributes.method || 'cod',
    transaction_id: attributes.transaction_id || '',
    amount: attributes.amount ? Number(attributes.amount) : 0,
    status_payment: attributes.status_payment || 'pending',
    paid_at: attributes.paid_at || null,
    // order is manyToOne relation - Payment belongs to one Order
    order: attributes.order?.data ? { id: attributes.order.data.id } : attributes.order,
    // users_permissions_user is manyToOne relation - Payment belongs to one User
    users_permissions_user: attributes.users_permissions_user?.data 
      ? { id: attributes.users_permissions_user.data.id } 
      : attributes.users_permissions_user,
    publishedAt: attributes.publishedAt || data.publishedAt || '',
    createdAt: attributes.createdAt || data.createdAt || '',
    updatedAt: attributes.updatedAt || data.updatedAt || ''
  };
}

function transformStrapiPaymentList(strapiResponse: any): PaymentResponse {
  const payments = Array.isArray(strapiResponse.data) 
    ? strapiResponse.data.map((item: any) => transformStrapiPayment({ data: item }))
    : [];

  return {
    data: payments,
    meta: strapiResponse.meta
  };
}

export const paymentService = {
  // Lấy danh sách tất cả payments
  async getAllPayments(): Promise<PaymentResponse> {
    const response = await apiClient.get<any>('/api/payments?populate=*&sort=createdAt:desc');
    return transformStrapiPaymentList(response);
  },

  // Lấy payment theo ID
  async getPaymentById(id: string | number): Promise<{ data: Payment }> {
    try {
      const response = await apiClient.get<any>(`/api/payments/${id}?populate=*`);
      return { data: transformStrapiPayment(response) };
    } catch (error) {
      // Fallback: try by documentId filter
      try {
        const byDoc = await apiClient.get<any>(`/api/payments?filters[documentId][$eq]=${encodeURIComponent(id)}&populate=*`);
        if (byDoc?.data && Array.isArray(byDoc.data) && byDoc.data.length > 0) {
          return { data: transformStrapiPayment({ data: byDoc.data[0] }) };
        }
      } catch {}
      throw error;
    }
  },

  // Tạo payment mới
  async createPayment(paymentData: {
    method: PaymentMethod;
    amount: number | string;
    transaction_id?: string;
    status_payment?: PaymentStatus;
    order?: number; // manyToOne - Payment belongs to one Order
    users_permissions_user?: number; // manyToOne - Payment belongs to one User
  }): Promise<{ data: Payment }> {
    const response = await apiClient.post<any>('/api/payments', { 
      data: {
        ...paymentData,
        amount: paymentData.amount !== undefined ? String(paymentData.amount) : '0'
      }
    });
    return {
      data: transformStrapiPayment(response)
    };
  },

  // Cập nhật payment
  async updatePayment(id: number, paymentData: Partial<Payment>): Promise<{ data: Payment }> {
    const response = await apiClient.put<any>(`/api/payments/${id}`, { data: paymentData });
    return {
      data: transformStrapiPayment(response)
    };
  },

  // Cập nhật trạng thái payment
  async updatePaymentStatus(id: number, status: PaymentStatus, transactionId?: string): Promise<{ data: Payment }> {
    const updateData: any = { status_payment: status };
    
    if (transactionId) {
      updateData.transaction_id = transactionId;
    }

    if (status === 'successful') {
      updateData.paid_at = new Date().toISOString();
    }

    return this.updatePayment(id, updateData);
  },

  // Xóa payment
  async deletePayment(id: number): Promise<void> {
    await apiClient.delete<any>(`/api/payments/${id}`);
  },

  // Lấy payments theo status
  async getPaymentsByStatus(status: PaymentStatus): Promise<PaymentResponse> {
    const response = await apiClient.get<any>(`/api/payments?filters[status_payment][$eq]=${status}&populate=*&sort=createdAt:desc`);
    return transformStrapiPaymentList(response);
  },

  // Lấy payments theo method
  async getPaymentsByMethod(method: PaymentMethod): Promise<PaymentResponse> {
    const response = await apiClient.get<any>(`/api/payments?filters[method][$eq]=${method}&populate=*&sort=createdAt:desc`);
    return transformStrapiPaymentList(response);
  },

  // Lấy payments theo order
  async getPaymentsByOrder(orderId: number): Promise<PaymentResponse> {
    const response = await apiClient.get<any>(`/api/payments?filters[order][id][$eq]=${orderId}&populate=*&sort=createdAt:desc`);
    return transformStrapiPaymentList(response);
  },

  // Lấy payments theo user
  async getPaymentsByUser(userId: number): Promise<PaymentResponse> {
    const response = await apiClient.get<any>(`/api/payments?filters[users_permissions_user][id][$eq]=${userId}&populate=*&sort=createdAt:desc`);
    return transformStrapiPaymentList(response);
  },

  // Lấy payment theo transaction_id
  async getPaymentByTransactionId(transactionId: string): Promise<{ data: Payment | null }> {
    try {
      const response = await apiClient.get<any>(`/api/payments?filters[transaction_id][$eq]=${encodeURIComponent(transactionId)}&populate=*`);
      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        return { data: transformStrapiPayment({ data: response.data[0] }) };
      }
      return { data: null };
    } catch (error) {
      return { data: null };
    }
  }
};

