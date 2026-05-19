import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';
import * as bcrypt from 'bcrypt'; // 1. Importujeme bcrypt

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: any): Promise<User> {
    // 2. Vygenerujeme "sůl" (náhodný klíč pro zesílení šifry)
    const salt = await bcrypt.genSalt(10);
    
    // 3. Zahashujeme heslo
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // 4. Přepíšeme původní heslo tím zašifrovaným
    const newUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });

    return newUser.save();
  }
}