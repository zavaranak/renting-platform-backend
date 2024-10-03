import { ObjectType, Field } from '@nestjs/graphql';
import { Booking } from 'src/booking/booking.entity';
import { UserStatus } from 'src/common/constants';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TenantAttribute } from './tenant_attribute.entity';

// export enum TenantStatus {
//   VERIFIED = 'verified',
//   NOT_VERIFIRED = 'not_verified',
//   BLOCKED = 'blocked',
// }

@Entity()
@ObjectType()
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id?: string;

  @Column({ type: 'varchar' })
  @Field()
  username: string;

  @Column({ type: 'varchar' })
  @Field({ nullable: true })
  password: string;

  @Column({ type: 'bigint' })
  @Field()
  createdAt: number;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.VERIFIED })
  @Field()
  status: UserStatus;

  @OneToMany(() => Booking, (booking) => booking.tenant, { nullable: true })
  @Field(() => [Booking], { nullable: true })
  bookings?: Booking[];

  @OneToMany(() => TenantAttribute, (attribute) => attribute.tenant, {
    nullable: true,
  })
  @Field(() => [TenantAttribute], { nullable: true })
  attributes?: TenantAttribute[];
}
