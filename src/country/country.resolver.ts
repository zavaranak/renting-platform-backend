import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Country } from './country.model';
import { mockData } from 'src/common/mock/mock';
import { CountryService } from './country.service';
import { Inject } from '@nestjs/common';
import { AddCountryInput } from './countryDTO/country.input_type';

@Resolver(() => Country)
export class CountryResovler {
  constructor(@Inject(CountryService) private countryService: CountryService) {}

  @Query(() => [Country], { nullable: true })
  getAllCountries() {
    return this.countryService.getAllCountries();
  }
  @Query(() => Country, { nullable: true })
  getCountry(@Args('id') id: string) {
    return mockData.mockCountryData.find((country) => country.id === id);
  }

  @Mutation(() => Country)
  addCountry(@Args('addCountryInput') addCountryInput: AddCountryInput) {
    return this.countryService.addCountry(addCountryInput);
  }
}
