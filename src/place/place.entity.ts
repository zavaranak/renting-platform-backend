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

@ObjectType()
@Entity()
export class Place {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

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
  type: string;

  @Column({ type: 'real' })
  @Field()
  area: number;

  @Column({ type: 'bigint' })
  @Field()
  createdAt: number;

  @ManyToOne(() => Landlord, (landlord) => landlord.places)
  @Field()
  landlord: Landlord;

  @OneToMany(() => Booking, (booking) => booking.place)
  @Field(() => [Booking])
  bookings: Booking[];
}
