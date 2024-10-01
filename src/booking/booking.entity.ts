import { Field, ObjectType } from '@nestjs/graphql';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class Booking {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field()
  @Field({ defaultValue: () => Date.now() })
  @Column({ default: () => Date.now() })
  createdAt: number;
  @Field()
  @Column()
  startAt: number;
  @Field()
  @Column()
  endAt: number;
  @ManyToOne(() => Tenant)
  tenant: Tenant;
}
