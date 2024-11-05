import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AttributeUpdateInput {
  @Field()
  id: string;
  @Field()
  value: string;
}
