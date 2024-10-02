import { Field, InputType } from '@nestjs/graphql';
import { Place } from 'src/place/place.entity';
import { Tenant } from 'src/tenant/tenant.entity';
import { TermUnit } from '../booking.entity';

@InputType()
export class BookingInput {
  @Field()
  startAt: number;
  @Field()
  endAt: number;
  @Field(() => TermUnit)
  termUnit: TermUnit;
  @Field()
  period: number;
  @Field()
  totalCharge: number;
  @Field()
  tenant: Tenant;
  @Field()
  place: Place;
}
