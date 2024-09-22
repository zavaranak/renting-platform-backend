import { Module } from '@nestjs/common';
import { CountryResovler } from './country.resolver';
import { CountryService } from './country.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './country.model';
import { LanguageCodeService } from './language_codes/languageCode.service';
import { LanguageCode } from './language_codes/language-code.entity';
import { CountryAttribute } from './country_attribute/country_attribute.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country, CountryAttribute, LanguageCode]),
  ],
  providers: [CountryResovler, CountryService, LanguageCodeService],
})
export class CountryModule {}
