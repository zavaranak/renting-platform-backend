import { ObjectType, Field } from '@nestjs/graphql';
import { Country } from '../country.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'country_attributes' })
@ObjectType()
export class CountryAttribute {
  @PrimaryGeneratedColumn()
  @Field()
  id: string;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  name: string;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  value: string;

  @ManyToOne(() => Country, (country) => country.attributes)
  @Field(() => Country)
  country: Country;
}
