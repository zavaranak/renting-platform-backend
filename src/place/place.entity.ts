import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
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
import { PlaceStatus } from 'src/common/constants';

export enum PlaceTypes {
  HOTEL = 'hotel',
  HOUSE = 'house',
  HOMESTAY = 'homestay',
  APPARTMENT = 'appartment',
  OFFICE = 'office',
  COMMERCIAL = 'commercial',
  WAREHOUSE = 'warehouse',
  EVENT_VENUE = 'event venue',
}

registerEnumType(PlaceTypes, {
  name: 'PlaceTypes',
});

registerEnumType(PlaceStatus, {
  name: 'PlaceStatus',
});

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

  @Column({ type: 'varchar', array: true })
  @Field(() => [PlaceTypes])
  type: PlaceTypes[];

  @Column({ type: 'real' })
  @Field()
  area: number;

  @Column({ type: 'bigint', nullable: true })
  @Field()
  createdAt: number;

  @Column({ type: 'bigint' })
  @Field()
  lastUpdate: number;

  @Column({ type: 'real', nullable: true })
  @Field()
  price: number;

  @Column({ type: 'real', nullable: true })
  @Field()
  rating: number;

  @Column({ type: 'varchar', array: true, nullable: true })
  @Field(() => [String], { nullable: true })
  photos: string[];

  @Column({ type: 'enum', enum: PlaceStatus, default: PlaceStatus.FOR_RENT })
  @Field(() => PlaceStatus)
  status: PlaceStatus;

  @ManyToOne(() => Landlord, (landlord) => landlord.places)
  @Field()
  landlord: Landlord;

  @OneToMany(() => Booking, (booking) => booking.place)
  @Field(() => [Booking], { nullable: true })
  bookings: Booking[];

  @OneToMany(() => PlaceAttribute, (attribute) => attribute.place)
  @Field(() => [PlaceAttribute], { nullable: true })
  attributes: PlaceAttribute[];
}
