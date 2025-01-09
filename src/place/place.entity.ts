import { Field, ObjectType } from '@nestjs/graphql';
import { Booking } from 'src/booking/booking.entity';
import { Landlord } from 'src/landlord/landlord.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PlaceAttribute } from './place_attribute.entity';
import { PlaceStatus, TermUnit, PlaceTypes } from 'src/common/constants';

@ObjectType()
@Entity()
export class Place {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id?: string;

  @Column({ type: 'varchar' })
  @Field()
  name: string;

  @Column({ type: 'varchar' })
  @Field()
  address: string;

  @Column({ type: 'varchar' })
  @Field()
  city: string;
  @Column({ type: 'varchar' })
  @Field()
  country: string;

  @Column({ type: 'varchar', array: true })
  @Field(() => [PlaceTypes])
  type: PlaceTypes[];

  @Column({ type: 'varchar', array: true })
  @Field(() => [TermUnit])
  termUnit: TermUnit[];

  @Column({ type: 'real' })
  @Field()
  area: number;

  @Column({ type: 'bigint', nullable: true })
  @Field()
  createdAt: number;

  @Column({ type: 'bigint' })
  @Field()
  lastUpdate: number;

  @Column({ type: 'real', nullable: true, default:0 })
  @Field()
  rating?: number;

  @Column({ type: 'varchar', array: true, nullable: true })
  @Field(() => [String], { nullable: true })
  photos?: string[];

  @Column({ type: 'enum', enum: PlaceStatus, default: PlaceStatus.FOR_RENT })
  @Field(() => PlaceStatus)
  status: PlaceStatus;

  @ManyToOne(() => Landlord, (landlord) => landlord.places)
  @Field({nullable:true})
  landlord: Landlord;

  @OneToMany(() => Booking, (booking) => booking.place)
  @Field(() => [Booking], { nullable: true })
  bookings?: Booking[];

  @OneToMany(() => PlaceAttribute, (attribute) => attribute.place)
  @Field(() => [PlaceAttribute], { nullable: true })
  attributes?: PlaceAttribute[];
}
