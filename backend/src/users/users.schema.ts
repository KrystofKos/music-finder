import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ unique: true, required: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop()
  username!: string;

  // Tady jsou ty nové seznamy:
  @Prop({ type: [String], default: [] })
  favoriteArtists!: string[];

  @Prop({ type: [String], default: [] })
  favoriteTracks!: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);