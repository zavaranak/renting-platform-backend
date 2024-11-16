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
  @Field()
  area: number;
  @Field()
  landlordId: string;
  @Field(() => [PlaceTypes])
  type: PlaceTypes[];
  @Field(() => [TermUnit])
  termUnit: TermUnit[];
}
