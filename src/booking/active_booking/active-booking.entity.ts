import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Tenant } from 'src/tenant/tenant.entity';
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { TermUnit, Payment } from 'src/common/constants';

@Entity()
@ObjectType()
export class ActiveBooking {
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

  @Field(() => TermUnit)
  @Column({ type: 'enum', enum: TermUnit })
  termUnit: TermUnit;

  @Field()
  @Column({ type: 'real' })
  period: number;

  @Field()
  @Column({ type: 'real' })
  totalCharge: number;

  @Field()
  @Column({ type: 'uuid' })
  tenantId: string;

  @Field(() => Payment)
  @Column({ type: 'enum', enum: Payment })
  payment: Payment;

  @Field()
  @Column({ type: 'uuid' })
  placeId: string;

  @Field({ nullable: true })
  @Column({ type: 'bigint', nullable: true })
  paidDate: number;
}
