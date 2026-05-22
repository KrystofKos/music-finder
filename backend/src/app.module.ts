import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';
import { DashboardModule } from './dashboard/dashboard.module';

const logger = new Logger('AppModule');
if (!process.env.MONGO_URI) {
  logger.warn(
    'MONGO_URI is not set; UsersModule will use file-based storage (artists/tracks search will still work).',
  );
}

@Module({
  imports: [
    ...(process.env.MONGO_URI ? [MongooseModule.forRoot(process.env.MONGO_URI)] : []),
    UsersModule,
    ArtistsModule,
    TracksModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
