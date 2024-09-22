import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddCountryInput {
  @Field()
  name: string;
  @Field()
  language?: string;
  @Field()
  alpha3b?: string;
  @Field(() => [String], { nullable: true })
  banksId?: string[];
}
