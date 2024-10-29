import { Field, ObjectType } from '@nestjs/graphql';
import { Tenant } from 'src/tenant/tenant.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from '../booking.entity';

@Entity()
@ObjectType()
export class BookingReview {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id?: string;

  @Column({ type: 'real' })
  @Field()
  star: number;

  @Column({ type: 'varchar' })
  @Field()
  reviewText?: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  @Field(() => [String], { nullable: true })
  reviewPhotos?: string[];

  @Column({ type: 'bigint' })
  @Field()
  createdAt: number;

  @ManyToOne(() => Tenant)
  @Field(() => Tenant)
  tenant: Tenant;

  @ManyToOne(() => Booking, (booking) => booking.reviews)
  @Field(() => Booking)
  booking: Booking;
}
