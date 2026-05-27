import { randomUUID } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import type { CreateUserInput, SafeUser, UsersRepo } from './users.repo';
import type { User } from './users.schema';

type StoredUser = {
  _id: string;
  email: string;
  password: string;
  username?: string;
  avatar?: string;
};

function dataFilePath() {
  return join(process.cwd(), 'data', 'users.json');
}

async function readAll(): Promise<StoredUser[]> {
  try {
    const raw = await readFile(dataFilePath(), 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredUser[];
  } catch {
    return [];
  }
}

async function writeAll(users: StoredUser[]) {
  await mkdir(join(process.cwd(), 'data'), { recursive: true });
  await writeFile(dataFilePath(), JSON.stringify(users, null, 2), 'utf8');
}

function toUserDocumentLike(u: StoredUser): User {
  // Minimal shape used by UsersService (password compare + safe user mapping)
  return u as unknown as User;
}

export class FileUsersRepo implements UsersRepo {
  async findById(id: string): Promise<User | null> {
    const users = await readAll();
    const found = users.find((u) => u._id === id);
    return found ? toUserDocumentLike(found) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await readAll();
    const found = users.find((u) => u.email === email);
    return found ? toUserDocumentLike(found) : null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const users = await readAll();
    const created: StoredUser = {
      _id: randomUUID(),
      email: input.email,
      password: input.password,
      username: input.username,
    };
    users.push(created);
    await writeAll(users);
    return toUserDocumentLike(created);
  }

  async updateAvatar(id: string, avatar: string | null): Promise<User | null> {
    const users = await readAll();
    const index = users.findIndex((u) => u._id === id);
    if (index === -1) return null;
    const updated: StoredUser = {
      ...users[index],
      avatar: avatar ?? undefined,
    };
    users[index] = updated;
    await writeAll(users);
    return toUserDocumentLike(updated);
  }

  toSafeUser(user: User): SafeUser {
    const anyUser = user as any;
    return {
      _id: String(anyUser._id ?? anyUser.id ?? ''),
      email: String(anyUser.email ?? ''),
      username: anyUser.username ? String(anyUser.username) : undefined,
      avatar: anyUser.avatar ? String(anyUser.avatar) : undefined,
    };
  }
}
