// User types
export interface UserBase {
  id: number;
  email: string;
  username: string;
  password: string;
  created_at: string;
}

export type LoginRequest = Omit<UserBase, 'id' | 'username' | 'created_at'>;

export type RegisterRequest = Omit<UserBase, 'id' | 'created_at'>;

export interface TokenResponse {
  access_token: string;
  token_type: string;
}