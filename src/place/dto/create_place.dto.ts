import { Field, InputType } from '@nestjs/graphql';
import { PlaceTypes } from '../place.entity';

@InputType()
export class PlaceInput {
  @Field()
  name: string;
  @Field()
  address: string;
  @Field()
  city: string;
  @Field()
  area: number;
  @Field()
  price: number;
  @Field()
  landlordId: string;
  @Field(() => [PlaceTypes])
  type: PlaceTypes[];
}
