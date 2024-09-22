import { Module } from '@nestjs/common';
import { CountryResovler } from './country.resolver';

@Module({
  providers: [CountryResovler],
})
export class CountryModule {}
