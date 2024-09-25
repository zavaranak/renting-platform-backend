import { Module } from '@nestjs/common';
import { CountryResovler } from './country.resolver';
import { CountryService } from './country.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './country.model';
import { LanguageCode } from './language_codes/language-code.entity';
import { CountryAttribute } from './country_attribute/country_attribute.model';
import { LanguageAttribute } from './language_codes/language-codes_attribute/language-codes_attribute.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Country,
      CountryAttribute,
      LanguageCode,
      LanguageAttribute,
    ]),
  ],
  providers: [CountryResovler, CountryService],
})
export class CountryModule {}
