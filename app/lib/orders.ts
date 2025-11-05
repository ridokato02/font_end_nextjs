import { apiClient } from './api';
import { Order, OrderItem, OrderResponse, OrderItemResponse, OrderStatus } from '../types/order';

// Helper function để transform Strapi Order
function transformStrapiOrder(strapiOrder: any): Order {
  let data = strapiOrder.data || strapiOrder;
  if (!data) {
    throw new Error('Invalid order data: missing data field');
  }

  if (data.users_id && !data.attributes) {
    return data as Order;
  }

  const attributes = data.attributes || {};

  return {
    id: data.id,
    documentId: data.documentId || attributes.documentId,
    users_id: attributes.users_id?.data ? { id: attributes.users_id.data.id } : attributes.users_id,
    status_order: attributes.status_order || 'đang chờ xử lý',
    shipping_fee: attributes.shipping_fee ? Number(attributes.shipping_fee) : 0,
    total: attributes.total ? Number(attributes.total) : 0,
    // payment_ids is oneToMany relation - Order can have multiple payments
    payment_ids: attributes.payment_ids?.data
      ? Array.isArray(attributes.payment_ids.data)
        ? attributes.payment_ids.data.map((p: any) => p.id || p)
        : [attributes.payment_ids.data.id || attributes.payment_ids.data]
      : attributes.payment_ids || null,
    coupon_id: attributes.coupon_id?.data ? { id: attributes.coupon_id.data.id } : attributes.coupon_id,
    affiliate_id: attributes.affiliate_id?.data ? { id: attributes.affiliate_id.data.id } : attributes.affiliate_id,
    canceled_at: attributes.canceled_at || null,
    completed_at: attributes.completed_at || null,
    delivery_at: attributes.delivery_at || null,
    publishedAt: attributes.publishedAt || data.publishedAt || '',
    createdAt: attributes.createdAt || data.createdAt || '',
    updatedAt: attributes.updatedAt || data.updatedAt || '',
    // If deep-populated order_items are present, transform them
    order_items: attributes.order_items?.data
      ? attributes.order_items.data.map((item: any) => transformStrapiOrderItem({ data: item }))
      : attributes.order_items || undefined
  };
}

// Helper function để transform Strapi OrderItem
function transformStrapiOrderItem(strapiOrderItem: any): OrderItem {
  let data = strapiOrderItem.data || strapiOrderItem;
  if (!data) {
    throw new Error('Invalid order item data: missing data field');
  }

  if (data.name && !data.attributes) {
    return data as OrderItem;
  }

  const attributes = data.attributes || {};

  return {
    id: data.id,
    documentId: data.documentId || attributes.documentId,
    order_id: attributes.order_id?.data ? transformStrapiOrder({ data: attributes.order_id.data }) : attributes.order_id,
    product_id: attributes.product_id?.data ? { id: attributes.product_id.data.id } : attributes.product_id,
    name: attributes.name || '',
    quantity: attributes.quantity || 0,
    price: attributes.price ? Number(attributes.price) : 0,
    publishedAt: attributes.publishedAt || data.publishedAt || '',
    createdAt: attributes.createdAt || data.createdAt || '',
    updatedAt: attributes.updatedAt || data.updatedAt || ''
  };
}

function transformStrapiOrderList(strapiResponse: any): OrderResponse {
  const orders = Array.isArray(strapiResponse.data) 
    ? strapiResponse.data.map((item: any) => transformStrapiOrder({ data: item }))
    : [];

  return {
    data: orders,
    meta: strapiResponse.meta
  };
}

function transformStrapiOrderItemList(strapiResponse: any): OrderItemResponse {
  const orderItems = Array.isArray(strapiResponse.data) 
    ? strapiResponse.data.map((item: any) => transformStrapiOrderItem({ data: item }))
    : [];

  return {
    data: orderItems,
    meta: strapiResponse.meta
  };
}

