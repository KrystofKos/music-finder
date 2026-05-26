import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  // Statické soubory z public složky
  app.useStaticAssets(join(__dirname, '..', '..', 'public'));
  
  // Poslouchá na všech rozhraních (pro kamarády v síti)
  await app.listen(3000, '0.0.0.0');
}
bootstrap();