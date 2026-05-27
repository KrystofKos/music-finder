import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { CreateUserInput, SafeUser, UsersRepo } from './users.repo';
import { User } from './users.schema';

export class MongoUsersRepo implements UsersRepo {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(input: CreateUserInput): Promise<User> {
    const newUser = new this.userModel(input);
    return newUser.save();
  }

  async updateAvatar(id: string, avatar: string | null): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, { avatar: avatar ?? undefined }, { new: true })
      .exec();
  }

  toSafeUser(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safe } = user.toObject?.() ?? user;
    return safe as SafeUser;
  }
}
