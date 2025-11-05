import { apiClient } from './api';
import { Asset, AssetResponse, Banner } from '../types/asset';

// Helper function để transform Strapi response format sang Asset format
export function transformStrapiAsset(strapiAsset: any): Asset {
  let data = strapiAsset.data || strapiAsset;
  if (!data) {
    throw new Error('Invalid asset data: missing data field');
  }

  // Check if already transformed
  if (data.filename && !data.attributes) {
    return data as Asset;
  }

  const attributes = data.attributes || {};
  const apiBaseUrl = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'
    : 'http://localhost:1337';

  // Transform image_url array
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
    filename: attributes.filename || data.filename || '',
    image_url: images,
    title: attributes.title || data.title,
    description: attributes.description || data.description,
    link: attributes.link || data.link,
    type: attributes.type || data.type || '',
    size: attributes.size || data.size,
    publishedAt: attributes.publishedAt || data.publishedAt || '',
    createdAt: attributes.createdAt || data.createdAt || '',
    updatedAt: attributes.updatedAt || data.updatedAt || ''
  };
}

// Helper function để transform Strapi list response
function transformStrapiAssetList(strapiResponse: any): AssetResponse {
  const assets = Array.isArray(strapiResponse.data) 
    ? strapiResponse.data.map((item: any) => transformStrapiAsset({ data: item }))
    : [];

  return {
    data: assets,
    meta: strapiResponse.meta || {
      pagination: {
        page: 1,
        pageSize: 25,
        pageCount: 1,
        total: assets.length
      }
    }
  };
}

// Helper function để map Asset sang Banner format
function mapAssetToBanner(asset: Asset): Banner {
  // Lấy image đầu tiên từ image_url array
  const firstImage = asset.image_url && asset.image_url.length > 0 
    ? {
        id: asset.image_url[0].id,
        url: asset.image_url[0].url,
        alternativeText: asset.image_url[0].alternativeText
      }
    : undefined;

  return {
    id: asset.id,
    title: asset.title,
    description: asset.description,
    link: asset.link,
    image: firstImage
  };
}

export const assetService = {
  // Lấy danh sách tất cả assets
  async getAllAssets(): Promise<AssetResponse> {
    const response = await apiClient.get<any>('/api/assets?populate=*');
    return transformStrapiAssetList(response);
  },

  // Lấy asset theo ID
  async getAssetById(id: string | number): Promise<{ data: Asset }> {
    try {
      const response = await apiClient.get<any>(`/api/assets/${id}?populate=*`);
      return { data: transformStrapiAsset(response) };
    } catch (error) {
      // Fallback: try by documentId filter
      try {
        const byDoc = await apiClient.get<any>(`/api/assets?filters[documentId][$eq]=${encodeURIComponent(id)}&populate=*`);
        if (byDoc?.data && Array.isArray(byDoc.data) && byDoc.data.length > 0) {
          return { data: transformStrapiAsset({ data: byDoc.data[0] }) };
        }
      } catch {}
      throw error;
    }
  },

  // Lấy assets theo type
  async getAssetsByType(type: string): Promise<AssetResponse> {
    const response = await apiClient.get<any>(`/api/assets?filters[type][$eq]=${encodeURIComponent(type)}&populate=*`);
    return transformStrapiAssetList(response);
  },

  // Lấy assets đã published (cho banner)
  async getPublishedAssets(): Promise<AssetResponse> {
    const response = await apiClient.get<any>('/api/assets?filters[publishedAt][$notNull]=true&populate=*');
    return transformStrapiAssetList(response);
  },

  // Lấy banners (assets có type = 'banner' hoặc có title)
  async getBanners(): Promise<{ data: Banner[] }> {
    const response = await apiClient.get<any>('/api/assets?filters[publishedAt][$notNull]=true&populate=*');
    const assets = transformStrapiAssetList(response);
    
    // Filter và map assets có image thành banners
    const banners = assets.data
      .filter(asset => asset.image_url && asset.image_url.length > 0)
      .map(asset => mapAssetToBanner(asset));
    
    return { data: banners };
  },

  // Lấy active banners (đã published và có image)
  async getActiveBanners(): Promise<{ data: Banner[] }> {
    return this.getBanners();
  },

  // Tạo asset mới
  async createAsset(assetData: Partial<Asset>): Promise<{ data: Asset }> {
    const response = await apiClient.post<any>('/api/assets', { data: assetData });
    return {
      data: transformStrapiAsset(response)
    };
  },

  // Cập nhật asset
  async updateAsset(id: number, assetData: Partial<Asset>): Promise<{ data: Asset }> {
    const response = await apiClient.put<any>(`/api/assets/${id}`, { data: assetData });
    return {
      data: transformStrapiAsset(response)
    };
  },

  // Xóa asset
  async deleteAsset(id: number): Promise<{ data: Asset }> {
    const response = await apiClient.delete<any>(`/api/assets/${id}`);
    return {
      data: transformStrapiAsset(response)
    };
  }
};