export const orderService = {
  // Lấy danh sách đơn hàng của user
  async getOrdersByUserId(userId: number): Promise<OrderResponse> {
    // Theo yêu cầu: chỉ cần lấy tất cả orders (không filter theo user), tránh deep populate để không bị 400
    const response = await apiClient.get<any>(`/api/orders?sort=createdAt:desc`);
    return transformStrapiOrderList(response);
  },

  // Lấy đơn hàng theo ID
  async getOrderById(id: string | number): Promise<{ data: Order }> {
    try {
      // Không dùng deep populate để tránh 400; order items sẽ fetch riêng nếu cần
      const response = await apiClient.get<any>(`/api/orders/${encodeURIComponent(String(id))}`);
      return { data: transformStrapiOrder(response) };
    } catch (error) {
      // Fallback: try by documentId filter
      try {
        const byDoc = await apiClient.get<any>(`/api/orders?filters[documentId][$eq]=${encodeURIComponent(String(id))}`);
        if (byDoc?.data && Array.isArray(byDoc.data) && byDoc.data.length > 0) {
          return { data: transformStrapiOrder({ data: byDoc.data[0] }) };
        }
      } catch {}
      throw error;
    }
  },

  // Tạo đơn hàng mới
  async createOrder(orderData: {
    users_id?: number;
    status_order?: OrderStatus;
    shipping_fee?: number | string;
    total: number | string;
    payment_ids?: number[]; // oneToMany - can have multiple payments
    coupon_id?: number;
    affiliate_id?: number;
  }): Promise<{ data: Order }> {
    const { users_id, payment_ids, ...rest } = orderData as any;
    const response = await apiClient.post<any>('/api/orders', { 
      data: {
        ...rest,
        // Gắn quan hệ user nếu có
        ...(users_id !== undefined ? { users_id } : {}),
        // payment_ids is oneToMany - can pass array of payment IDs
        ...(payment_ids !== undefined ? { payment_ids } : {}),
        // Strapi decimal fields are safest as strings
        shipping_fee: rest.shipping_fee !== undefined ? String(rest.shipping_fee) : undefined,
        total: rest.total !== undefined ? String(rest.total) : '0',
      }
    });
    return {
      data: transformStrapiOrder(response)
    };
  },

  // Cập nhật đơn hàng
  async updateOrder(id: number | string, orderData: Partial<Order>): Promise<{ data: Order }> {
    try {
      // Strapi v4+ uses documentId (UUID) for PUT requests, not numeric id
      // Try with documentId first if it's a string UUID, otherwise use id
      let orderId = id;
      
      // If id is a number, try to get documentId first
      if (typeof id === 'number') {
        try {
          const order = await this.getOrderById(id);
          if (order.data.documentId) {
            orderId = order.data.documentId;
          }
        } catch {
          // If getOrderById fails, continue with numeric id
        }
      }
      
      const response = await apiClient.put<any>(`/api/orders/${orderId}`, { data: orderData });
      return {
        data: transformStrapiOrder(response)
      };
    } catch (error: any) {
      console.error('Update order error:', error);
      // If 404, the order might not exist or we need different approach
      // For oneToMany relations like payment_ids, we might need to use connect/disconnect
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(id: number, status: OrderStatus): Promise<{ data: Order }> {
    const updateData: any = { status_order: status };
    
    // Set timestamps based on status
    if (status === 'hủy đơn hàng') {
      updateData.canceled_at = new Date().toISOString();
    } else if (status === 'đã giao hàng') {
      updateData.delivery_at = new Date().toISOString();
      updateData.completed_at = new Date().toISOString();
    } else if (status === 'đã xử lý') {
      updateData.completed_at = new Date().toISOString();
    }

    return this.updateOrder(id, updateData);
  },

  // Xóa đơn hàng
  async deleteOrder(id: number): Promise<void> {
    await apiClient.delete<any>(`/api/orders/${id}`);
  },

  // Lấy order items của một order
  async getOrderItems(orderId: number): Promise<OrderItemResponse> {
    const response = await apiClient.get<any>(`/api/order-items?filters[order_id][id][$eq]=${orderId}&populate=*`);
    return transformStrapiOrderItemList(response);
  },

  // Thêm order item
  async addOrderItem(orderItemData: {
    order_id: number;
    product_id: number;
    name: string;
    quantity: number;
    price: number | string;
  }): Promise<{ data: OrderItem }> {
    const response = await apiClient.post<any>('/api/order-items', {
      data: {
        ...orderItemData,
        price: orderItemData.price !== undefined ? String(orderItemData.price) : '0'
      }
    });
    return {
      data: transformStrapiOrderItem(response)
    };
  },

  // Cập nhật order item
  async updateOrderItem(id: number, orderItemData: Partial<OrderItem>): Promise<{ data: OrderItem }> {
    const response = await apiClient.put<any>(`/api/order-items/${id}`, {
      data: orderItemData
    });
    return {
      data: transformStrapiOrderItem(response)
    };
  },

  // Xóa order item
  async deleteOrderItem(id: number): Promise<void> {
    await apiClient.delete<any>(`/api/order-items/${id}`);
  },

  // Lấy đơn hàng theo trạng thái
  async getOrdersByStatus(status: OrderStatus, userId?: number): Promise<OrderResponse> {
    let url = `/api/orders?filters[status_order][$eq]=${status}&populate=*&sort=createdAt:desc`;
    if (userId) {
      url = `/api/orders?filters[users_id][id][$eq]=${userId}&filters[status_order][$eq]=${status}&populate=*&sort=createdAt:desc`;
    }
    const response = await apiClient.get<any>(url);
    return transformStrapiOrderList(response);
  }
};

