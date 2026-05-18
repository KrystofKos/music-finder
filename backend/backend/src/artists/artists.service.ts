import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Artist } from './artists.schema';
import { CreateArtistDto } from './dto/create-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(@InjectModel(Artist.name) private artistModel: Model<Artist>) {}

  async findAll(query?: string) {
    const trimmed = query?.trim();

    if (!trimmed) {
      return [];
    }

    const regex = new RegExp(trimmed, 'i');

    return this.artistModel
      .find({
        name: regex,
      })
      .limit(10);
  }

  async findOne(id: string) {
    const artist = await this.artistModel.findById(id);

    if (!artist) {
      return { message: 'Artist not found' };
    }

    return artist;
  }

  async create(dto: CreateArtistDto) {
    return this.artistModel.create(dto);
  }
}
