import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Country } from './country.model';
import { CountryService } from './country.service';
import { Inject } from '@nestjs/common';
import { AddCountryInput } from './countryDTO/country.input_type';
import { Response } from 'src/common/Response.model';

@Resolver(() => Country)
export class CountryResovler {
  constructor(@Inject(CountryService) private countryService: CountryService) {}

  @Query(() => [Country], { nullable: true })
  getAllCountries() {
    return this.countryService.getAllCountries();
  }
  @Query(() => Country, { nullable: true })
  getCountry(@Args('id') id: string) {
    return this.countryService.getCountryById(id);
  }
  @Query(() => Country, { nullable: true })
  getCountry2(@Args('id') id: string) {
    return this.countryService.getLanguageByName(id);
  }

  @Mutation(() => Response)
  addCountry(@Args('addCountryInput') addCountryInput: AddCountryInput) {
    return this.countryService.addCountry(addCountryInput);
  }
}
