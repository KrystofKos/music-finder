import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema'; // Tvoje schéma uživatele
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    // Tady se uživatelé vážou na MongoDB
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}