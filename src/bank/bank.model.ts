import { ObjectType, Field } from '@nestjs/graphql';
import { BankAttribute } from './bank_attributes/bank_attributes.model';
import { Currency } from 'src/currency/currency.model';
import { Country } from 'src/country/country.model';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'banks' })
@ObjectType()
export class Bank {
  @PrimaryGeneratedColumn()
  @Field()
  id: string;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  name: string;

  @ManyToOne(() => Country, (country) => country.banks)
  @Field(() => Country)
  country: Country;

  @OneToMany(() => Currency, (currency) => currency.banks)
  @Field(() => [Currency], { nullable: true })
  currencies: [Currency];

  @OneToMany(() => BankAttribute, (bankAttribute) => bankAttribute.bank)
  @Field(() => [BankAttribute], { nullable: true })
  attributes: BankAttribute[];
}
