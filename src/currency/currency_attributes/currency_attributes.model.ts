import { Field, ObjectType } from '@nestjs/graphql';
import { Currency } from '../currency.model';

@ObjectType()
export class CurrencyAttribute {
  @Field(() => String)
  id: string;
  @Field(() => String)
  value: string;
  @Field(() => String)
  name: string;
  @Field(() => Currency)
  currency: Currency;
}
