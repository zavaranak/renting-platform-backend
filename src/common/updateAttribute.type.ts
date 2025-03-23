import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AttributeUpdateInput {
  @Field()
  id: string;
  @Field({ nullable: true })
  value?: string;
  @Field({ nullable: true })
  valueNumber?: number;
}
