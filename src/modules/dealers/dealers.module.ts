import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DealersController } from './controllers/dealers.controller';
import { DealersService } from './services/dealers.service';
import { Dealer, DealerSchema } from './schemas/dealer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dealer.name, schema: DealerSchema }]),
  ],
  controllers: [DealersController],
  providers: [DealersService],
  exports: [DealersService],
})
export class DealersModule {}
