import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  user!: string;

  @Prop({ required: true })
  text!: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);