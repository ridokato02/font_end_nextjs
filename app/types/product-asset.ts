import { Product } from './product';
import { Asset } from './asset';

export interface ProductAsset {
  id: number;
  documentId?: string;
  product_id?: Product | number | null;
  asset_id?: Asset | number | null;
  type?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductAssetResponse {
  data: ProductAsset[];
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

