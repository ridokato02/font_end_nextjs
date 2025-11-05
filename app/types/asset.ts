export interface Asset {
  id: number;
  documentId?: string;
  filename?: string;
  image_url?: {
    id: number;
    url: string;
    alternativeText?: string;
  }[];
  // Banner fields
  title?: string;
  description?: string;
  link?: string;
  type?: string;
  size?: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Banner interface for component usage
export interface Banner {
  id: number;
  title?: string;
  description?: string;
  link?: string;
  image?: {
    id: number;
    url: string;
    alternativeText?: string;
  };
}

export interface AssetResponse {
  data: Asset[];
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

