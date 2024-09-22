import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LanguageCodeService } from './country/language_codes/languageCode.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const langService = app.get(LanguageCodeService);
  // langService.showLanguage('src/common/language_codes/language-codes-full.csv');
  await app.listen(3000);
}
bootstrap();
