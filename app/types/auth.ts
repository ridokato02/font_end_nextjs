export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  // Shipping/contact fields from backend User
  // Backend uses 'address_line' not 'address'
  address_line?: string;
  city?: string;
  ward?: string; // Backend has ward field
  country?: string;
  postal_code?: string;
  phone_number?: number | string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface AuthError {
  message: string;
  statusCode: number;
  error: string;
  data: any;
}
