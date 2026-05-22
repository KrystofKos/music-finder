import type { User } from './users.schema';

export type SafeUser = {
  _id: string;
  email: string;
  username?: string;
};

export type CreateUserInput = {
  email: string;
  password: string;
  username?: string;
};

export interface UsersRepo {
  findByEmail(email: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  toSafeUser(user: User): SafeUser;
}

export const USERS_REPO = Symbol('USERS_REPO');

