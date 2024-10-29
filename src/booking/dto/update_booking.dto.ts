import { Field, InputType } from '@nestjs/graphql';
import { BookingStatus, TermUnit } from 'src/common/constants';

@InputType()
export class BookingUpdateInput {
  @Field()
  id: string;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  address?: string;
  @Field({ nullable: true })
  period?: string;
  @Field({ nullable: true })
  endAt?: number;
  @Field({ nullable: true })
  startAt?: number;
  @Field({ nullable: true })
  totalCharge?: number;
  @Field(() => TermUnit, { nullable: true })
  termUnit?: TermUnit;
  @Field(() => BookingStatus, { nullable: true })
  status?: BookingStatus;
}
