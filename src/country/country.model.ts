import { Field, ObjectType } from '@nestjs/graphql';
import { Bank } from 'src/bank/bank.model';
import { CountryAttribute } from './country_attribute/country_attribute.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'countries' })
@ObjectType()
export class Country {
  @PrimaryGeneratedColumn()
  @Field()
  id: string;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  name: string;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  language: string;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  alpha3b: string;

  @OneToMany(() => Bank, (bank) => bank.country, { nullable: true })
  @Field(() => [Bank], { nullable: true })
  banks?: Bank[];

  @OneToMany(
    () => CountryAttribute,
    (countryAttribbute) => countryAttribbute.country,
  )
  @Field(() => [CountryAttribute])
  attributes: CountryAttribute[];
}
