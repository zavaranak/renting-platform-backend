import { Resolver, Query, Args } from '@nestjs/graphql';
import { Country } from './country.model';
import { mockData } from 'src/common/language_codes/mock/mock';

@Resolver(() => Country)
export class CountryResovler {
  @Query(() => [Country])
  getAllCountries() {
    return mockData.mockCountryData;
  }
  @Query(() => Country, { nullable: true })
  getCountry(@Args('id') id: string) {
    return mockData.mockCountryData.find((country) => country.id === id);
  }
}
