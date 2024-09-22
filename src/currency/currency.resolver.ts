import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Currency } from './currency.model';
import { mockData } from 'src/common/language_codes/mock/mock';
import { AddCurrencyInput } from './currencyDTO/currency.input_type';

@Resolver(() => Currency)
export class CurrencyResolver {
  @Query(() => [Currency])
  getAllCurrencies() {
    return mockData.mockCurencyData;
  }
  @Query(() => Currency, { nullable: true })
  getCurrency(@Args('id') id: string) {
    return mockData.mockCurencyData.find((currency) => currency.id === id);
  }

  @Mutation(() => Currency)
  addCurrency(@Args('addCurrencyData') addCurrencyData: AddCurrencyInput) {
    return addCurrencyData;
  }
}
