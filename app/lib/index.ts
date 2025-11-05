// Export all API services
export { productService } from './products';
export { categorieService } from './categories';
export { cartService } from './cart';
export { orderService } from './orders';
export { paymentService } from './payments';
export { apiClient } from './api';
export * from './auth';

// Export types
export type { Product, ProductResponse, ProductStatus, Featured } from '../types/product';
export type { Categorie, CategorieResponse } from '../types/categorie';
export type { Cart, CartItem, CartResponse, CartItemResponse } from '../types/cart';
export type { Order, OrderItem, OrderResponse, OrderItemResponse, OrderStatus } from '../types/order';
export type { Payment, PaymentResponse, PaymentMethod, PaymentStatus } from '../types/payment';
// Removed unused type exports and invalid intermediate export
export type { ProductAsset, ProductAssetResponse } from '../types/product-asset';

