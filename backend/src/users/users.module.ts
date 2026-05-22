import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './users.schema';
import { USERS_REPO } from './users.repo';
import { MongoUsersRepo } from './mongo-users.repo';
import { FileUsersRepo } from './file-users.repo';

@Module({
  imports: [
    ...(process.env.MONGO_URI
      ? [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])]
      : []),
  ],
  controllers: [UsersController], // Přidat sem
  providers: [
    UsersService,
    {
      provide: USERS_REPO,
      useClass: process.env.MONGO_URI ? MongoUsersRepo : FileUsersRepo,
    },
  ], // Přidat sem
})
export class UsersModule {}
