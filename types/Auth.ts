/**
 * Types pour l'authentification
 */

import type { License } from './License';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user?: User;
}

export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  tokens: AuthTokens | null;
  licenses: License[];
  activeLicense: License | null;
  error: AuthError | null;
}

export interface AuthContextType extends AuthState {
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  refreshLicenses: () => Promise<void>;
  setActiveLicense: (license: License) => void;
  clearError: () => void;
}
