import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class addCountryAttribute {
  @Field(() => String)
  name: string;
  @Field(() => String)
  value: string;
}
