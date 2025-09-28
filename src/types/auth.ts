export interface User {
  id: string;
  username: string;
  password: string;
  fullName: string;
  role: 'admin' | 'waiter';
  avatar?: string;
  phone?: string;
  email?: string;
}

export interface UserWithoutPassword {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'waiter';
  avatar?: string;
  phone?: string;
  email?: string;
}

export interface AuthState {
  user: UserWithoutPassword | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}
