// User types
export interface UserBase {
  email: string;
  username: string;
  password: string;
}

export type UserLogin = Omit<UserBase, 'username'>;

export type UserRegister = Required<UserBase>;

// Project types
export interface ProjectBase {
  id: number;
  name: string;
  description: string;
  created_at: string;
  owner_id: number;
}

export type ProjectUpdate = Partial<Omit<ProjectBase, 'id' | 'created_at' | 'owner_id'>>;

export type ProjectCreate = Omit<ProjectBase, 'id' | 'created_at' | 'owner_id'>;