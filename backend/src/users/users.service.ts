import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';
import * as bcrypt from 'bcrypt'; // 1. Importujeme bcrypt

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  private toSafeUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safe } = (user.toObject?.() ?? user) as any;
    return safe;
  }

  async create(userData: any) {
    const existing = await this.userModel
      .findOne({ email: userData.email })
      .exec();
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    // 2. Vygenerujeme "sůl" (náhodný klíč pro zesílení šifry)
    const salt = await bcrypt.genSalt(10);

    // 3. Zahashujeme heslo
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // 4. Přepíšeme původní heslo tím zašifrovaným
    const newUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });

    const saved = await newUser.save();
    return this.toSafeUser(saved);
  }

  async login(body: any) {
    const user = await this.userModel.findOne({ email: body.email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(body.password ?? '', user.password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.toSafeUser(user);
  }
}
