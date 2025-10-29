import { apiClient } from './api';
import { Product, ProductResponse } from '../types/product';

export const productService = {
  // Lấy danh sách tất cả sản phẩm
  async getAllProducts(): Promise<ProductResponse> {
    return apiClient.get<ProductResponse>('/api/products?populate=*');
  },

  // Lấy sản phẩm theo ID
  async getProductById(id: number): Promise<{ data: Product }> {
    return apiClient.get<{ data: Product }>(`/api/products/${id}?populate=*`);
  },

  // Tạo sản phẩm mới
  async createProduct(productData: Partial<Product>): Promise<{ data: Product }> {
    return apiClient.post<{ data: Product }>('/api/products', { data: productData });
  },

  // Cập nhật sản phẩm
  async updateProduct(id: number, productData: Partial<Product>): Promise<{ data: Product }> {
    return apiClient.put<{ data: Product }>(`/api/products/${id}`, { data: productData });
  },

  // Xóa sản phẩm
  async deleteProduct(id: number): Promise<{ data: Product }> {
    return apiClient.delete<{ data: Product }>(`/api/products/${id}`);
  },

  // Tìm kiếm sản phẩm
  async searchProducts(query: string): Promise<ProductResponse> {
    return apiClient.get<ProductResponse>(`/api/products?filters[name][$containsi]=${query}&populate=*`);
  }
};
