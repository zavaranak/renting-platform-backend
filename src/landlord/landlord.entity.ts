import { ObjectType, Field } from '@nestjs/graphql';
import { UserStatus } from 'src/common/constants';
import { Place } from 'src/place/place.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LandlordAttribute } from './landlord_attribute.entity';

@Entity()
@ObjectType()
export class Landlord {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field()
  @Column({ type: 'varchar' })
  username: string;
  @Field()
  @Column({ type: 'varchar' })
  password: string;
  @Field()
  @Column({ type: 'bigint' })
  createdAt: number;
  @Field()
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.VERIFIED })
  status: UserStatus;
  @OneToMany(() => Place, (place) => place.landlord, { nullable: true })
  @Field(() => [Place], { nullable: true })
  places: Place[];
  @OneToMany(() => LandlordAttribute, (attribute) => attribute.landlord, {
    nullable: true,
  })
  @Field(() => [LandlordAttribute], { nullable: true })
  attributes: LandlordAttribute[];
}
