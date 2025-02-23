import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Gender } from '../common/constants';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Profile {
  @Field()
  @PrimaryColumn('uuid')
  id?: string;

  @Field()
  @Column({ type: 'bigint' })
  createdAt: number;

  @Field()
  @Column({ type: 'uuid' })
  tenantId: string;

  @Field()
  @Column({ type: 'varchar' })
  firstName: string;

  @Field()
  @Column({ type: 'varchar' })
  lastName: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  middleName: string;

  @Field(() => Gender, { nullable: true })
  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Field()
  @Column({ type: 'bigint' })
  birthday: number;

  @Field()
  @Column({ type: 'varchar' })
  email: string;

  @Field()
  @Column({ type: 'varchar' })
  tel: string;
}
