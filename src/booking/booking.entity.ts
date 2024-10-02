import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Place } from 'src/place/place.entity';
import { Tenant } from 'src/tenant/tenant.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export enum TermUnit {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'weak',
  MONTH = 'month',
  YEAR = 'year',
}

registerEnumType(TermUnit, { name: 'TermUnit' });

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

  @Field()
  @Column({ type: 'enum', enum: TermUnit })
  termUnit: TermUnit;

  @Field()
  @Column({ type: 'real' })
  period: number;

  @Field()
  @Column({ type: 'real' })
  totalCharge: number;

  @Field(() => Tenant)
  @ManyToOne(() => Tenant, (tenant) => tenant.bookings)
  tenant: Tenant;

  @Field(() => Place)
  @ManyToOne(() => Place, (place) => place.bookings)
  place: Place;
}
