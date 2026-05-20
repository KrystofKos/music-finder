import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://simon:Simon1234@cluster0.sfkoemu.mongodb.net/music-finder?retryWrites=true&w=majority'),
    UsersModule,
    ArtistsModule,
    TracksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}