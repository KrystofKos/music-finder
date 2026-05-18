import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArtistDocument = Artist & Document;

@Schema()
export class Artist {
  @Prop({ required: true })
  name!: string;

  @Prop({ type: [String], required: true })
  genres!: string[];

  @Prop({ type: [String], required: true })
  mood!: string[];

  @Prop({ required: true })
  era!: string;

  @Prop({ type: [String], required: true })
  similarArtists!: string[];

  @Prop({ required: true })
  imageUrl!: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
