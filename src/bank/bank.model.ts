import { ObjectType, Field } from '@nestjs/graphql';
import { BankAttributes } from './bank_attributes/bank_attributes.model';
import { Currency } from 'src/currency/currency.model';
import { Country } from 'src/country/country.model';

@ObjectType()
export class Bank {
  @Field(() => String)
  id: string;
  @Field(() => String)
  name: string;
  @Field(() => Country)
  country: Country;
  @Field(() => [Currency], { nullable: true })
  currencies: [Currency];
  @Field(() => [BankAttributes], { nullable: true })
  attributes: BankAttributes[];
}
