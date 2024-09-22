import { ObjectType, Field } from '@nestjs/graphql';
import { CurrencyAttribute } from './currency_attribute/currency_attribute.model';
import { Bank } from 'src/bank/bank.model';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'currencies' })
@ObjectType()
export class Currency {
  @PrimaryGeneratedColumn()
  @Field()
  id: string;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  symbol: string;

  @ManyToOne(() => Bank, (bank) => bank.currencies)
  @Field(() => Bank)
  banks: Bank;

  @OneToMany(
    () => CurrencyAttribute,
    (currencyAttribute) => currencyAttribute.currency,
  )
  @Field(() => [CurrencyAttribute])
  attributes: CurrencyAttribute[];
}
