import { Categorie } from './categorie';

export type ProductStatus = 'ngừng kinh doanh' | 'kích hoạt';
export type Featured = 'không' | 'có';

export interface Product {
  id: number;
  documentId?: string;
  category_id?: Categorie | number | null;
  name: string;
  slug: string;
  description_product?: string;
  price: number;
  discount?: number;
  image_url?: {
    id: number;
    url: string;
    alternativeText?: string;
  }[];
  quantity: number;
  sold?: number;
  status_product?: ProductStatus;
  featured?: Featured;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductResponse {
  data: Product[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
