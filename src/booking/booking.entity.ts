import { Field, ObjectType } from '@nestjs/graphql';
import { Place } from 'src/place/place.entity';
import { Tenant } from 'src/tenant/tenant.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class Booking {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'bigint' })
  createdAt: number;

  @Field()
  @Column({ type: 'bigint' })
  startAt: number;

  @Field()
  @Column({ type: 'bigint' })
  endAt: number;

  @Field(() => Tenant)
  @ManyToOne(() => Tenant, (tenant) => tenant.bookings)
  tenant: Tenant;

  @Field(() => Place)
  @ManyToOne(() => Place, (place) => place.bookings)
  place: Place;
}
