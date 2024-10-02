import { Field, ObjectType } from '@nestjs/graphql';
import { Place } from '../place.entity';

@ObjectType()
export class PlaceResponse {
  @Field()
  message: string;
  @Field(() => Place)
  place: Place;
}
