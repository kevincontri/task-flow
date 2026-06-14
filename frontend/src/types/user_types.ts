// User types
export interface UserBase {
  email: string;
  username: string;
  password: string;
}

export type UserLogin = Omit<UserBase, 'username'>;

export type UserRegister = Required<UserBase>;

