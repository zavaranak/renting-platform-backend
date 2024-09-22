import { Module } from '@nestjs/common';
import { CurrencyResolver } from './currency.resolver';
// import { CurrencyAttributeResolver } from './currency_attributes/currency_attributes.resolver';

@Module({
  providers: [CurrencyResolver],
})
export class CurrencyModule {}
