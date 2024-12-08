import { UserRole } from "@/lib/constants/enums";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId?: number;
  departmentId?: number;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
