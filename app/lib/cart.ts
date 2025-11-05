import { apiClient } from './api';
import { Cart, CartItem, CartResponse, CartItemResponse } from '../types/cart';

// Helper function để transform Strapi Cart
function transformStrapiCart(strapiCart: any): Cart {
  let data = strapiCart.data || strapiCart;
  if (!data) {
    throw new Error('Invalid cart data: missing data field');
  }

  if (data.users_id && !data.attributes) {
    return data as Cart;
  }

  const attributes = data.attributes || {};

  return {
    id: data.id,
    documentId: data.documentId || attributes.documentId,
    users_id: attributes.users_id?.data ? { id: attributes.users_id.data.id } : attributes.users_id,
    publishedAt: attributes.publishedAt || data.publishedAt || '',
    createdAt: attributes.createdAt || data.createdAt || '',
    updatedAt: attributes.updatedAt || data.updatedAt || ''
  };
}

// Helper function để transform Strapi CartItem
function transformStrapiCartItem(strapiCartItem: any): CartItem {
  let data = strapiCartItem.data || strapiCartItem;
  if (!data) {
    throw new Error('Invalid cart item data: missing data field');
  }

  if (data.quantity && !data.attributes) {
    return data as CartItem;
  }

  const attributes = data.attributes || {};

  return {
    id: data.id,
    documentId: data.documentId || attributes.documentId,
    // Backend uses 'cart' not 'cart_id' - manyToOne relation
    // Support both 'cart' (correct) and 'cart_id' (legacy) for backward compatibility
    cart: attributes.cart?.data 
      ? transformStrapiCart({ data: attributes.cart.data }) 
      : attributes.cart || attributes.cart_id?.data 
        ? transformStrapiCart({ data: attributes.cart_id.data }) 
        : attributes.cart_id,
    product_id: attributes.product_id?.data ? { id: attributes.product_id.data.id } : attributes.product_id,
    quantity: attributes.quantity || 0,
    // price_cart is BigInteger in backend - convert to number
    price_cart: attributes.price_cart ? Number(attributes.price_cart) : 0,
    publishedAt: attributes.publishedAt || data.publishedAt || '',
    createdAt: attributes.createdAt || data.createdAt || '',
    updatedAt: attributes.updatedAt || data.updatedAt || ''
  };
}

function transformStrapiCartList(strapiResponse: any): CartResponse {
  const carts = Array.isArray(strapiResponse.data) 
    ? strapiResponse.data.map((item: any) => transformStrapiCart({ data: item }))
    : [];

  return {
    data: carts,
    meta: strapiResponse.meta
  };
}

function transformStrapiCartItemList(strapiResponse: any): CartItemResponse {
  const cartItems = Array.isArray(strapiResponse.data) 
    ? strapiResponse.data.map((item: any) => transformStrapiCartItem({ data: item }))
    : [];

  return {
    data: cartItems,
    meta: strapiResponse.meta
  };
}

export const cartService = {
  // Lấy giỏ hàng của user
  async getCartByUserId(userId: number): Promise<{ data: Cart | null }> {
    try {
      const response = await apiClient.get<any>(`/api/carts?filters[users_id][id][$eq]=${userId}&populate=*`);
      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        return { data: transformStrapiCart({ data: response.data[0] }) };
      }
      return { data: null };
    } catch (error) {
      return { data: null };
    }
  },

  // Tạo giỏ hàng mới
  async createCart(userId: number): Promise<{ data: Cart }> {
    const response = await apiClient.post<any>('/api/carts', { 
      data: { users_id: userId } 
    });
    return {
      data: transformStrapiCart(response)
    };
  },

  // Xóa giỏ hàng
  async deleteCart(id: number): Promise<void> {
    await apiClient.delete<any>(`/api/carts/${id}`);
  },

  // Lấy tất cả cart items của một cart
  async getCartItems(cartId: number): Promise<CartItemResponse> {
    // Backend uses 'cart' not 'cart_id' for the relation field
    const response = await apiClient.get<any>(`/api/cart-items?filters[cart][id][$eq]=${cartId}&populate=*`);
    return transformStrapiCartItemList(response);
  },

  // Thêm sản phẩm vào giỏ hàng
  async addCartItem(cartId: number, productId: number, quantity: number, price: number): Promise<{ data: CartItem }> {
    const response = await apiClient.post<any>('/api/cart-items', {
      data: {
        cart: cartId, // Backend uses 'cart' not 'cart_id'
        product_id: productId,
        quantity,
        // price_cart is BigInteger - can pass as number, Strapi will handle conversion
        price_cart: price
      }
    });
    return {
      data: transformStrapiCartItem(response)
    };
  },

  // Cập nhật số lượng cart item
  async updateCartItem(id: number, quantity: number, price?: number): Promise<{ data: CartItem }> {
    const updateData: any = { quantity };
    if (price !== undefined) {
      updateData.price_cart = price;
    }
    const response = await apiClient.put<any>(`/api/cart-items/${id}`, {
      data: updateData
    });
    return {
      data: transformStrapiCartItem(response)
    };
  },

  // Xóa cart item
  async deleteCartItem(id: number): Promise<void> {
    await apiClient.delete<any>(`/api/cart-items/${id}`);
  },

  // Xóa tất cả cart items của một cart
  async clearCart(cartId: number): Promise<void> {
    const cartItems = await this.getCartItems(cartId);
    for (const item of cartItems.data) {
      await this.deleteCartItem(item.id);
    }
  }
};

