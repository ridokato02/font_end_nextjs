import { apiClient } from './api';
import { Introduce, IntroduceResponse } from '../types/introduce';

export const introduceService = {
  // Lấy danh sách tất cả giới thiệu
  async getAllIntroduce(): Promise<IntroduceResponse> {
    return apiClient.get<IntroduceResponse>('/api/introduces?populate=*');
  },

  // Lấy giới thiệu theo ID
  async getIntroduceById(id: number): Promise<{ data: Introduce }> {
    return apiClient.get<{ data: Introduce }>(`/api/introduces/${id}?populate=*`);
  },

  // Tạo giới thiệu mới
  async createIntroduce(introduceData: Partial<Introduce>): Promise<{ data: Introduce }> {
    return apiClient.post<{ data: Introduce }>('/api/introduces', { data: introduceData });
  },

  // Cập nhật giới thiệu
  async updateIntroduce(id: number, introduceData: Partial<Introduce>): Promise<{ data: Introduce }> {
    return apiClient.put<{ data: Introduce }>(`/api/introduces/${id}`, { data: introduceData });
  },

  // Xóa giới thiệu
  async deleteIntroduce(id: number): Promise<{ data: Introduce }> {
    return apiClient.delete<{ data: Introduce }>(`/api/introduces/${id}`);
  },

  // Tìm kiếm sản phẩm
  async searchIntroduce(query: string): Promise<IntroduceResponse> {
    return apiClient.get<IntroduceResponse>(`/api/introduces?filters[Title][$containsi]=${query}&populate=*`);
  }
};
