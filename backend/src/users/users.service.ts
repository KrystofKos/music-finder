import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import type { UsersRepo } from './users.repo';
import { USERS_REPO } from './users.repo';
import * as bcrypt from 'bcrypt'; // 1. Importujeme bcrypt

@Injectable()
export class UsersService {
  constructor(@Inject(USERS_REPO) private usersRepo: UsersRepo) {}

  async create(userData: any) {
    const existing = await this.usersRepo.findByEmail(userData.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    // 2. Vygenerujeme "sůl" (náhodný klíč pro zesílení šifry)
    const salt = await bcrypt.genSalt(10);

    // 3. Zahashujeme heslo
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const saved = await this.usersRepo.create({
      ...userData,
      password: hashedPassword,
    });
    return this.usersRepo.toSafeUser(saved);
  }

  async login(body: any) {
    const user = await this.usersRepo.findByEmail(body.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(body.password ?? '', (user as any).password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.usersRepo.toSafeUser(user);
  }
}
