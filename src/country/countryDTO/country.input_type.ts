import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddCountryInput {
  @Field()
  name: string;
  @Field({ nullable: true })
  language?: string;
  @Field({ nullable: true })
  alpha3b?: string;
  // @Field(() => [String], { nullable: true })
  // banksId?: string[];
}
