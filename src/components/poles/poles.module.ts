import { Module } from '@nestjs/common';
import { PolesService } from './poles.service';
import { PolesController } from './poles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PoleSchema } from '../../models/pole.schema';
import { POLES_MODEL_NAME } from 'src/shared/constants/constants';

@Module({
  imports: [MongooseModule.forFeature([{name: POLES_MODEL_NAME, schema: PoleSchema}])],
  providers: [PolesService],
  controllers: [PolesController],
  exports: [MongooseModule.forFeature([{name: POLES_MODEL_NAME, schema: PoleSchema}]), PolesService]
})
export class PolesModule {}
