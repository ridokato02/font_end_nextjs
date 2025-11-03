export interface Product {
  id: number;
  documentId?: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  picture: {
    id: number;
    url: string;
    alternativeText?: string;
  }[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
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
