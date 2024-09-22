import { ObjectType, Field } from '@nestjs/graphql';
import { CurrencyAttribute } from './currency_attributes/currency_attributes.model';
import { Bank } from 'src/bank/bank.model';

@ObjectType()
export class Currency {
  @Field(() => String)
  id: string;
  @Field(() => String)
  symbol: string;
  @Field(() => [Bank])
  banks: Bank[];
  @Field(() => [CurrencyAttribute])
  attributes: CurrencyAttribute[];
}
