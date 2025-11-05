'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Categorie } from '../types/categorie';

interface CategoryCardProps {
  category: Categorie;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const getFirstImage = () => {
    if (category.image_url_categorie && category.image_url_categorie.length > 0) {
      const imageUrl = category.image_url_categorie[0].url;
      if (imageUrl.startsWith('/')) {
        return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}${imageUrl}`;
      }
      return imageUrl;
    }
    return '/placeholder-product.jpg';
  };

  return (
    <Link href={`/${category.slug || 'categories/' + category.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={getFirstImage()}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {category.status_categorie === 'Active' && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Active
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
            {category.name}
          </h3>
          
          {category.description_categorie && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {category.description_categorie}
            </p>
          )}
          
          {/* Parent category */}
          {category.categorie_id && typeof category.categorie_id === 'object' && (
            <div className="mb-2">
              <span className="text-xs text-gray-500">Danh mục cha: </span>
              <span className="text-xs text-red-600 font-medium">
                {category.categorie_id.name}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded ${
              category.status_categorie === 'Active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {category.status_categorie || 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

