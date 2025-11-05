'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Categorie } from '../types/categorie';
import { categorieService } from '../lib/categories';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [rootCategories, setRootCategories] = useState<Categorie[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categorieService.getAllCategories();
        setCategories(response.data);
        const roots = response.data.filter(
          (cat) => cat.status_categorie === 'Active' && !cat.categorie_id
        );
        setRootCategories(roots);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  // No additional filtering; display active root categories like the visual layout

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header (matches the provided image style) */}
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">DANH MỤC</h2>
          </div>

          {/* Categories Grid matching icon-with-label layout */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : rootCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.636M15 6.5a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không có danh mục
              </h3>
              <p className="text-gray-600">
                Không tìm thấy danh mục nào
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 xl:grid-cols-10 gap-y-8 gap-x-6">
              {rootCategories.map((category) => {
                const img = category.image_url_categorie?.[0];
                const imageUrl = img?.url || '/placeholder-category.jpg';
                const alt = img?.alternativeText || category.name;
                return (
                  <Link
                    key={category.id}
                    href={category.slug ? `/${category.slug}` : '#'}
                    className="flex flex-col items-center group"
                  >
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow transition-shadow">
                      <div className="relative w-20 h-20 md:w-24 md:h-24">
                        <Image
                          src={imageUrl}
                          alt={alt}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 25vw, (max-width: 1200px) 10vw, 96px"
                        />
                      </div>
                    </div>
                    <div className="mt-3 text-center text-sm text-gray-800 leading-tight">
                      {category.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

