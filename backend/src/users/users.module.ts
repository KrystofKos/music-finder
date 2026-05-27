import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './users.schema';
import { USERS_REPO } from './users.repo';
import { MongoUsersRepo } from './mongo-users.repo';

// users.module.ts
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USERS_REPO,
      useClass: MongoUsersRepo, 
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}