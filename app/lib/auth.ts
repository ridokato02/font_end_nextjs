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
}

export const authService = new AuthService();
