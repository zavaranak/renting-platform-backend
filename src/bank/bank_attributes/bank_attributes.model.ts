import { ObjectType, Field } from '@nestjs/graphql';
import { Bank } from '../bank.model';

@ObjectType()
export class BankAttributes {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field()
  value: string;
  @Field(() => Bank)
  bank: Bank;
}
