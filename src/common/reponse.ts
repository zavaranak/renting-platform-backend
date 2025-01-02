import { Field, ObjectType } from '@nestjs/graphql';
import { ActionStatus } from './constants';
import { Tenant } from 'src/tenant/tenant.entity';
import { Landlord } from 'src/landlord/landlord.entity';
import { Place } from 'src/place/place.entity';
import { Booking } from 'src/booking/booking.entity';
import { BookingReview } from 'src/booking/booking_review/booking_review.entity';
import { Notification } from 'src/notifcation/notification.entity';

@ObjectType()
export class QueryResponse {
  @Field()
  message: string;
  @Field(() => Tenant, { nullable: true })
  tenant?: Tenant;
  @Field(() => Landlord, { nullable: true })
  landlord?: Landlord;
  @Field(() => Place, { nullable: true })
  place?: Place;
  @Field(() => Booking, { nullable: true })
  booking?: Booking;
  @Field(() => BookingReview, { nullable: true })
  bookingReview?: BookingReview;

  @Field(() => [Notification], { nullable: true })
  notifications?: Notification[];
  @Field(() => ActionStatus, { nullable: true })
  type: ActionStatus;
}
