import { ObjectType, Field } from '@nestjs/graphql';
import { UserStatus } from 'src/common/constants';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TenantAttribute } from './tenant_attribute.entity';

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

  @Column({ type: 'varchar', array: true, nullable: true })
  @Field(() => [String], { nullable: true })
  bookings?: string[];

  @OneToMany(() => TenantAttribute, (attribute) => attribute.tenant, {
    nullable: true,
  })
  @Field(() => [TenantAttribute], { nullable: true })
  attributes?: TenantAttribute[];
}
