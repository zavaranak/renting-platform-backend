import { Field, InputType } from '@nestjs/graphql';
import { PlaceTypes } from '../place.entity';

@InputType()
export class PlaceUpdateInput {
  @Field()
  id: string;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  address?: string;
  @Field({ nullable: true })
  city?: string;
  @Field({ nullable: true })
  area?: number;
  @Field({ nullable: true })
  price?: number;
  @Field(() => [PlaceTypes], { nullable: true })
  type?: PlaceTypes[];
}
