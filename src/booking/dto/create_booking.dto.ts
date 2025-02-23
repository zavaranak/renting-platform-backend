import { Field, InputType } from '@nestjs/graphql';
import { Payment, TermUnit } from 'src/common/constants';

@InputType()
export class BookingInput {
  @Field({ nullable: true })
  startAt?: number;
  @Field({ nullable: true })
  endAt?: number;
  @Field(() => TermUnit)
  termUnit: TermUnit;
  @Field()
  period: number;
  @Field()
  totalCharge: number;
  @Field()
  tenantId: string;
  @Field()
  placeId: string;
  @Field(() => Payment)
  payment: Payment;
}
