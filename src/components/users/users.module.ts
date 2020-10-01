import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { USERS_MODEL_NAME } from 'src/shared/constants/constants';
import { UserSchema } from 'src/models/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: USERS_MODEL_NAME, schema: UserSchema }]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [
    MongooseModule.forFeature([{ name: USERS_MODEL_NAME, schema: UserSchema }]),
    UsersService
  ],
})
export class UsersModule {}
