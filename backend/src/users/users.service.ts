import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Pomocná funkce, aby se ven neposílalo heslo
  private toSafeUser(user: any) {
    const userObj = user.toObject ? user.toObject() : user;
    const { password, ...safe } = userObj;
    return safe;
  }

  async create(userData: any) {
    const existing = await this.userModel.findOne({ email: userData.email });
    if (existing) throw new ConflictException('Email již existuje');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = new this.userModel({ ...userData, password: hashedPassword });
    const saved = await newUser.save();
    return this.toSafeUser(saved);
  }

  async login(body: any) {
    const user = await this.userModel.findOne({ email: body.email }).exec();
    if (!user || !(await bcrypt.compare(body.password ?? '', user.password))) {
      throw new UnauthorizedException('Neplatné údaje');
    }
    return this.toSafeUser(user);
  }

  // --- TYTO FUNKCE UKLÁDAJÍ OBLÍBENÉ ---
  async addArtist(userId: string, artistId: string) {
  return this.userModel.findByIdAndUpdate(
    userId, 
    { $addToSet: { favoriteArtists: artistId } }, 
    { new: true } 
  ).exec();
}

  async addTrack(userId: string, trackId: string) {
  return this.userModel.findByIdAndUpdate(
    userId,
    { $addToSet: { favoriteTracks: trackId } },
    { new: true } // Toto zajistí, že se vrátí nová data
  ).exec(); // Tohle .exec() tam musí být!
}
}