import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '6mb' }));
  app.use(urlencoded({ extended: true, limit: '6mb' }));
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Failed to bootstrap Nest app', error);
  process.exitCode = 1;
});
