export interface Categorie {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  categorie_id?: Categorie | number | null; // Parent category relation
  description_categorie?: string;
  image_url_categorie?: {
    id: number;
    url: string;
    alternativeText?: string;
  }[];
  status_categorie?: 'Active' | 'Inactive';
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategorieResponse {
  data: Categorie[];
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

