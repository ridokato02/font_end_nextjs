import { apiClient } from './api';
import { Product, ProductResponse } from '../types/product';

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

  // Transform picture array từ Strapi format
  let pictures: { id: number; url: string; alternativeText?: string }[] = [];
  
  if (attributes.picture) {
    if (attributes.picture.data) {
      const pictureData = attributes.picture.data;
      if (Array.isArray(pictureData)) {
        pictures = pictureData.map((img: any) => {
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
        // Single image object
        const imgAttrs = pictureData.attributes || {};
        const url = imgAttrs.url || 
                   imgAttrs.formats?.large?.url || 
                   imgAttrs.formats?.medium?.url || 
                   imgAttrs.formats?.small?.url || 
                   '';
        pictures = [{
          id: pictureData.id,
          url: url.startsWith('http') ? url : `${apiBaseUrl}${url}`,
          alternativeText: imgAttrs.alternativeText || imgAttrs.caption || imgAttrs.name || ''
        }];
      }
    } else if (Array.isArray(attributes.picture)) {
      // Handle direct array format
      pictures = attributes.picture.map((pic: any) => ({
        id: pic.id || 0,
        url: pic.url?.startsWith('http') ? pic.url : `${apiBaseUrl}${pic.url || ''}`,
        alternativeText: pic.alternativeText || pic.caption || ''
      }));
    }
  }

  return {
    id: data.id,
    documentId: data.documentId || attributes.documentId,
    name: attributes.name || '',
    price: attributes.price ? Number(attributes.price) : 0,
    description: attributes.description || '',
    stock: attributes.stock || 0,
    picture: pictures,
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

export const productService = {
  // Lấy danh sách tất cả sản phẩm
  async getAllProducts(): Promise<ProductResponse> {
    const response = await apiClient.get<any>('/api/products?populate=*');
    return transformStrapiProductList(response);
  },

  // Lấy sản phẩm theo ID
  async getProductByDocumentId(documentOrId: string): Promise<{ data: Product }> {
    // Try direct findOne by path param
    try {
      const response = await apiClient.get<any>(`/api/products/${documentOrId}?populate=*`);
      return { data: transformStrapiProduct(response) };
    } catch (e1) {
      // Fallback 1: try by documentId filter (string UUID-like)
      try {
        const byDoc = await apiClient.get<any>(`/api/products?filters[documentId][$eq]=${encodeURIComponent(documentOrId)}&populate=*`);
        if (byDoc?.data && Array.isArray(byDoc.data) && byDoc.data.length > 0) {
          return { data: transformStrapiProduct({ data: byDoc.data[0] }) };
        }
      } catch {}

      // Fallback 2: if numeric, try filter by id
      const asNum = Number(documentOrId);
      if (!Number.isNaN(asNum)) {
        try {
          const byId = await apiClient.get<any>(`/api/products?filters[id][$eq]=${asNum}&populate=*`);
          if (byId?.data && Array.isArray(byId.data) && byId.data.length > 0) {
            return { data: transformStrapiProduct({ data: byId.data[0] }) };
          }
        } catch {}
      }

      console.error(`Product not found by id/documentId: ${documentOrId}`);
      throw e1;
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
  async deleteProduct(id: number): Promise<{ data: Product }> {
    const response = await apiClient.delete<any>(`/api/products/${id}`);
    return {
      data: transformStrapiProduct(response)
    };
  },

  // Tìm kiếm sản phẩm
  async searchProducts(query: string): Promise<ProductResponse> {
    const response = await apiClient.get<any>(`/api/products?filters[name][$containsi]=${query}&populate=*`);
    return transformStrapiProductList(response);
  }
};
