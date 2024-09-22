import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddCurrencyInput {
  @Field(() => String)
  symbol: string;
  @Field(() => [String])
  banksId: string[];
}
