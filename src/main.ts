import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // const configService = new ConfigService();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/storage' });
  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFieldSize: 100000, maxFiles: 20 }),
  );
  await app.listen(configService.get<number>('APP_PORT'));
}
bootstrap();
