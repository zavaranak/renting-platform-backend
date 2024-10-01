import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum TenantStatus {
  VERIFIED = 'verified',
  NOT_VERIFIRED = 'not_verified',
  BLOCKED = 'blocked',
}

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
  @Field()
  password?: string;

  @Column({ type: 'integer' })
  @Field({ defaultValue: () => Date.now() })
  createdAt: number;

  @Column({ type: 'enum', enum: TenantStatus, default: TenantStatus.VERIFIED })
  @Field({ defaultValue: TenantStatus.VERIFIED })
  status: TenantStatus;
}
