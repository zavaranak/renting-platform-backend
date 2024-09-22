import { ObjectType, Field } from '@nestjs/graphql';
import { Country } from '../country.model';

@ObjectType()
export class CountryAttributes {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field()
  value: string;
  @Field(() => Country)
  country: Country;
}
