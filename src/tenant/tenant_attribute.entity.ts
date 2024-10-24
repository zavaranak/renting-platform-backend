import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TenantAttributeName } from 'src/common/constants';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tenant } from './tenant.entity';

registerEnumType(TenantAttributeName, { name: 'TenantAttributeNames' });
@ObjectType()
@Entity()
export class TenantAttribute {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Field(() => TenantAttributeName)
  @Column({ type: 'enum', enum: TenantAttributeName })
  name: TenantAttributeName;

  @Field()
  @Column({ type: 'varchar' })
  value: string;

  @Field()
  @Column({ type: 'varchar' })
  type: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.attributes)
  @Field(() => Tenant)
  tenant: Tenant;
}
