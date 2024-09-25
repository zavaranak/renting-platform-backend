import { Args, Query, Resolver } from '@nestjs/graphql';
import { CountryAttribute } from './country_attribute.model';
import { CountryService } from '../country.service';
import { Inject } from '@nestjs/common';

@Resolver(() => CountryAttribute)
export class CountryAttributeResolver {
  constructor(@Inject(CountryService) private countryService: CountryService) {}
  @Query(() => CountryAttribute)
  getAttributesByCountryId(@Args('id') id: string) {
    return this.countryService.getAttributesById(id);
  }
}
