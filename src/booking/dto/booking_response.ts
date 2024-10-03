import { Field, ObjectType } from '@nestjs/graphql';
import { Booking } from '../booking.entity';
@ObjectType()
export class BookingResponse {
  @Field()
  message: string;
  @Field(() => Booking)
  booking: Booking;
}
