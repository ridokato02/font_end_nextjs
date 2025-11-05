import { apiClient } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, AuthError } from '../types/auth';

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('Attempting login with:', credentials);
      const response = await apiClient.post<AuthResponse>('/api/auth/local', credentials);
      console.log('Login successful:', response);
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Đăng nhập thất bại');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('Attempting registration with:', userData);
      const response = await apiClient.post<AuthResponse>('/api/auth/local/register', userData);
      console.log('Registration successful:', response);
      return response;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Đăng ký thất bại');
    }
  }

  async logout(): Promise<void> {
    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Also clear persisted cart to avoid leftover items after logout
      localStorage.removeItem('cart');
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  getUser(): any | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  setAuthData(authResponse: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', authResponse.jwt);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
    }
  }

  // Cập nhật thông tin user
  async updateUser(userId: number, userData: {
    username?: string;
    email?: string;
    phone_number?: number | string;
    address_line?: string;
    city?: string;
    ward?: string;
    country?: string;
    postal_code?: string;
  }): Promise<AuthResponse> {
    try {
      // Strapi users-permissions endpoint for updating user
      // Note: Strapi v4+ uses /api/users/:id but requires proper permissions
      // For authenticated users updating themselves, we can use /api/users/me or /api/users/:id
      const response = await apiClient.put<AuthResponse>(`/api/users/${userId}`, {
        data: userData
      });
      // Cập nhật localStorage với thông tin user mới
      if (response.user) {
        this.setAuthData(response);
      }
      return response;
    } catch (error: any) {
      console.error('Update user error:', error);
      // Try alternative endpoint if first one fails
      try {
        const response = await apiClient.put<AuthResponse>(`/api/users-permissions/users/${userId}`, {
          data: userData
        });
        if (response.user) {
          this.setAuthData(response);
        }
        return response;
      } catch (retryError: any) {
        throw new Error(error.message || retryError.message || 'Cập nhật thông tin thất bại');
      }
    }
  }
}

export const authService = new AuthService();
