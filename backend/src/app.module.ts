import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // MongoDB běží POUZE pro uživatele
    MongooseModule.forRoot('mongodb+srv://simon:Simon1234@cluster0.sfkoemu.mongodb.net/music-finder?retryWrites=true&w=majority'),
    UsersModule,
    // ChatModule importujeme samostatně, aby se na něj nevztahovala databáze
    ChatModule,
  ],
})
export class AppModule {}