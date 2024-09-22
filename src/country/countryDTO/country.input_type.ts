import { Field, InputType } from '@nestjs/graphql';
import { CountryAttributes } from '../country_attributes/country_attributes.model';

@InputType()
export class addCountry {
  @Field(() => String)
  name: string;
  @Field(() => String)
  language: string;
  @Field(() => [String], { nullable: true })
  banksId: string[];
  @Field(() => [CountryAttributes], { nullable: true })
  attributes: CountryAttributes[];
}
