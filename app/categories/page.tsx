
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Categorie } from '../types/categorie';
import { categorieService } from '../lib/categories';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categorieService.getAllCategories();
        // Filter for active categories as per user-facing page best practices
        const activeCategories = response.data.filter(
          (cat) => cat.status_categorie === 'Active'
        );
        setCategories(activeCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl text-gray-900 ">
            Tất Cả Danh Mục
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-500">
            Khám phá thế giới sản phẩm của chúng tôi qua các danh mục được tuyển chọn.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9,17a4,4,0,0,1,5.656,0M9,12h6m-6-4h6m2,5.291A7.962,7.962,0,0,1,12,15c-2.34,0-4.29-1.009-5.824-2.636M15,6.5a3,3,0,1,1-6,0A3,3,0,0,1,15,6.5Z"
              />
            </svg>
            <h3 className="mt-4 text-2xl font-semibold text-gray-900">
              Không tìm thấy danh mục
            </h3>
            <p className="mt-2 text-base text-gray-500">
              Hiện chưa có danh mục nào. Vui lòng quay lại sau!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
            {categories.map((category) => {
              const img = category.image_url_categorie?.[0];
              const imageUrl = img?.url || '/placeholder-product.jpg'; // Using a more generic placeholder
              const alt = img?.alternativeText || category.name;
              return (
                <Link
                  key={category.id}
                  href={category.slug ? `/${category.slug}` : '#'}
                  className="group text-center"
                >
                  <div className="relative w-full h-40 bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-2">
                    <Image
                      src={imageUrl}
                      alt={alt}
                      fill
                      className="object-contain p-2" // Use contain to see the whole image
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.66vw"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
                    {category.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

