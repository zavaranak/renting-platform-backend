import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Tenant } from 'src/tenant/tenant.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Payment, TermUnit } from 'src/common/constants';

@Entity()
@ObjectType()
export class PendingBooking {
  @Field()
  @PrimaryGeneratedColumn('uuid')
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

  @Field()
  @Column({ type: 'real' })
  totalCharge: number;

  @Field()
  @Column({ type: 'uuid' })
  tenantId: string;

  @Field()
  @Column({ type: 'varchar' })
  placeId: string;

  @Field(() => Payment)
  @Column({ type: 'enum', enum: Payment })
  payment: Payment;

  @Field()
  @Column({ type: 'varchar', nullable: true })
  updateBy?: string;
}
