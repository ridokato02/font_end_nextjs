import Link from 'next/link';
import { Categorie } from '../types/categorie';
import { Product } from '../types/product';

interface BreadcrumbProps {
  category?: Categorie;
  product?: Product;
}

export default function Breadcrumb({ category, product }: BreadcrumbProps) {
  // Build breadcrumb items array
  const items: Array<{ label: string; href?: string }> = [];

  // Always start with Home
  items.push({ label: 'Trang chủ', href: '/' });

  // If we have a product, build the category chain first
  if (product) {
    // Get category chain from product
    if (product.category_id && typeof product.category_id === 'object') {
      const categoryChain = getCategoryChain(product.category_id);
      categoryChain.forEach((cat) => {
        items.push({ label: cat.name, href: `/${cat.slug}` });
      });
    }
    // Add product name as last item (not clickable)
    items.push({ label: product.name, href: undefined });
  } 
  // If we have a category, build the category chain
  else if (category) {
    const categoryChain = getCategoryChain(category);
    categoryChain.forEach((cat, index) => {
      // Last category is current page (not clickable)
      if (index === categoryChain.length - 1) {
        items.push({ label: cat.name, href: undefined });
      } else {
        items.push({ label: cat.name, href: `/${cat.slug}` });
      }
    });
  }

  return (
    <nav className="pt-8 px-8 max-w-7xl mx-auto">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link
                href={item.href}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-800">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className="mx-2 text-gray-400">{'>'}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Helper function to get category chain (parent -> child)
function getCategoryChain(category: Categorie): Categorie[] {
  const chain: Categorie[] = [];
  let current: Categorie | number | null | undefined = category;

  // First, collect all parent categories
  const parents: Categorie[] = [];
  while (current && typeof current === 'object' && current.categorie_id) {
    if (typeof current.categorie_id === 'object') {
      parents.unshift(current.categorie_id);
      current = current.categorie_id;
    } else {
      break;
    }
  }

  // Add parents to chain
  chain.push(...parents);

  // Add current category
  if (typeof category === 'object') {
    chain.push(category);
  }

  return chain;
}
