import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { AttributeTypes, TenantAttributeNames } from 'src/common/constants';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tenant } from './tenant.entity';

registerEnumType(TenantAttributeNames, { name: 'TenantAttributeNames' });
registerEnumType(AttributeTypes, { name: 'AttributeTypes' });
@ObjectType()
@Entity()
export class TenantAttribute {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => TenantAttributeNames)
  @Column({ type: 'enum', enum: TenantAttributeNames })
  name: TenantAttributeNames;

  @Field()
  @Column()
  value: string;

  @Field(() => AttributeTypes)
  @Column({ type: 'enum', enum: AttributeTypes })
  type: AttributeTypes;

  @ManyToOne(() => Tenant, (tenant) => tenant.attributes)
  @Field(() => Tenant)
  tenant: Tenant;
}
