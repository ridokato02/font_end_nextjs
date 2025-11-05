'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { categorieService } from '../lib/categories';
import { productService } from '../lib/products';
import type { Categorie } from '../types/categorie';
import type { Product } from '../types/product';
import ProductCard from '../components/ProductCard';

export default function CategoryDetailBySlugPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const [category, setCategory] = useState<Categorie | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const catRes = await categorieService.getCategorieBySlug(slug);
        if (!isMounted) return;
        setCategory(catRes.data);
        const prodRes = await productService.getProductsByCategory(catRes.data.id);
        if (!isMounted) return;
        setProducts(prodRes.data);
      } catch (e: any) {
        if (!isMounted) return;
        setError('Không tìm thấy danh mục hoặc đã xảy ra lỗi.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (slug) load();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {category ? category.name : 'Danh mục'}
            </h1>
            <p className="text-lg text-gray-600">
              {category?.description_categorie || 'Các sản phẩm thuộc danh mục này'}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{error}</h3>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có sản phẩm</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


