import { Field, ObjectType } from '@nestjs/graphql';
import { ActionStatus } from './constants';
import { Tenant } from 'src/tenant/tenant.entity';
import { Landlord } from 'src/landlord/landlord.entity';
import { Place } from 'src/place/place.entity';
import { BookingReview } from 'src/booking/booking_review/booking_review.entity';
import { Notification } from 'src/notifcation/notification.entity';
import { CompletedBooking } from '@booking/completed_booking/completed-booking.entity';
import { ActiveBooking } from '@booking/active_booking/active-booking.entity';
import { PendingBooking } from '@booking/pending_booking/pending-booking.entity';

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
  @Field(() => CompletedBooking, { nullable: true })
  completedBooking?: CompletedBooking;
  @Field(() => ActiveBooking, { nullable: true })
  activeBooking?: ActiveBooking;
  @Field(() => PendingBooking, { nullable: true })
  pendingBooking?: PendingBooking;
  @Field(() => BookingReview, { nullable: true })
  bookingReview?: BookingReview;
  @Field(() => [Notification], { nullable: true })
  notifications?: Notification[];
  @Field(() => [String], { nullable: true })
  customData?: String[];

  @Field(() => ActionStatus, { nullable: true })
  type: ActionStatus;
}
