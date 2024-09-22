import { Field, ObjectType } from '@nestjs/graphql';
import { Bank } from 'src/bank/bank.model';
import { CountryAttributes } from './country_attributes/country_attributes.model';

@ObjectType()
export class Country {
  @Field(() => String)
  id: string;
  @Field(() => String)
  name: string;
  @Field(() => String)
  language: string;
  @Field(() => [Bank], { nullable: true })
  banks: Bank[];
  @Field(() => [CountryAttributes])
  attributes: CountryAttributes[];
}
