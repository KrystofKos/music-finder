import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://simon:simon123@cluster0.sfkoemu.mongodb.net/music-finder?retryWrites=true&w=majority'), 
    UsersModule, ArtistsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}