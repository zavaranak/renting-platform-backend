import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Tenant } from 'src/tenant/tenant.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TermUnit } from 'src/common/constants';

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

  @Field(() => Tenant)
  @Column({ type: 'varchar' })
  tenantId: string;

  @Field()
  @Column({ type: 'varchar' })
  placeId: string;

  //userId + role
  @Field()
  @Column({ type: 'varchar', nullable: true })
  updateBy?: string;
}
