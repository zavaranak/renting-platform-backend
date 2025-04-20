import { Field, InputType } from '@nestjs/graphql';
import { TermUnit, PlaceTypes } from 'src/common/constants';

@InputType()
export class PlaceInput {
  @Field()
  name: string;
  @Field()
  address: string;
  @Field()
  city: string;
  @Field()
  country: string;
  @Field(() => String)
  area: number;
  @Field()
  landlordId: string;
  @Field(() => String)
  distanceFromCenter: number;
  @Field(() => [PlaceTypes])
  type: PlaceTypes[];
  @Field(() => [TermUnit])
  termUnit: TermUnit[];
}
