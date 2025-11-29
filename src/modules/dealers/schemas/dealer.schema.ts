import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DealerDocument = Dealer & Document;

@Schema({ timestamps: true })
export class Dealer {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true, trim: true })
  operatingHours: string;

  @Prop({ required: true, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  status: string;

  @Prop({ required: true, trim: true })
  region: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const DealerSchema = SchemaFactory.createForClass(Dealer);

// Indexes for better performance
DealerSchema.index({ email: 1 });
DealerSchema.index({ name: 1 });
DealerSchema.index({ region: 1 });
DealerSchema.index({ status: 1 });
DealerSchema.index({ isDeleted: 1 });
