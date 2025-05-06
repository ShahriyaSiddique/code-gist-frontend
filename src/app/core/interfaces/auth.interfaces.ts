export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
}