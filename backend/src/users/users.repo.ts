import type { User } from './users.schema';

export type SafeUser = {
  _id: string;
  email: string;
  username?: string;
  avatar?: string;
};

export type CreateUserInput = {
  email: string;
  password: string;
  username?: string;
};

export interface UsersRepo {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  updateAvatar(id: string, avatar: string | null): Promise<User | null>;
  toSafeUser(user: User): SafeUser;
}

export const USERS_REPO = Symbol('USERS_REPO');
