import { Field, InputType } from '@nestjs/graphql';
import { PlaceTypes, TermUnit } from 'src/common/constants';

@InputType()
export class PlaceUpdateInput {
  @Field()
  id: string;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  country?: string;
  @Field({ nullable: true })
  address?: string;
  @Field({ nullable: true })
  city?: string;
  @Field(() => String, { nullable: true })
  area?: number;
  @Field(() => String, { nullable: true })
  distanceFromCenter?: number;
  @Field({ nullable: true })
  price?: number;
  @Field(() => [TermUnit], { nullable: true })
  termUnit?: TermUnit[];
  @Field(() => [String], { nullable: true })
  photos?: string[];
  @Field(() => [PlaceTypes], { nullable: true })
  type?: PlaceTypes[];
}
