import { Field, ObjectType } from '@nestjs/graphql';
import { Landlord } from 'src/landlord/landlord.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType()
@Entity()
export class City {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id?: string;

  @Column({ type: 'varchar' })
  @Field()
  name: string;

  @Column({ array: true })
  @Field()
  names: string[];

  @Column({ type: 'varchar' })
  @Field()
  country: string;
}
