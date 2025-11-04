import { apiClient } from './api';
import { Categorie, CategorieResponse } from '../types/categorie';

// Helper function để transform Strapi response format sang Categorie format
export function transformStrapiCategorie(strapiCategorie: any): Categorie {
  let data = strapiCategorie.data || strapiCategorie;
  if (!data) {
    throw new Error('Invalid categorie data: missing data field');
  }

  // Check if already transformed
  if (data.name && !data.attributes) {
    return data as Categorie;
  }

  const attributes = data.attributes || {};
  const apiBaseUrl = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'
    : 'http://localhost:1337';

  // Transform image_url_categorie array
  let images: { id: number; url: string; alternativeText?: string }[] = [];
  
  if (attributes.image_url_categorie) {
    if (attributes.image_url_categorie.data) {
      const imageData = attributes.image_url_categorie.data;
      if (Array.isArray(imageData)) {
        images = imageData.map((img: any) => {
          const imgAttrs = img.attributes || {};
          const url = imgAttrs.url || 
                     imgAttrs.formats?.large?.url || 
                     imgAttrs.formats?.medium?.url || 
                     imgAttrs.formats?.small?.url || 
                     '';
          return {
            id: img.id,
            url: url.startsWith('http') ? url : `${apiBaseUrl}${url}`,
            alternativeText: imgAttrs.alternativeText || imgAttrs.caption || imgAttrs.name || ''
          };
        });
      } else {
        const imgAttrs = imageData.attributes || {};
        const url = imgAttrs.url || 
                   imgAttrs.formats?.large?.url || 
                   imgAttrs.formats?.medium?.url || 
                   imgAttrs.formats?.small?.url || 
                   '';
        images = [{
          id: imageData.id,
          url: url.startsWith('http') ? url : `${apiBaseUrl}${url}`,
          alternativeText: imgAttrs.alternativeText || imgAttrs.caption || imgAttrs.name || ''
        }];
      }
    }
  }

  return {
    id: data.id,
    documentId: data.documentId || attributes.documentId,
    name: attributes.name || '',
    slug: attributes.slug || '',
    categorie_id: attributes.categorie_id?.data ? transformStrapiCategorie({ data: attributes.categorie_id.data }) : attributes.categorie_id,
    description_categorie: attributes.description_categorie || '',
    image_url_categorie: images,
    status_categorie: attributes.status_categorie || 'Active',
    publishedAt: attributes.publishedAt || data.publishedAt || '',
    createdAt: attributes.createdAt || data.createdAt || '',
    updatedAt: attributes.updatedAt || data.updatedAt || ''
  };
}

// Helper function để transform Strapi list response
function transformStrapiCategorieList(strapiResponse: any): CategorieResponse {
  const categories = Array.isArray(strapiResponse.data) 
    ? strapiResponse.data.map((item: any) => transformStrapiCategorie({ data: item }))
    : [];

  return {
    data: categories,
    meta: strapiResponse.meta || {
      pagination: {
        page: 1,
        pageSize: 25,
        pageCount: 1,
        total: categories.length
      }
    }
  };
}

export const categorieService = {
  // Lấy danh sách tất cả categories
  async getAllCategories(): Promise<CategorieResponse> {
    const response = await apiClient.get<any>('/api/categories?populate=*');
    return transformStrapiCategorieList(response);
  },

  // Lấy category theo ID
  async getCategorieById(id: string | number): Promise<{ data: Categorie }> {
    try {
      const response = await apiClient.get<any>(`/api/categories/${id}?populate=*`);
      return { data: transformStrapiCategorie(response) };
    } catch (error) {
      // Fallback: try by documentId filter
      try {
        const byDoc = await apiClient.get<any>(`/api/categories?filters[documentId][$eq]=${encodeURIComponent(id)}&populate=*`);
        if (byDoc?.data && Array.isArray(byDoc.data) && byDoc.data.length > 0) {
          return { data: transformStrapiCategorie({ data: byDoc.data[0] }) };
        }
      } catch {}
      throw error;
    }
  },

  // Lấy category theo slug
  async getCategorieBySlug(slug: string): Promise<{ data: Categorie }> {
    const response = await apiClient.get<any>(`/api/categories?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`);
    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
      return { data: transformStrapiCategorie({ data: response.data[0] }) };
    }
    throw new Error('Category not found');
  },

  // Tạo category mới
  async createCategorie(categorieData: Partial<Categorie>): Promise<{ data: Categorie }> {
    const response = await apiClient.post<any>('/api/categories', { data: categorieData });
    return {
      data: transformStrapiCategorie(response)
    };
  },

  // Cập nhật category
  async updateCategorie(id: number, categorieData: Partial<Categorie>): Promise<{ data: Categorie }> {
    const response = await apiClient.put<any>(`/api/categories/${id}`, { data: categorieData });
    return {
      data: transformStrapiCategorie(response)
    };
  },

  // Xóa category
  async deleteCategorie(id: number): Promise<{ data: Categorie }> {
    const response = await apiClient.delete<any>(`/api/categories/${id}`);
    return {
      data: transformStrapiCategorie(response)
    };
  },

  // Lấy categories theo status
  async getCategoriesByStatus(status: 'Active' | 'Inactive'): Promise<CategorieResponse> {
    const response = await apiClient.get<any>(`/api/categories?filters[status_categorie][$eq]=${status}&populate=*`);
    return transformStrapiCategorieList(response);
  },

  // Lấy categories con (subcategories)
  async getSubCategories(parentId: number): Promise<CategorieResponse> {
    const response = await apiClient.get<any>(`/api/categories?filters[categorie_id][id][$eq]=${parentId}&populate=*`);
    return transformStrapiCategorieList(response);
  }
};

