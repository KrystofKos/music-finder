import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema'; // Tvoje schéma uživatele
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './users.schema';
import { USERS_REPO } from './users.repo';
import { MongoUsersRepo } from './mongo-users.repo';

// users.module.ts
@Module({
  imports: [
    // Tady se uživatelé vážou na MongoDB
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