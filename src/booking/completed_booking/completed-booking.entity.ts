import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Place } from 'src/place/place.entity';
import { Tenant } from 'src/tenant/tenant.entity';
import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { BookingStatus, TermUnit } from 'src/common/constants';
import { BookingReview } from '@booking/booking_review/booking_review.entity';

registerEnumType(BookingStatus, {
  name: 'BookingStatus',
});

@Entity()
@ObjectType()
export class CompletedBooking {
  @Field()
  @PrimaryColumn('uuid')
  id?: string;

  @Field()
  @Column({ type: 'bigint' })
  createdAt: number;

  @Field()
  @Column({ type: 'bigint' })
  lastUpdate: number;

  @Field()
  @Column({ type: 'bigint' })
  startAt: number;

  @Field()
  @Column({ type: 'bigint' })
  endAt: number;

  @Field()
  @Column({ type: 'enum', enum: TermUnit })
  termUnit: TermUnit;

  @Field()
  @Column({ type: 'real' })
  period: number;

  @Column({ type: 'enum', enum: BookingStatus })
  @Field(() => BookingStatus)
  status: BookingStatus;

  @Field()
  @Column({ type: 'real' })
  totalCharge: number;

  @Field(() => Tenant)
  @ManyToOne(() => Tenant, (tenant) => tenant.bookings)
  tenant: Tenant;

  @Column({ type: 'varchar' })
  @Field()
  placeId: string;

  @OneToMany(() => BookingReview, (booking_review) => booking_review.booking, {
    nullable: true,
  })
  @Field(() => [BookingReview], { nullable: true })
  reviews?: BookingReview[];
}
