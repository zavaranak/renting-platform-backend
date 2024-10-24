import { Field, InputType } from '@nestjs/graphql';
import { TermUnit } from 'src/common/constants';

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
  tenantId: string;
  @Field()
  placeId: string;
}
