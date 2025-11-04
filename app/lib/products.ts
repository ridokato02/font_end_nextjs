import { apiClient } from './api';
import { Product, ProductResponse } from '../types/product';
import { Categorie } from '../types/categorie';

// Helper function để transform Strapi response format sang Product format
function transformStrapiProduct(strapiProduct: any): Product {
  // Handle both direct data and wrapped response
  let data = strapiProduct.data || strapiProduct;
  if (!data) {
    throw new Error('Invalid product data: missing data field');
  }

  // Check if already transformed (has name directly, not in attributes)
  if (data.name && !data.attributes) {
    return data as Product;
  }

  const attributes = data.attributes || {};
  const apiBaseUrl = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'
    : 'http://localhost:1337';

  // Helper để transform category nếu cần
  const transformCategory = (catData: any): Categorie | number | null => {
    if (!catData) return null;
    if (typeof catData === 'number') return catData;
    if (catData.id && catData.name) return catData as Categorie;
    if (catData.attributes) {
      return {
        id: catData.id,
        name: catData.attributes.name || '',
        slug: catData.attributes.slug || '',
        status_categorie: catData.attributes.status_categorie || 'Active'
      } as Categorie;
    }
    return catData as Categorie;
  };

  // Transform image_url array (multiple media)
  let images: { id: number; url: string; alternativeText?: string }[] = [];
  
  if (attributes.image_url) {
    if (attributes.image_url.data) {
      const imageData = attributes.image_url.data;
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
    category_id: attributes.category_id?.data 
      ? transformCategory(attributes.category_id.data) 
      : attributes.category_id || null,
    name: attributes.name || '',
    slug: attributes.slug || '',
    description_product: attributes.description_product || '',
    price: attributes.price ? Number(attributes.price) : 0,
    discount: attributes.discount ? Number(attributes.discount) : 0,
    image_url: images,
    quantity: attributes.quantity ? Number(attributes.quantity) : 0,
    sold: attributes.sold ? Number(attributes.sold) : 0,
    status_product: attributes.status_product || 'kích hoạt',
    featured: attributes.featured || 'không',
    publishedAt: attributes.publishedAt || data.publishedAt || '',
    createdAt: attributes.createdAt || data.createdAt || '',
    updatedAt: attributes.updatedAt || data.updatedAt || ''
  };
}

// Helper function để transform Strapi list response
function transformStrapiProductList(strapiResponse: any): ProductResponse {
  const products = Array.isArray(strapiResponse.data) 
    ? strapiResponse.data.map((item: any) => transformStrapiProduct({ data: item }))
    : [];

  return {
    data: products,
    meta: strapiResponse.meta || {
      pagination: {
        page: 1,
        pageSize: 25,
        pageCount: 1,
        total: products.length
      }
    }
  };
}

// Export transform function để sử dụng trong categories.ts
export { transformStrapiProduct };

export const productService = {
  // Lấy danh sách tất cả sản phẩm
  async getAllProducts(): Promise<ProductResponse> {
    const response = await apiClient.get<any>('/api/products?populate=*');
    return transformStrapiProductList(response);
  },

  // Lấy sản phẩm theo ID
  async getProductById(id: string | number): Promise<{ data: Product }> {
    // Try filter by id first (most reliable)
    const asNum = Number(id);
    if (!Number.isNaN(asNum)) {
      try {
        const byId = await apiClient.get<any>(`/api/products?filters[id][$eq]=${asNum}&populate=*`);
        if (byId?.data && Array.isArray(byId.data) && byId.data.length > 0) {
          return { data: transformStrapiProduct({ data: byId.data[0] }) };
        }
      } catch (error) {
        console.warn(`⚠️ Filter by id failed, trying other methods:`, error);
      }
    }

    // Fallback 1: try by documentId filter (string UUID-like)
    try {
      const byDoc = await apiClient.get<any>(`/api/products?filters[documentId][$eq]=${encodeURIComponent(id)}&populate=*`);
      if (byDoc?.data && Array.isArray(byDoc.data) && byDoc.data.length > 0) {
        return { data: transformStrapiProduct({ data: byDoc.data[0] }) };
      }
    } catch (error) {
      console.warn(`⚠️ Filter by documentId failed:`, error);
    }

    // Fallback 2: Try direct findOne by path param
    try {
      const response = await apiClient.get<any>(`/api/products/${id}?populate=*`);
      return { data: transformStrapiProduct(response) };
    } catch (error) {
      console.error(`❌ Product not found by id/documentId: ${id}`, error);
      throw new Error(`Product with id ${id} not found`);
    }
  },

  // Lấy sản phẩm theo slug
  async getProductBySlug(slug: string): Promise<{ data: Product | null }> {
    try {
      const response = await apiClient.get<any>(`/api/products?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`);
      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        return { data: transformStrapiProduct({ data: response.data[0] }) };
      }
      return { data: null };
    } catch (error) {
      return { data: null };
    }
  },

  // Tạo sản phẩm mới
  async createProduct(productData: Partial<Product>): Promise<{ data: Product }> {
    const response = await apiClient.post<any>('/api/products', { data: productData });
    return {
      data: transformStrapiProduct(response)
    };
  },

  // Cập nhật sản phẩm
  async updateProduct(id: number, productData: Partial<Product>): Promise<{ data: Product }> {
    const response = await apiClient.put<any>(`/api/products/${id}`, { data: productData });
    return {
      data: transformStrapiProduct(response)
    };
  },

  // Xóa sản phẩm
  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete<any>(`/api/products/${id}`);
  },

  // Tìm kiếm sản phẩm
  async searchProducts(query: string): Promise<ProductResponse> {
    const response = await apiClient.get<any>(`/api/products?filters[name][$containsi]=${encodeURIComponent(query)}&populate=*`);
    return transformStrapiProductList(response);
  },

  // Lấy sản phẩm theo category
  async getProductsByCategory(categoryId: number): Promise<ProductResponse> {
    const response = await apiClient.get<any>(`/api/products?filters[category_id][id][$eq]=${categoryId}&populate=*`);
    return transformStrapiProductList(response);
  },

  // Lấy sản phẩm theo status
  async getProductsByStatus(status: 'ngừng kinh doanh' | 'kích hoạt'): Promise<ProductResponse> {
    const response = await apiClient.get<any>(`/api/products?filters[status_product][$eq]=${encodeURIComponent(status)}&populate=*`);
    return transformStrapiProductList(response);
  },

  // Lấy sản phẩm featured
  async getFeaturedProducts(): Promise<ProductResponse> {
    const response = await apiClient.get<any>('/api/products?filters[featured][$eq]=có&populate=*');
    return transformStrapiProductList(response);
  },

  // Lấy sản phẩm đang kích hoạt
  async getActiveProducts(): Promise<ProductResponse> {
    return this.getProductsByStatus('kích hoạt');
  }
};

// Helper function để lấy images từ Product (trực tiếp từ image_url)
export async function getProductImages(productId: number): Promise<{ id: number; url: string; alternativeText?: string }[]> {
  try {
    const response = await productService.getProductById(productId);
    return response.data.image_url || [];
  } catch (error) {
    console.error('Error fetching product images:', error);
    return [];
  }
}
